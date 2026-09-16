(function () {
'use strict';
const C=SuitShiftCore, LEVELS=SuitShiftLevels, $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const ICONS={
 grid:'<rect x="3" y="3" width="7" height="7" rx="1.7"/><rect x="14" y="3" width="7" height="7" rx="1.7"/><rect x="3" y="14" width="7" height="7" rx="1.7"/><rect x="14" y="14" width="7" height="7" rx="1.7"/>',
 settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="var(--bg)"/><circle cx="16" cy="17" r="3" fill="var(--bg)"/>',
 undo:'<path d="M9 5 4 10l5 5M4 10h10a6 6 0 0 1 0 12" transform="translate(0 -2)"/>',
 restart:'<path d="M4 10a8 8 0 1 1 1.8 8M4 4v6h6"/>',
 bulb:'<path d="M9 18h6M10 21h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 2H9s0-1-1-2Z"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',
 right:'<path d="M4 12h16m-6-6 6 6-6 6"/>',left:'<path d="M20 12H4m6-6-6 6 6 6"/>',up:'<path d="M12 20V4m-6 6 6-6 6 6"/>',down:'<path d="M12 4v16m-6-6 6 6 6-6"/>',
 check:'<path d="m5 12 4 4L19 6"/>',wall:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 8h8v8H8z"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',upload:'<path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/>'
};
const SUIT_PATHS=[
 '<path d="M12 21C7 17 2 13 2 8a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 5-5 9-10 13Z"/>',
 '<path d="m12 1 10 11-10 11L2 12Z"/>',
 '<path d="M12 2a4.5 4.5 0 0 1 4 7 4.5 4.5 0 1 1-2 8l1.5 5h-7l1.5-5a4.5 4.5 0 1 1-2-8 4.5 4.5 0 0 1 4-7Z"/>',
 '<path d="M12 1c2 4 10 8 10 13a5 5 0 0 1-8 4l1.5 4h-7l1.5-4a5 5 0 0 1-8-4C2 9 10 5 12 1Z"/>'
];
const symbols=['♥','♦','♣','♠'], names=['ハート','ダイヤ','クラブ','スペード'], arrows=['上','右','下','左'];
const chapterNames=['はじめの一手','停止位置をつくる','順序を組み立てる','壁を使う','組み合わせを選ぶ','すべてを組み合わせる'];
const chapterEN=['FIRST MOVES','FIND YOUR POSITION','THINK IN SEQUENCES','WORK WITH WALLS','CHOOSE YOUR PAIRS','THE COMPLETE PICTURE'];
const icon=name=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||ICONS.grid}</svg>`;
const suitSvg=(s,cls='')=>`<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${SUIT_PATHS[s]}</svg>`;
function applyIcons(el=document){el.querySelectorAll('[data-icon]').forEach(n=>n.innerHTML=icon(n.dataset.icon));}
applyIcons();
const KEY='suit-shift.save.v1';
const defaultPrefs={sound:true,music:false,haptic:true,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,buttons:false,preview:true,theme:'midnight'};
let data={version:1,prefs:{...defaultPrefs},best:{},session:null};
let storageFailed=false, index=0, board=[], history=[], moves=0, selected=null, busy=false, searching=false, gesture=null, hinted=null, searchToken=0, cw=78,ch=106,gap=8;
let toastTimer, feedbackTimer, clearTimer, confirmAction=null, animations=[], motionEpoch=0;
const boardEl=$('#board'), cardsEl=$('#cards'), previewEl=$('#preview');
function validBoard(b,initial){
 C.validate(b);
 const allowed=new Set(initial.filter(id=>id>0)), ranks={};
 for(let i=0;i<20;i++){
   if((b[i]===-1)!==(initial[i]===-1)) throw Error('Walls changed');
   if(b[i]>0){if(!allowed.has(b[i]))throw Error('Unknown card');const r=C.rank(b[i]);ranks[r]=(ranks[r]||0)+1;}
 }
 if(Object.values(ranks).some(n=>n%2))throw Error('Unpaired cards');
}
function validateSave(raw){
 if(!raw||raw.version!==1)throw Error('Unknown save version');
 const p={...defaultPrefs};for(const k of Object.keys(p))if(k!=='theme'&&typeof raw.prefs?.[k]==='boolean')p[k]=raw.prefs[k];
 if(['midnight','graphite','forest'].includes(raw.prefs?.theme))p.theme=raw.prefs.theme;
 const best={};for(const [k,v] of Object.entries(raw.best||{})){const id=Number(k);if(Number.isInteger(id)&&id>=1&&id<=120&&Number.isInteger(v)&&v>=1&&v<10000)best[id]=v;}
 let session=null;
 if(raw.session){const s=raw.session;if(!Number.isInteger(s.index)||s.index<0||s.index>=120||!Array.isArray(s.history)||s.history.length>10000)throw Error('Invalid session');
   const initial=LEVELS[s.index].board;let b=initial.slice();
   for(const h of s.history){validBoard(h.board,initial);if(C.key(h.board)!==C.key(b)||!Array.isArray(h.action)||h.action.length!==2)throw Error('Invalid history');const r=C.step(b,...h.action,false);if(!r.changed)throw Error('Invalid action');b=r.board;}
   validBoard(s.board,initial);if(C.key(b)!==C.key(s.board)||s.moves!==s.history.length)throw Error('Invalid state');
   session={index:s.index,board:s.board.slice(),history:s.history.map(h=>({board:h.board.slice(),action:h.action.slice()})),moves:s.moves};
 }
 return {version:1,prefs:p,best,session};
}
try{const saved=localStorage.getItem(KEY);if(saved)data=validateSave(JSON.parse(saved));}catch(e){storageFailed=true;}
function persist(){
 data.session={index,board:board.slice(),history:history.map(h=>({board:h.board.slice(),action:h.action.slice()})),moves};
 try{localStorage.setItem(KEY,JSON.stringify(data));}catch(e){if(!storageFailed){storageFailed=true;toast('保存できません。設定からセーブを書き出せます。');}}
}
function toast(text){clearTimeout(toastTimer);$('#toast').textContent=text;$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,3200);}
function setMessage(text,active=false){$('#message').textContent=text;$('#message').classList.toggle('active',active);}
function defaultMessage(){
 if(hinted){setMessage(`${symbols[hinted[0]]}を${arrows[hinted[1]]}へスワイプ`,true);return;}
 if(!C.count(board)){setMessage('');return;}
 if(moves===0&&LEVELS[index].tip){setMessage(LEVELS[index].tip);return;}
 if(selected!==null){setMessage(`${symbols[selected]} がまとめて動く${data.prefs.buttons?' · 方向を選択':''}`);return;}
 setMessage(index<5?'同じ数字をぶつけて、すべて消そう':'カードを選んでスワイプ');
}
function position(p){return{x:(p%4)*(cw+gap),y:Math.floor(p/4)*(ch+gap)};}
function transform(p){const {x,y}=position(p);return`translate(${x}px,${y}px)`;}
function resize(){
 const game=$('.game'), availableW=game.clientWidth-(innerWidth>=850?56:32),short=innerHeight<=680;
 const extras=(short?190:234)+(data.prefs.buttons?52:0), availableH=game.clientHeight-extras;
 gap=innerWidth<=350?7:8;
 cw=Math.min(78,(availableW-24)/4,(availableH-gap*4)/5/1.359);
 cw=Math.max(30,Math.floor(cw*10)/10);ch=Math.round(cw*1.359*10)/10;
 const r=document.documentElement;r.style.setProperty('--cw',cw+'px');r.style.setProperty('--ch',ch+'px');r.style.setProperty('--gap',gap+'px');r.style.setProperty('--bw',(cw*4+gap*3)+'px');r.style.setProperty('--bh',(ch*5+gap*4)+'px');
 if(board.length){cancelVisuals();renderBoard();if(!C.count(board)&&$('#win').hidden)finish();}
}
function applyPrefs(){
 document.body.dataset.theme=data.prefs.theme;document.body.classList.toggle('reduced',data.prefs.reduced);$('#pad').hidden=!data.prefs.buttons;
 $$('[data-pref]').forEach(el=>el.checked=data.prefs[el.dataset.pref]);$$('.theme').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.theme===data.prefs.theme)));
 audio.update();resize();
}
function makeCard(id,p){
 const s=C.suit(id),r=C.rank(id),label=r===1?'A':r===11?'J':r===12?'Q':r===13?'K':String(r);
 const el=document.createElement('button');el.className='card'+(s<2?' red':'');el.dataset.id=id;el.dataset.suit=s;el.style.transform=transform(p);
 el.setAttribute('aria-label',`${names[s]}の${label}、${Math.floor(p/4)+1}行${p%4+1}列。${names[s]}を選択`);
 el.innerHTML=`<span class="index">${label}</span>${suitSvg(s,'mini')}${suitSvg(s,'main-suit')}<span class="index bottom">${label}</span>`;
 return el;
}
function renderBoard(){
 $('#slots').innerHTML='';cardsEl.innerHTML='';previewEl.innerHTML='';
 board.forEach((id,p)=>{const el=document.createElement('div');el.className='slot'+(id===-1?' wall':'');el.style.transform=transform(p);if(id===-1)el.innerHTML=icon('wall');$('#slots').append(el);if(id>0)cardsEl.append(makeCard(id,p));});
 updateSelection();updateHud();
}
function updateHud(){
 $('#level-number').textContent=String(index+1).padStart(3,'0');$('#chapter-label').textContent=`${String(Math.floor(index/20)+1).padStart(2,'0')} / ${chapterEN[Math.floor(index/20)]}`;
 $('#move-count').textContent=moves;$('#par-label').textContent=`目標 ${LEVELS[index].par}手`;
 $('#levels-btn').disabled=busy;$('#settings-btn').disabled=busy;$('#undo').disabled=history.length===0||busy;$('#restart').disabled=moves===0||busy;$('#hint').disabled=busy||searching||!C.count(board);
}
function updateSelection(){
 $$('.card').forEach(el=>{const s=Number(el.dataset.suit);el.classList.toggle('selected',s===selected);el.classList.remove('match');el.classList.toggle('hint-card',Boolean(hinted&&s===hinted[0]));el.setAttribute('aria-pressed',String(s===selected));});
 $$('.pad button').forEach(el=>el.disabled=selected===null||busy||!C.count(board));
 if(hinted)drawHint(hinted);
}
function select(s){if(busy||!C.count(board))return;selected=s;hinted=null;previewEl.innerHTML='';updateSelection();defaultMessage();audio.select();vibrate(5);}
function preview(s,d){
 if(d===null){previewEl.innerHTML='';updateSelection();defaultMessage();return;}
 const result=C.step(board,s,d);previewEl.innerHTML='';$$('.card').forEach(el=>el.classList.remove('match'));
 if(!result.changed){setMessage('この方向には動かせません');return;}
 setMessage(result.pairs?`${symbols[s]} ${arrows[d]}へ · ${result.pairs}組消去`:`${symbols[s]} ${arrows[d]}へ`,result.pairs>0);
 if(!data.prefs.preview)return;
 let lines='';
 for(const ev of result.events){
   const a=position(ev.from),b=position(ev.to);lines+=`<path d="M${a.x+cw/2} ${a.y+ch/2} L${b.x+cw/2} ${b.y+ch/2}"/>`;
   if(ev.removed){cardsEl.querySelector(`[data-id="${ev.target}"]`)?.classList.add('match');const el=document.createElement('div');el.className='destination';el.textContent='✓';el.style.left=b.x+cw/2-13+'px';el.style.top=b.y+ch/2-13+'px';previewEl.append(el);}
   else if(!board[ev.to]){const el=document.createElement('div');el.className='ghost';el.style.transform=transform(ev.to);previewEl.append(el);}
 }
 previewEl.insertAdjacentHTML('afterbegin',`<svg viewBox="0 0 ${cw*4+gap*3} ${ch*5+gap*4}" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="3 5" opacity=".6">${lines}</svg>`);
}
function direction(dx,dy){if(Math.hypot(dx,dy)<18)return null;const x=Math.abs(dx),y=Math.abs(dy);if(Math.max(x,y)<Math.min(x,y)*1.25)return null;return x>y?(dx>0?1:3):(dy>0?2:0);}
boardEl.addEventListener('pointerdown',e=>{
 if(gesture||busy||e.button>0||document.querySelector('dialog[open]'))return;
 const card=e.target.closest('.card');if(!card)return;
 e.preventDefault();audio.ensure();select(Number(card.dataset.suit));
 boardEl.setPointerCapture(e.pointerId);gesture={id:e.pointerId,x:e.clientX,y:e.clientY,s:selected,d:null,max:0};
});
boardEl.addEventListener('pointermove',e=>{
 if(!gesture||e.pointerId!==gesture.id)return;e.preventDefault();const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;gesture.max=Math.max(gesture.max,Math.hypot(dx,dy));
 const d=direction(dx,dy);if(d!==gesture.d){gesture.d=d;preview(gesture.s,d);}
});
boardEl.addEventListener('pointerup',e=>{
 if(!gesture||e.pointerId!==gesture.id)return;const g=gesture;gesture=null;
 if(boardEl.hasPointerCapture(e.pointerId))boardEl.releasePointerCapture(e.pointerId);
 const dx=e.clientX-g.x,dy=e.clientY-g.y,d=direction(dx,dy);previewEl.innerHTML='';
 if(d!==null&&Math.hypot(dx,dy)>=18)act(g.s,d);else{updateSelection();defaultMessage();}
});
function cancelGesture(){gesture=null;previewEl.innerHTML='';updateSelection();defaultMessage();}
boardEl.addEventListener('pointercancel',cancelGesture);boardEl.addEventListener('lostpointercapture',()=>{if(gesture)cancelGesture();});
cardsEl.addEventListener('click',e=>{if(e.detail===0){const el=e.target.closest('.card');if(el){audio.ensure();select(Number(el.dataset.suit));}}});
$$('.pad button').forEach(el=>el.addEventListener('click',()=>{if(selected!==null)act(selected,Number(el.dataset.dir));}));
document.addEventListener('keydown',e=>{
 if(document.querySelector('dialog[open]')||e.target.matches('input'))return;
 const dirs={ArrowUp:0,ArrowRight:1,ArrowDown:2,ArrowLeft:3,w:0,d:1,s:2,a:3};
 if(e.key in dirs){e.preventDefault();if(selected!==null)act(selected,dirs[e.key]);else toast('先にカードを選んでください');}
 else if('1234'.includes(e.key)&&e.key.length===1){e.preventDefault();const s=Number(e.key)-1;if(board.some(id=>id>0&&C.suit(id)===s))select(s);}
 else if(e.key.toLowerCase()==='z'){e.preventDefault();undo();}
 else if(e.key.toLowerCase()==='h'){e.preventDefault();hint();}
 else if(e.key==='Escape'){selected=null;hinted=null;previewEl.innerHTML='';updateSelection();defaultMessage();}
});
function cancelVisuals(){motionEpoch++;animations.forEach(a=>a.cancel());animations=[];busy=false;clearTimeout(clearTimer);$$('.particle,.flash-ring').forEach(e=>e.remove());}
function animateElement(el,frames,options){if(!el)return Promise.resolve();const a=el.animate(frames,options);animations.push(a);return a.finished.catch(()=>{});}
async function animateMove(result){
 if(data.prefs.reduced){audio.slide(result.pairs);return;}
 const tasks=[];
 for(const ev of result.events){
   const el=cardsEl.querySelector(`[data-id="${ev.id}"]`),target=ev.target?cardsEl.querySelector(`[data-id="${ev.target}"]`):null;
   const delay=Math.min(ev.order*65,195),distance=Math.abs(ev.to%4-ev.from%4)+Math.abs(Math.floor(ev.to/4)-Math.floor(ev.from/4));
   const duration=130+Math.min(distance,4)*24;
   const task=(async()=>{
     await animateElement(el,[{transform:transform(ev.from)},{transform:transform(ev.to)}],{duration,delay,easing:'cubic-bezier(.2,.65,.25,1)',fill:'forwards'});
     if(ev.removed){
       particles(ev.to);audio.pair(result.events.filter(e=>e.removed).indexOf(ev));vibrate(12);
       const fade=[{opacity:1,scale:1},{opacity:.5,scale:1.04,offset:.3},{opacity:0,scale:.86}];
       await Promise.all([animateElement(el,fade,{duration:150,fill:'forwards'}),animateElement(target,fade,{duration:150,fill:'forwards'})]);
     }
   })();tasks.push(task);
 }
 audio.slide(result.pairs);await Promise.all(tasks);
}
function particles(p){
 if(data.prefs.reduced)return;const {x,y}=position(p);
 const ring=document.createElement('div');ring.className='flash-ring';ring.style.transform=transform(p);boardEl.append(ring);animateElement(ring,[{opacity:.7},{opacity:0}],{duration:200}).then(()=>ring.remove());
 for(let i=0;i<5;i++){const el=document.createElement('div');el.className='particle';el.style.left=x+cw/2+'px';el.style.top=y+ch/2+'px';boardEl.append(el);const angle=i*Math.PI*2/5;animateElement(el,[{transform:'translate(0,0) rotate(0)',opacity:.7},{transform:`translate(${Math.cos(angle)*28}px,${Math.sin(angle)*28}px) rotate(${i*53}deg)`,opacity:0}],{duration:190,easing:'ease-out'}).then(()=>el.remove());}
}
async function act(s,d){
 if(busy||!C.count(board))return false;
 const result=C.step(board,s,d);hinted=null;previewEl.innerHTML='';
 if(!result.changed){updateSelection();setMessage('この方向には動かせません');return false;}
 searchToken++;searching=false;clearTimeout(feedbackTimer);busy=true;selected=null;
 const epoch=++motionEpoch;history.push({board:board.slice(),action:[s,d]});board=result.board;moves++;persist();updateSelection();updateHud();
 await animateMove(result);if(epoch!==motionEpoch)return false;animations=[];busy=false;renderBoard();
 if(result.won){finish();}
 else if(!C.moves(board).length){setMessage('動かせるカードがありません。「戻す」で再考できます。');}
 else if(result.pairs){setMessage(`${result.pairs}組消去`,true);feedbackTimer=setTimeout(defaultMessage,1100);}
 else defaultMessage();
 return true;
}
function finish(){
 const old=data.best[index+1];data.best[index+1]=old?Math.min(old,moves):moves;persist();
 clearTimer=setTimeout(()=>{
  const win=$('#win'),last=index===119,perfect=moves<=LEVELS[index].par;
  win.innerHTML=`<div class="win-symbol">${icon('check')}</div><div class="win-eyebrow">LEVEL ${String(index+1).padStart(3,'0')} COMPLETE</div><h1>${last?'クリア':'クリア'}</h1><div class="win-score">${moves}手 <span style="opacity:.5">／</span> 目標 ${LEVELS[index].par}手</div><div class="perfect">${perfect?'✦ 目標手数を達成':''}</div><button class="primary win-next" id="next-level">${last?'ステージを選ぶ':'次へ'} ${icon('right')}</button><button class="text-button" id="replay-level">もう一度解く</button>`;
  win.hidden=false;applyIcons(win);$('#next-level').onclick=()=>last?openLevels():loadLevel(index+1);$('#replay-level').onclick=()=>loadLevel(index);audio.win();vibrate([12,65,12]);setMessage('');
  $('#next-level').focus({preventScroll:true});
 },data.prefs.reduced?20:280);
}
function loadLevel(i,session=null){
 if(!Number.isInteger(i)||i<0||i>=LEVELS.length)return;
 searchToken++;searching=false;cancelVisuals();clearTimeout(feedbackTimer);gesture=null;hinted=null;selected=null;$('#win').hidden=true;
 index=i;board=session?session.board.slice():LEVELS[i].board.slice();history=session?session.history.slice():[];moves=session?session.moves:0;
 document.querySelectorAll('dialog[open]').forEach(d=>d.close());renderBoard();defaultMessage();persist();if(!C.count(board))finish();
}
function undo(){
 if(busy||!history.length)return;searchToken++;searching=false;clearTimeout(feedbackTimer);clearTimeout(clearTimer);$('#win').hidden=true;
 const last=history.pop();board=last.board.slice();moves=history.length;selected=null;hinted=null;audio.select();renderBoard();defaultMessage();persist();
}
$('#undo').onclick=undo;
function confirmDialog(title,text,label,action){$('#confirm-title').textContent=title;$('#confirm-text').textContent=text;$('#confirm-yes').textContent=label;confirmAction=action;$('#confirm-dialog').showModal();}
$('#confirm-yes').onclick=()=>{$('#confirm-dialog').close();const fn=confirmAction;confirmAction=null;fn?.();};
$('#restart').onclick=()=>{if(!busy&&moves)confirmDialog('最初からやり直す','この面の配置と手数を最初の状態に戻します。クリア記録は残ります。','やり直す',()=>loadLevel(index));};
/* Every packaged solution contributes verified intermediate states for instant hints. */
const knownRoutes=new Map();
for(const level of LEVELS){let b=level.board;for(let i=0;i<level.solution.length;i++){const k=C.key(b),route=level.solution.slice(i);if(!knownRoutes.has(k)||knownRoutes.get(k).length>route.length)knownRoutes.set(k,route);b=C.step(b,...level.solution[i],false).board;}}
function drawHint(move){
 previewEl.innerHTML='';const p=board.findIndex(id=>id>0&&C.suit(id)===move[0]);if(p<0)return;
 const at=position(p),el=document.createElement('div');el.className='hint-arrow';el.style.left=at.x+cw/2-18+'px';el.style.top=at.y+ch-27+'px';el.innerHTML=icon(C.DIRS[move[1]]);previewEl.append(el);
}
function showHint(route){if(!route?.length)return;hinted=route[0];selected=hinted[0];updateSelection();defaultMessage();}
let solverWorker=null,workerSeq=0;const workerPending=new Map();
function searchAsync(b){
 try{
  if(!solverWorker){
   const coreSource=document.getElementById('core-source')?.textContent||'';
   if(!coreSource.trim())solverWorker=new Worker('./src/hint-worker.js');
   else {
   const blob=new Blob([coreSource,'\nonmessage=e=>{const {id,board}=e.data;try{postMessage({id,result:SuitShiftCore.solve(board,{maxNodes:18000,weight:1.25,maxDepth:40})});}catch(err){postMessage({id,result:{status:"limit"}});}};'],{type:'application/javascript'});
   const url=URL.createObjectURL(blob);solverWorker=new Worker(url);URL.revokeObjectURL(url);
   }
   solverWorker.onmessage=e=>{const p=workerPending.get(e.data.id);if(p){clearTimeout(p.timer);workerPending.delete(e.data.id);p.resolve(e.data.result);}};
   solverWorker.onerror=()=>{for(const p of workerPending.values()){clearTimeout(p.timer);p.resolve({status:'limit'});}workerPending.clear();solverWorker?.terminate();solverWorker=null;};
  }
  return new Promise(resolve=>{const id=++workerSeq;const timer=setTimeout(()=>{workerPending.delete(id);resolve({status:'limit'});},4000);workerPending.set(id,{resolve,timer});solverWorker.postMessage({id,board:b});});
 }catch(e){return Promise.resolve({status:'limit'});}
}
async function hint(){
 if(busy||searching||!C.count(board))return;
 const route=knownRoutes.get(C.key(board));if(route){showHint(route);return;}
 searching=true;const token=++searchToken;setMessage('次の一手を確認中…');updateHud();
 const result=await searchAsync(board.slice());if(token!==searchToken)return;searching=false;updateHud();
 if(result.status==='solved'&&result.solution?.length){knownRoutes.set(C.key(board),result.solution);showHint(result.solution);return;}
 let target=0;for(let i=history.length-1;i>=0;i--)if(knownRoutes.has(C.key(history[i].board))){target=i;break;}
 const steps=history.length-target;
 confirmDialog('確認済みの配置からヒントを表示',result.status==='unsolvable'?`現在の配置では全消去できません。${steps}手戻ると解法を確認できる配置になります。`:`探索上限に達したため、この配置の解法は未確認です。${steps}手戻って確認済みの配置からヒントを表示します。`,'戻ってヒント',()=>{
   if(history[target]){board=history[target].board.slice();history=history.slice(0,target);moves=history.length;renderBoard();persist();}
   showHint(knownRoutes.get(C.key(board)));
 });
}
$('#hint').onclick=hint;
function openLevels(){
 $('#progress-label').textContent=`${Object.keys(data.best).length} / 120面クリア · 開発版はすべて無料`;
 $('#level-list').innerHTML=chapterNames.map((name,chapter)=>`<section class="chapter-section"><h3>${String(chapter+1).padStart(2,'0')} / ${name}</h3><div class="level-grid">${LEVELS.slice(chapter*20,chapter*20+20).map(l=>{const best=data.best[l.id];return`<button class="level-tile${l.id===index+1?' current':''}${best?' done':''}${best&&best<=l.par?' perfect-level':''}" data-level="${l.id-1}" aria-label="ステージ${l.id}${best?'、クリア済み':''}" ${l.id===index+1?'aria-current="true"':''}>${String(l.id).padStart(2,'0')}</button>`;}).join('')}</div></section>`).join('');
 $('#levels-dialog').showModal();$('#levels-dialog .current')?.scrollIntoView({block:'nearest'});
}
$('#level-list').onclick=e=>{const t=e.target.closest('[data-level]');if(t)loadLevel(Number(t.dataset.level));};
$('#levels-btn').onclick=openLevels;$('#settings-btn').onclick=()=>{applyPrefs();$('#settings-dialog').showModal();};
$$('[data-close]').forEach(el=>el.onclick=()=>el.closest('dialog').close());
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
$('#rules-btn').onclick=()=>$('#rules-dialog').showModal();
$$('[data-pref]').forEach(el=>el.onchange=()=>{audio.ensure();data.prefs[el.dataset.pref]=el.checked;applyPrefs();persist();});
$$('.theme').forEach(el=>el.onclick=()=>{data.prefs.theme=el.dataset.theme;applyPrefs();persist();});
$('#export-save').onclick=()=>{persist();const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='suit-shift-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('#import-save').onclick=()=>$('#save-file').click();
$('#save-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>4000000)throw Error('Large save');const imported=validateSave(JSON.parse(await file.text()));confirmDialog('セーブを読み込む','現在の進行状況を、選んだファイルの内容で置き換えます。','読み込む',()=>{data=imported;const s=data.session;applyPrefs();loadLevel(s?.index||0,s);toast('セーブを読み込みました');});}catch(err){toast('このセーブデータは読み込めません');}e.target.value='';};
function vibrate(value){if(data.prefs.haptic&&!data.prefs.reduced)try{navigator.vibrate?.(value);}catch(e){}}
const audio={
 ctx:null,timer:null,n:0,
 ensure(){try{if(!this.ctx){const A=window.AudioContext||window.webkitAudioContext;if(!A)return;this.ctx=new A();}if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});this.update();}catch(e){}},
 tone(freq,duration,volume=.035,delay=0,type='sine'){
  const c=this.ctx;if(!c||c.state!=='running')return;
  const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+delay;o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+duration+.02);o.onended=()=>{o.disconnect();g.disconnect();};
 },
 select(){this.ensure();if(data.prefs.sound)this.tone(700,.035,.015);},
 slide(pairs){this.ensure();if(!data.prefs.sound)return;this.tone(170,.09,.024,0,'triangle');if(data.prefs.reduced&&pairs)this.pair(0);},
 pair(i){if(!data.prefs.sound)return;const f=[440,554.37,659.25,880][i%4];this.tone(f,.17,.042);this.tone(f*2,.11,.01,.03);},
 win(){if(!data.prefs.sound)return;[440,554.37,659.25].forEach((f,i)=>this.tone(f,.32,.025,i*.07));},
 update(){
  const should=data.prefs.music&&this.ctx?.state==='running'&&!document.hidden;
  if(should&&!this.timer){this.timer=setInterval(()=>{const chords=[[220,277.18,329.63],[196,246.94,293.66],[174.61,220,261.63],[196,246.94,329.63]],chord=chords[Math.floor(this.n/8)%4];this.tone(chord[this.n%3],.62,.009,0,'sine');if(this.n%4===0)this.tone(chord[0]/2,1.2,.009);this.n++;},60000/84/2);}
  if(!should&&this.timer){clearInterval(this.timer);this.timer=null;}
 }
};
document.addEventListener('visibilitychange',()=>{if(document.hidden){persist();audio.ctx?.suspend().catch(()=>{});}else if(audio.ctx)audio.ctx.resume().then(()=>audio.update()).catch(()=>{});audio.update();});
window.addEventListener('pagehide',persist);window.addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize);
const session=data.session;applyPrefs();loadLevel(session?.index||0,session);if(storageFailed)setTimeout(()=>toast('前のセーブを読み込めなかったため、新しく開始しました'),300);
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{});
/* Small diagnostic API: no network calls, used by automated browser tests. */
window.SuitShift={getState:()=>({index,board:board.slice(),moves,busy,selected,best:{...data.best}}),loadLevel,act,undo,hint,core:C,levels:LEVELS,validateSave};
})();
