// Service worker do Office — só a casca do app fica offline.
// Dados (data.js / data.enc.js) NUNCA são cacheados: sempre pela rede.
const CACHE='office-shell-v3';
const CASCA=['./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CASCA)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  // nunca cachear dados nem chamadas externas
  if(/data(\.enc)?\.js$|datajud\.js$|emailalertas\.js$/.test(u.pathname)||u.origin!==location.origin)return;
  // rede primeiro (sempre a versão mais nova); cai pro cache só se estiver offline
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request)));
});
