'use strict';
importScripts('./core.js');
self.onmessage=event=>{const {id,board,depth=40}=event.data;try{self.postMessage({id,result:SuitShiftCore.solve(board,{maxNodes:50000,weight:0,maxDepth:depth})});}catch(error){self.postMessage({id,result:{status:'limit'}});}};
