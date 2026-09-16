'use strict';
const fs = require('node:fs'), path = require('node:path');
const C = require('../src/core.js');
let seed = 16092026;
function rand() { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const levels = [], signatures = new Set();
function signature(board) {
  const variants = [];
  const permutations = a => a.length ? a.flatMap((s,i) => permutations(a.filter((_,j)=>j!==i)).map(rest=>[s,...rest])) : [[]];
  for (const flipX of [false,true]) for (const flipY of [false,true]) for (const perm of permutations([0,1,2,3])) {
    const ranks = new Map(); let n = 0;
    const out = [];
    for (let y=0; y<5; y++) for (let x=0; x<4; x++) {
      const id=board[(flipY?4-y:y)*4+(flipX?3-x:x)];
      if (id<=0) out.push(String(id)); else { const r=C.rank(id); if (!ranks.has(r)) ranks.set(r,++n); out.push(`${ranks.get(r)}${perm[C.suit(id)]}`); }
    }
    variants.push(out.join(','));
  }
  return variants.sort()[0];
}
function add(board, result, extra={}) {
  const sig=signature(board); if (signatures.has(sig)) return false;
  C.validate(board);
  if (C.count(C.replay(board,result.solution))) throw new Error('Invalid solution');
  signatures.add(sig);
  levels.push({id:levels.length+1, board, solution:result.solution, par:result.solution.length, optimal:result.optimal, ...extra});
  return true;
}
let first=Array(20).fill(0); first[4]=C.card('H',7); first[7]=C.card('S',7); first[12]=C.card('H',4); first[15]=C.card('C',4);
add(first,{solution:[[0,1]],optimal:true},{tip:'♥を右へスワイプ',title:'同じマークが動く'});
const example=Array(20).fill(0);
for (const [p,s,r] of [[5,'D',3],[7,'H',6],[8,'C',9],[11,'D',9],[12,'C',4],[13,'C',3],[14,'C',6],[16,'D',4]]) example[p]=C.card(s,r);
let attempts=0;
while(levels.length<120) {
  attempts++;
  const id=levels.length+1, chapter=Math.floor((id-1)/20);
  if(id===8) { add(example,C.solve(example,{weight:0,maxNodes:100000}),{title:'消さない一手',tip:'カードを止める位置も考えてみよう'}); continue; }
  const pairRanges=[[2,3],[4,5],[5,6],[4,6],[5,7],[6,8]];
  const [lo,hi]=pairRanges[chapter], pairs=lo+Math.floor(rand()*(hi-lo+1));
  const walls=chapter<3?0:chapter===3?1:1+Math.floor(rand()*2);
  const positions=shuffle(Array.from({length:20},(_,i)=>i)), board=Array(20).fill(0);
  for(let i=0;i<walls;i++) board[positions.pop()]=-1;
  const ranks=shuffle(Array.from({length:13},(_,i)=>i+1));
  let cards=[];
  for(let p=0;p<pairs;p++) {
    if(chapter>=4 && p===0 && rand()<.6 && pairs>=4) {
      cards.push(...[0,1,2,3].map(s=>C.card(s,ranks[p]))); p++;
    } else {
      const suits=shuffle([0,1,2,3]); cards.push(C.card(suits[0],ranks[p]),C.card(suits[1],ranks[p]));
    }
  }
  for(const card of cards) board[positions.pop()]=card;
  const fast=C.solve(board,{maxNodes:5000,weight:1.25,maxDepth:24});
  if(fast.status!=='solved') continue;
  const min=[2,3,4,4,5,6][chapter], max=[5,8,10,10,13,16][chapter];
  if(fast.solution.length<min||fast.solution.length>max) continue;
  let result=C.solve(board,{maxNodes:chapter<2?12000:4500,weight:0,maxDepth:fast.solution.length});
  if(result.status!=='solved') result=fast;
  if(result.solution.length<min) continue;
  const tip=id===2?'違う数字のカードには止められる':id===3?'選んだマークは、すべて一緒に動く':id===5?'「戻す」で何度でも考え直せる':id===61?'■は動かない壁。止まる位置に使おう':undefined;
  if(add(board,result,tip?{tip}:{})) console.log(`Level ${levels.length}: ${cards.length} cards, ${result.solution.length} moves, ${result.optimal?'shortest':'verified'}, attempts ${attempts}`);
}
const data='/* Generated and solution-verified offline. Seed: 16092026. */\nglobalThis.SuitShiftLevels = '+JSON.stringify(levels)+';\n';
fs.writeFileSync(path.join(__dirname,'../src/levels.js'),data);
fs.writeFileSync(path.join(__dirname,'../docs/levels-report.json'),JSON.stringify({seed:16092026,attempts,levels:120,shortestCertified:levels.filter(l=>l.optimal).length,allSolutionsReplayed:true,structuralDeduplication:true},null,2));
console.log('Done');
