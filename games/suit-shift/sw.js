'use strict';
/* This worker is scoped to games/suit-shift only; never cache the parent website. */
const VERSION='suit-shift-v2.1.0';
const CACHE=VERSION+'-'+self.registration.scope;
const FILES=['./','./index.html','./manifest.webmanifest','./assets/icon.svg','./src/core.js','./src/core.js?v=2.1.0','./src/levels.js?v=2.1.0','./src/app.js?v=2.1.0','./src/style.css?v=2.1.0','./src/casino.css?v=2.1.0','./src/premium.css?v=2.1.0','./src/hint-worker.js?v=2.1.0'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('suit-shift-')&&k.endsWith(self.registration.scope)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const req=event.request;if(req.method!=='GET'||!req.url.startsWith(self.registration.scope))return;
 if(req.mode==='navigate')event.respondWith(fetch(req).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));}return response;}).catch(()=>caches.match('./index.html')));
 else event.respondWith(caches.match(req).then(cached=>cached||fetch(req)));
});
