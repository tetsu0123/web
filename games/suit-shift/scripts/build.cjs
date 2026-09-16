'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html')
 .replace('<link rel="stylesheet" href="./src/style.css">',()=>'<style>\n'+read('src/style.css')+'\n</style>')
 .replace('<script src="./src/core.js"></script>',()=>'<script id="core-source">\n'+read('src/core.js')+'\n</script>')
 .replace('<script src="./src/levels.js"></script>',()=>'<script>\n'+read('src/levels.js')+'\n</script>')
 .replace('<script src="./src/app.js"></script>',()=>'<script>\n'+read('src/app.js')+'\n</script>');
fs.writeFileSync(path.join(root,'standalone.html'),html);
console.log(`Built self-contained standalone.html (${Buffer.byteLength(html)} bytes).`);
