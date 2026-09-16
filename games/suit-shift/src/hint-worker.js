'use strict';
importScripts('./core.js');
self.onmessage=event=>{const {id,board}=event.data;try{self.postMessage({id,result:SuitShiftCore.solve(board,{maxNodes:18000,weight:1.25,maxDepth:40})});}catch(error){self.postMessage({id,result:{status:'limit'}});}};
