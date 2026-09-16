"""Chromium interaction tests via set_content. Storage is an explicit test double."""
import json, os, shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
report={'checks':[], 'consoleErrors':[], 'viewports':[]}
with sync_playwright() as p:
 executable=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium')
 browser=p.chromium.launch(**({'executable_path':executable} if executable else {}),headless=True,args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
 page=context.new_page()
 page.on('pageerror',lambda e:report['consoleErrors'].append(str(e)))
 html=(ROOT/'standalone.html').read_text()
 page.evaluate("Object.defineProperty(window, 'localStorage', {value: { data:{}, getItem(k){return this.data[k]??null}, setItem(k,v){this.data[k]=String(v)}, removeItem(k){delete this.data[k]} }, configurable:true})")
 page.set_content(html,wait_until='domcontentloaded')
 page.wait_for_function('!!window.SuitShift')
 assert page.locator('.card').count()==4
 page.screenshot(path=str(ROOT/'docs/screen-tutorial.png'))
 card=page.locator('.card[data-suit="0"]').first.bounding_box()
 x,y=card['x']+card['width']/2,card['y']+card['height']/2
 page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+110,y,steps=8)
 assert '2組消去' in page.locator('#message').inner_text()
 page.mouse.up();page.wait_for_selector('#win:not([hidden])')
 assert page.evaluate('SuitShift.getState().moves')==1
 report['checks'].append('Real pointer swipe / preview / first-level two-pair clear')
 page.locator('#next-level').click()
 assert page.evaluate('SuitShift.getState().index')==1
 page.evaluate('SuitShift.loadLevel(7)')
 before=page.evaluate('SuitShift.getState().board')
 page.evaluate('SuitShift.act(0,3)')
 assert page.evaluate('SuitShift.getState().moves')==1
 saved=page.evaluate('localStorage.data')
 page.close()
 page=context.new_page()
 page.on('pageerror',lambda e:report['consoleErrors'].append(str(e)))
 page.evaluate("saved=>Object.defineProperty(window, 'localStorage', {value: {data:saved, getItem(k){return this.data[k]??null}, setItem(k,v){this.data[k]=String(v)}, removeItem(k){delete this.data[k]}}, configurable:true})",saved)
 page.set_content(html,wait_until='domcontentloaded')
 assert page.evaluate('SuitShift.getState().moves')==1
 page.locator('#undo').click()
 assert page.evaluate('SuitShift.getState().board')==before
 report['checks'].append('Save serialization and fresh-document restore via storage test double / undo restores all cards')
 page.locator('#hint').click()
 assert page.locator('.hint-arrow').count()==1
 assert page.locator('.card.selected').count()>0
 report['checks'].append('Verified hint selects a suit and displays a direction')
 page.screenshot(path=str(ROOT/'docs/screen-hint.png'))
 page.locator('#settings-btn').click()
 page.locator('[data-pref="buttons"]').check()
 page.locator('[data-pref="reduced"]').check()
 page.locator('[data-theme="graphite"]').click()
 page.locator('#settings-dialog [data-close]').click()
 assert page.locator('#pad').is_visible()
 assert page.locator('body').get_attribute('data-theme')=='graphite'
 page.locator('.card[data-suit="0"]').first.tap()
 page.locator('#pad [data-dir="3"]').click()
 assert page.evaluate('SuitShift.getState().moves')==1
 report['checks'].append('Tap + direction buttons / settings / themes')
 for i in range(120):
  result=page.evaluate('''async i=>{SuitShift.loadLevel(i);for(const m of SuitShift.levels[i].solution)await SuitShift.act(...m);return {left:SuitShift.core.count(SuitShift.getState().board),moves:SuitShift.getState().moves,par:SuitShift.levels[i].par};}''',i)
  assert result['left']==0 and result['moves']==result['par'],(i,result)
 report['checks'].append('All 120 levels cleared via app actions and packaged solutions')
 page.wait_for_selector('#win:not([hidden])')
 page.locator('#levels-btn').click()
 assert page.locator('.level-tile').count()==120
 assert '120 / 120' in page.locator('#progress-label').inner_text()
 page.locator('[data-level="75"]').click()
 page.locator('#settings-btn').click()
 page.locator('[data-pref="buttons"]').uncheck()
 page.locator('[data-pref="reduced"]').uncheck()
 page.locator('[data-theme="midnight"]').click()
 page.locator('#settings-dialog [data-close]').click()
 page.screenshot(path=str(ROOT/'docs/screen-mobile.png'))
 for w,h in [(320,568),(360,640),(390,844),(430,932),(768,1024),(1440,1000)]:
  page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(50)
  dimensions=page.evaluate('''()=>{const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom,right:r.right};};return {board:rect('#board'),actions:rect('.actions'),page:document.documentElement.scrollWidth,inner:innerWidth};}''')
  assert dimensions['board']['x']>=0 and dimensions['board']['right']<=w+1,(w,h,dimensions)
  assert dimensions['actions']['bottom']<=h+1,(w,h,dimensions)
  assert dimensions['page']<=w,(w,h,dimensions)
  report['viewports'].append({'width':w,'height':h,'fits':True})
  if w==320:page.screenshot(path=str(ROOT/'docs/screen-small.png'))
  if w==1440:page.screenshot(path=str(ROOT/'docs/screen-desktop.png'))
 report['limitations']=['Browser URL navigation is blocked by environment administrator policy. HTML was tested through set_content; storage is an explicit in-memory test double. Actual HTTP reload, Service Worker installation/offline navigation, iOS Safari, Android hardware haptics and native installation remain unverified.']
 assert page.evaluate('''()=>{try{SuitShift.validateSave({version:1,prefs:{},best:{},session:{index:0,board:Array(20).fill(52),moves:0,history:[]}});return false;}catch{return true;}}''')
 report['checks'].append('Malformed save rejected')
 assert not report['consoleErrors'],report['consoleErrors']
 browser.close()
(ROOT/'docs/browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
