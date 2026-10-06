'use strict';
// The human-readable source is emitted by curate-levels.py to docs/curated-levels.json.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),raw=JSON.parse(fs.readFileSync(path.join(root,'docs/curated-levels.json'),'utf8'));
const chars='0ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',route=a=>a.map(([s,d])=>(s*4+d).toString(16)).join('');
const rows=raw.map(l=>[l.board.map(n=>n===-1?'_':chars[n]).join(''),route(l.solution),route(l.quality?.alternativeSolution||[])]);
const target=path.join(root,'src/levels.js'),text=fs.readFileSync(target,'utf8');
fs.writeFileSync(target,text.replace(/const rows=.*?;\n/,()=> 'const rows='+JSON.stringify(rows)+';\n'));
