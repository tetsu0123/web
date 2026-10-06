"""Presentation checks on locally rendered HTML with an explicit storage test double.
Requires Python Playwright and an installed Chromium.
"""
import json, shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
report={'version':'2.1.0','source':'set_content standalone.html with explicit memory storage','checks':[],'viewports':[],'errors':[],'limitations':['HTTP navigation was blocked by the execution environment (ERR_BLOCKED_BY_ADMINISTRATOR). No HTTP reload, real browser persistent storage, service-worker/offline lifecycle or deployed CDN check was completed.', 'Physical iOS/Android devices and native installation are not tested.']}
def check(text):report['checks'].append(text);print(text,flush=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=shutil.which('chromium'),headless=True,args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
 def fresh(saved=None):
  pg=context.new_page();pg.on('pageerror',lambda e:report['errors'].append(str(e)))
  pg.evaluate("saved=>Object.defineProperty(window,'localStorage',{value:{data:saved||{},getItem(k){return this.data[k]??null},setItem(k,v){this.data[k]=String(v)},removeItem(k){delete this.data[k]}},configurable:true})",saved)
  pg.set_content((ROOT/'standalone.html').read_text(),wait_until='domcontentloaded');pg.wait_for_function('!!window.SuitShift')
  return pg
 page=fresh()
 assert '2.1.0' in page.locator('.version').inner_text();assert page.locator('.card-face').count()==page.locator('.card').count()
 check('Standalone entry loads premium styling and visual faces without runtime errors')
 # Select and preview using the actual pointer; hit boxes must stay fixed while faces lift.
 card=page.locator('.card[data-suit="0"]').first
 before=card.bounding_box();x=before['x']+before['width']/2;y=before['y']+before['height']/2
 page.mouse.move(x,y);page.mouse.down();page.wait_for_timeout(190)
 after=card.bounding_box()
 assert abs(before['x']-after['x'])<.1 and abs(before['y']-after['y'])<.1
 assert page.evaluate("getComputedStyle(document.querySelector('.card.selected .card-face')).transform!=='none'")
 page.mouse.move(x+85,y,steps=5);assert '2組消去' in page.locator('#message').inner_text()
 page.mouse.up();page.wait_for_selector('#win:not([hidden])')
 assert page.evaluate('SuitShift.getState().moves')==1
 check('Lift and landing animation preserves pointer hit boxes, preview and two-pair clear')
 # Reuse a v2-format saved state in a fresh document, without asserting real HTTP persistence.
 page.evaluate('SuitShift.loadLevel(4)')
 page.evaluate('SuitShift.act(...SuitShift.levels[4].solution[0])');page.wait_for_function('!SuitShift.getState().busy')
 state=page.evaluate('SuitShift.getState()');assert state['moves']==1
 saved=page.evaluate('localStorage.data');page.close();page=fresh(saved)
 restored=page.evaluate('SuitShift.getState()')
 assert state['board']==restored['board'] and state['moves']==restored['moves']
 assert page.evaluate("JSON.parse(localStorage.getItem('suit-shift.save.v2')).version") == 2
 check('A v2-format save is restored into a fresh document with identical board, moves and schema (storage test double)')
 # Theme and reduced-motion preferences apply to new materials too.
 page.locator('#settings-btn').click();page.locator('[data-theme="ruby"]').click();page.locator('[data-pref="reduced"]').check();page.locator('#settings-dialog [data-close]').click()
 card=page.locator('.card').first;card.tap();assert page.locator('body').get_attribute('data-theme')=='ruby'
 assert page.evaluate("getComputedStyle(document.querySelector('.card.selected .card-face')).transform==='none'")
 page.locator('#settings-btn').click();page.locator('[data-theme="noir"]').click();page.locator('#settings-dialog [data-close]').click()
 assert page.locator('body').get_attribute('data-theme')=='noir'
 page.locator('#settings-btn').click();page.locator('[data-theme="casino"]').click();page.locator('[data-pref="reduced"]').uncheck();page.locator('#settings-dialog [data-close]').click()
 check('All three materials/themes and reduced-motion mode apply correctly')
 page.evaluate('SuitShift.loadLevel(4)');page.wait_for_timeout(350)
 for w,h in [(320,568),(360,640),(390,844),(430,932),(768,1024)]:
  page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(100)
  dims=page.evaluate('''()=>{const r=s=>{const a=document.querySelector(s).getBoundingClientRect();return {x:a.x,right:a.right,bottom:a.bottom,height:a.height};};return {board:r('#board'),actions:r('.actions'),bottom:r('.bottom-mark'),scroll:document.documentElement.scrollWidth};}''')
  assert dims['board']['x']>=8 and dims['board']['right']<=w-8
  assert dims['bottom']['bottom']<=h and dims['actions']['height']>=44 and dims['scroll']<=w
  report['viewports'].append({'width':w,'height':h,'fit':True})
  if w in [320,390]:page.screenshot(path=str(ROOT/f'docs/premium-mobile-{w}.png'),timeout=15000)
 # Genuine desktop context instead of a widened touch-emulated mobile viewport.
 desk=browser.new_context(viewport={'width':1440,'height':1000},device_scale_factor=1)
 dp=desk.new_page();dp.evaluate("Object.defineProperty(window,'localStorage',{value:{getItem(){return null},setItem(){}}})");dp.set_content((ROOT/'standalone.html').read_text(),wait_until='domcontentloaded');dp.wait_for_function('!!window.SuitShift');dp.evaluate('SuitShift.loadLevel(4)');dp.wait_for_timeout(100)
 assert dp.evaluate("document.querySelector('.bottom-mark').getBoundingClientRect().bottom<=innerHeight")
 dp.screenshot(path=str(ROOT/'docs/premium-desktop.png'),timeout=15000)
 report['viewports'].append({'width':1440,'height':1000,'fit':True})
 check('Six viewport sizes fit; desktop and high-DPI mobile screenshots saved')
 assert not report['errors'],report['errors']
 browser.close()
(ROOT/'docs/premium-browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2),flush=True)
