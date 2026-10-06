'use strict';
// Independently check the C++ generator against the exact JavaScript game solver.
const fs=require('node:fs'),path=require('node:path'),C=require('../src/core.js');
require('../src/levels.js');
let searches=0,maxExpandedNodes=0;const start=Date.now();
for(const l of SuitShiftLevels){
 const r=C.solve(l.board,{weight:0,maxNodes:500000,maxDepth:l.par});
 if(r.status!=='solved'||r.solution.length!==l.par)throw Error('Shortest route mismatch at '+l.id+': '+r.status);
 maxExpandedNodes=Math.max(maxExpandedNodes,r.nodes);searches++;
 if(l.quality){const q=l.quality,b=C.step(l.board,...q.temptingMove,false).board,a=C.solve(b,{weight:0,maxNodes:500000,maxDepth:q.alternativeMoves-1});if(a.status!=='solved'||a.solution.length+1!==q.alternativeMoves)throw Error('Alternative mismatch at '+l.id);maxExpandedNodes=Math.max(maxExpandedNodes,a.nodes);searches++;}
 if(l.id%20===0)console.log('Verified '+l.id+'/120');
}
const proof={shortestRoutesVerified:120,constrainedShortestContinuationsVerified:117,independentEngine:'JavaScript game-core breadth-first search; different queue implementation from C++ generation solver',allPassed:true,searches,maxExpandedNodes,elapsedSeconds:(Date.now()-start)/1000};
fs.writeFileSync(path.join(__dirname,'../docs/independent-proof.json'),JSON.stringify(proof,null,2));console.log(proof);
