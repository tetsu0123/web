"""UI tests using local rendered HTML and an explicitly declared storage test double."""
import json, shutil, os
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
report={'version':'2.0.0','checks':[],'viewports':[],'consoleErrors':[],'limitations':['Chromium uses set_content and an in-memory storage test double. Physical iOS/Android devices, real persisted browser storage and HTTP offline lifecycle are not covered.']}
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=shutil.which('chromium'),headless=True,args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
 html=(ROOT/'standalone.html').read_text()
 def fresh(saved=None):
  page=context.new_page();page.on('pageerror',lambda e:report['consoleErrors'].append(str(e)))
  page.evaluate("saved=>Object.defineProperty(window,'localStorage',{value:{data:saved||{},getItem(k){return this.data[k]??null},setItem(k,v){this.data[k]=String(v)},removeItem(k){delete this.data[k]}},configurable:true})",saved)
  page.set_content(html,wait_until='domcontentloaded');page.wait_for_function('!!window.SuitShift');return page
 page=fresh()
 # Actual pointer interaction for tutorial preview and animation.
 card=page.locator('.card[data-suit="0"]').first.bounding_box();x=card['x']+card['width']/2;y=card['y']+card['height']/2
 page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+100,y,steps=7)
 assert '2組消去' in page.locator('#message').inner_text();page.mouse.up();page.wait_for_selector('#win:not([hidden])')
 assert page.evaluate('SuitShift.getState().moves')==1
 assert page.evaluate('SuitShift.getState().pureBest[1]')==1
 report['checks'].append('Real pointer gesture, shared-suit selection, two-pair preview and clear')
 # Reduced animation for deterministic controller tests.
 page.locator('#next-level').click();page.locator('#settings-btn').click();page.locator('[data-pref="reduced"]').check();page.locator('#settings-dialog [data-close]').click()
 page.evaluate('SuitShift.loadLevel(4)')
 # A genuine immediate-clear route takes seven moves, but level 5 permits only six.
 q=page.evaluate('SuitShift.levels[4].quality');limit=page.evaluate('SuitShift.getState().limit')
 assert q['alternativeMoves']>limit
 for m in q['alternativeSolution'][:limit]:page.evaluate('m=>SuitShift.act(...m)',m)
 assert page.evaluate('SuitShift.getState().failed')
 assert page.locator('#win h1').inner_text()=='手数切れ'
 failed=page.evaluate('SuitShift.getState()')
 assert page.evaluate('SuitShift.act(0,0)')==False
 assert page.evaluate('SuitShift.getState().moves')==limit
 page.screenshot(path=str(ROOT/'docs/screen-casino-failure.png'))
 report['checks'].append('Exact budget exhaustion fails; extra actions blocked; a measured greedy route cannot clear')
 # Reopen the document with saved failure: no reset exploit.
 saved=page.evaluate('localStorage.data');page.close();page=fresh(saved)
 assert page.evaluate('SuitShift.getState().failed')
 assert page.locator('#retry-level').is_visible()
 page.locator('#failure-undo').click()
 assert page.evaluate('SuitShift.getState().remaining')==1
 assert page.evaluate('SuitShift.getState().undoUsed')==1
 assert page.evaluate('SuitShift.undo()')==False
 saved=page.evaluate('localStorage.data');page.close();page=fresh(saved)
 assert page.evaluate('SuitShift.getState().undoUsed')==1
 assert page.locator('#undo').is_disabled()
 report['checks'].append('Failure and spent undo survive reload; undo limited to one and refunds only that move')
 # Repeated hint cannot expose the entire solution; returning cannot replenish it.
 page.evaluate('SuitShift.loadLevel(4)');page.locator('#hint').click()
 assert page.evaluate('SuitShift.getState().hintsUsed')==1
 assert page.locator('#hint').is_disabled()
 page.evaluate('SuitShift.hint()');assert page.evaluate('SuitShift.getState().hintsUsed')==1
 move=page.evaluate('SuitShift.levels[4].solution[0]');page.evaluate('m=>SuitShift.act(...m)',move);page.evaluate('SuitShift.undo()')
 assert page.evaluate('SuitShift.getState().hintsUsed')==1
 report['checks'].append('Single successful hint consumes its allowance and undo does not restore it')
 # Assistance remains distinguishable from unassisted par.
 page.evaluate('SuitShift.loadLevel(5)');page.locator('#hint').click()
 for m in page.evaluate('SuitShift.levels[5].solution'):page.evaluate('m=>SuitShift.act(...m)',m)
 page.wait_for_selector('#win:not([hidden])')
 assert page.evaluate('SuitShift.getState().best[6]')>0
 assert page.evaluate('SuitShift.getState().pureBest[6]||0')==0
 assert '補助あり' in page.locator('.perfect').inner_text()
 report['checks'].append('Assisted clear recorded without unassisted shortest medal')
 # No-op never consumes budget.
 page.evaluate('SuitShift.loadLevel(0)');assert page.evaluate('SuitShift.act(0,3)')==False
 assert page.evaluate('SuitShift.getState().moves')==0
 # All levels via actual app logic; exact final move must win instead of failing.
 for i in range(120):
  result=page.evaluate('''async i=>{SuitShift.loadLevel(i);for(const m of SuitShift.levels[i].solution)await SuitShift.act(...m);const s=SuitShift.getState();return {left:SuitShift.core.count(s.board),moves:s.moves,limit:s.limit,failed:s.failed};}''',i)
  assert result['left']==0 and not result['failed'] and result['moves']<=result['limit'],(i,result)
 page.wait_for_selector('#win:not([hidden])')
 assert page.evaluate('Object.keys(SuitShift.getState().pureBest).length')==120
 report['checks'].append('All 120 shortest routes clear in app; winning on the final permitted move takes precedence over failure')
 # Solution comparison gives actual routes and shortest continuations, only after clear.
 page.locator('#compare-routes').click();assert page.locator('.route-columns section').count()==2
 assert '手' in page.locator('.comparison-intro').inner_text();page.screenshot(path=str(ROOT/'docs/screen-casino-comparison.png'))
 page.locator('#comparison-dialog [data-close]').click()
 # Practice mode is a fresh attempt and uses separate records; no normal budget enforcement.
 page.evaluate("SuitShift.switchMode('practice',true)");page.evaluate('SuitShift.loadLevel(4)')
 for m in q['alternativeSolution']:page.evaluate('m=>SuitShift.act(...m)',m)
 page.wait_for_selector('#win:not([hidden])')
 assert page.evaluate('SuitShift.getState().practiceBest[5]')==q['alternativeMoves']
 assert page.evaluate('SuitShift.getState().best[5]')<q['alternativeMoves']
 assert page.locator('#win h1').inner_text()=='練習クリア'
 report['checks'].append('Unlimited practice allows longer valid route, with records separate from challenge')
 # Mode switching mid-attempt must restart only with explicit confirmation.
 page.evaluate('SuitShift.loadLevel(4)');page.evaluate('SuitShift.act(...SuitShift.levels[4].solution[0])')
 page.locator('#settings-btn').click();page.locator('#settings-dialog [data-mode="challenge"]').click()
 assert page.locator('#confirm-dialog').is_visible();page.locator('#confirm-yes').click()
 assert page.evaluate('SuitShift.getState().mode')=='challenge';assert page.evaluate('SuitShift.getState().moves')==0
 # Direction buttons / color options.
 page.locator('#settings-btn').click();page.locator('[data-pref="buttons"]').check();page.locator('[data-theme="ruby"]').click();page.locator('#settings-dialog [data-close]').click()
 assert page.locator('#pad').is_visible();assert page.locator('body').get_attribute('data-theme')=='ruby'
 state=page.evaluate('SuitShift.getState()');move=page.evaluate('SuitShift.levels[4].solution[0]')
 page.locator(f'.card[data-suit="{move[0]}"]').first.tap();page.locator(f'#pad [data-dir="{move[1]}"]').click()
 assert page.evaluate('SuitShift.getState().moves')==1
 report['checks'].append('Mode confirmation, direction buttons and casino color variants work')
 page.locator('#settings-btn').click();page.locator('[data-pref="buttons"]').uncheck();page.locator('[data-pref="reduced"]').uncheck();page.locator('[data-theme="casino"]').click();page.locator('#settings-dialog [data-close]').click();page.evaluate('SuitShift.loadLevel(4)')
 # All on-screen controls and the mode marker must fit, not just the cards.
 for w,h in [(320,568),(360,640),(390,844),(430,932),(768,1024),(1440,1000)]:
  page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(80)
  dims=page.evaluate('''()=>{const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return{x:r.x,right:r.right,bottom:r.bottom,height:r.height};};return{board:rect('#board'),actions:rect('.actions'),bottom:rect('.bottom-mark'),page:document.documentElement.scrollWidth};}''')
  assert dims['board']['x']>=0 and dims['board']['right']<=w+1,(w,h,dims)
  assert dims['actions']['height']>=44 and dims['bottom']['bottom']<=h+1 and dims['page']<=w,(w,h,dims)
  report['viewports'].append({'width':w,'height':h,'fits':True})
  if w==390:page.screenshot(path=str(ROOT/'docs/screen-casino-mobile.png'))
  if w==320:page.screenshot(path=str(ROOT/'docs/screen-casino-small.png'))
  if w==1440:page.screenshot(path=str(ROOT/'docs/screen-casino-desktop.png'))
 # Bad save cannot grant a second undo or a changed board.
 assert page.evaluate('''()=>{const raw=JSON.parse(localStorage.getItem('suit-shift.save.v2'));raw.session.undoUsed=2;try{SuitShift.validateSave(raw);return false;}catch{return true;}}''')
 # v1 record never migrates into a different problem's v2 challenge leaderboard.
 old=fresh({'suit-shift.save.v1':json.dumps({'version':1,'best':{'1':1},'prefs':{'sound':False},'session':None})})
 assert old.evaluate('Object.keys(SuitShift.getState().best).length')==0
 assert old.evaluate("localStorage.getItem('suit-shift.save.v1')!==null")
 report['checks'].append('Malformed assistance state rejected; old puzzle records retained separately without false v2 awards')
 assert not report['consoleErrors'],report['consoleErrors']
 browser.close()
(ROOT/'docs/browser-strategy-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
