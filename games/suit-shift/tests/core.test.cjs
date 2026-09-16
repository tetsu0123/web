'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const C=require('../src/core.js');global.SuitShiftCore=C;require('../src/levels.js');const levels=global.SuitShiftLevels;
function b(entries){const board=Array(20).fill(0);for(const [p,s,r]of entries)board[p]=s==='wall'?-1:C.card(s,r);return board;}
test('same suit slides together; other suits remain fixed',()=>{const board=b([[0,'H',2],[8,'H',8],[14,'C',4]]),r=C.step(board,'H','right');assert.equal(r.board[3],C.card('H',2));assert.equal(r.board[11],C.card('H',8));assert.equal(r.board[14],C.card('C',4));assert.equal(r.pairs,0);assert.equal(board[0],C.card('H',2));});
test('matching ranks disappear; adjacency alone does not clear',()=>{const board=b([[0,'H',7],[1,'S',7]]);assert.equal(C.count(board),2);const r=C.step(board,'H','right');assert.equal(r.pairs,1);assert.equal(C.count(r.board),0);assert.equal(r.won,true);});
test('different rank blocks; no pushing or jumping',()=>{const board=b([[0,'H',7],[2,'C',4],[3,'S',7]]),r=C.step(board,'H','right');assert.equal(r.board[1],C.card('H',7));assert.equal(r.board[2],C.card('C',4));assert.equal(r.pairs,0);});
test('front-to-back processing crosses space vacated by an earlier clear',()=>{const board=b([[0,'H',6],[1,'H',7],[2,'S',7]]),r=C.step(board,'H','right');assert.equal(r.board[3],C.card('H',6));assert.equal(r.pairs,1);assert.equal(r.events[0].id,C.card('H',7));});
test('fixed walls block movement and never move or disappear',()=>{const board=b([[0,'H',3],[2,'wall',0],[3,'S',3]]),r=C.step(board,'H','right');assert.equal(r.board[1],C.card('H',3));assert.equal(r.board[2],-1);assert.equal(r.pairs,0);});
test('board edge does not wrap into next row',()=>{const board=b([[3,'H',4],[4,'S',4]]),r=C.step(board,'H','right');assert.equal(r.changed,false);assert.deepEqual(r.board,board);});
test('one input can clear multiple pairs',()=>{const r=C.step(levels[0].board,0,1);assert.equal(r.pairs,2);assert.equal(r.won,true);});
test('input validation rejects malformed boards and invalid directions',()=>{assert.throws(()=>C.validate([0]));assert.throws(()=>C.validate(b([[0,'H',4],[1,'H',4]])));assert.throws(()=>C.step(Array(20).fill(0),'X','up'));assert.throws(()=>C.step(Array(20).fill(0),'H','middle'));});
test('ranks A J Q K only match the same rank',()=>{for(const r of [1,11,12,13])assert.equal(C.step(b([[0,'H',r],[3,'S',r]]),'H','right').won,true);assert.equal(C.step(b([[0,'H',1],[3,'S',13]]),'H','right').pairs,0);});
test('specification example is shortest in four moves',()=>{const level=levels[3],r=C.solve(level.board,{maxNodes:100000,weight:0});assert.equal(r.status,'solved');assert.equal(r.solution.length,4);const initial=C.step(level.board,'D','left');const other=C.solve(initial.board,{maxNodes:100000,weight:0});assert.equal(other.solution.length+1,5);});
test('search limits are never reported as proof of unsolvability',()=>{assert.equal(C.solve(levels[7].board,{maxNodes:0}).status,'limit');assert.equal(C.solve(levels[7].board,{maxDepth:0}).status,'limit');});
test('all 120 packaged levels have valid, replayable solutions',()=>{assert.equal(levels.length,120);for(const level of levels){assert.equal(C.validate(level.board),true);const byRank={};for(const id of level.board.filter(x=>x>0)){const r=C.rank(id);byRank[r]=(byRank[r]||0)+1;}assert.ok(Object.values(byRank).every(n=>n===2||n===4));assert.equal(C.count(C.replay(level.board,level.solution)),0,`level ${level.id}`);assert.equal(level.par,level.solution.length);assert.ok(C.count(level.board)<=16);}});
test('19200 preview/full-step invariants, input immutability, parity and determinism',()=>{
 let checks=0;
 for(const level of levels){let board=level.board.slice();for(let trial=0;trial<10;trial++){
  for(let s=0;s<4;s++)for(let d=0;d<4;d++){
   const original=board.slice(),r=C.step(board,s,d),p=C.step(board,s,d,false);assert.deepEqual(r.board,p.board);assert.deepEqual(board,original);C.validate(r.board);assert.equal(C.count(board)-C.count(r.board),r.pairs*2);assert.equal(r.changed,C.key(board)!==C.key(r.board));
   for(let pos=0;pos<20;pos++){if(board[pos]===-1)assert.equal(r.board[pos],-1);const id=board[pos];if(id>0&&C.suit(id)!==s&&r.board.includes(id))assert.equal(r.board[pos],id);}
   checks++;
  }
  const choices=C.moves(board);if(!choices.length)board=level.board.slice();else board=choices[(trial*7+level.id)%choices.length].board;
 }}assert.equal(checks,19200);
});

test('strategy levels contain genuine clearing alternatives at least two moves longer',()=>{
 for(const l of levels.slice(4)){const q=l.quality;assert.ok(q&&q.saving>=2);assert.equal(q.alternativeMoves-l.par,q.saving);assert.ok(C.step(l.board,...q.temptingMove).pairs>0);assert.equal(C.count(C.replay(l.board,q.alternativeSolution)),0);assert.ok(q.combo>=2);assert.ok(l.limit<q.alternativeMoves);}
});
test('all par values are certified and every solution fits the challenge budget',()=>{for(const l of levels){assert.equal(l.optimal,true);assert.ok(l.par<=l.limit);assert.equal(l.limit,l.par+(l.id<=20?1:0));}});
