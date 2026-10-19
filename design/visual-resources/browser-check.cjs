// Offline fragments from the implemented Razor views; no app or database startup.
const fs=require('fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.CODEX_NODE_MODULES+'/playwright');
const root='LoginSARMedix/';
const read=p=>fs.readFileSync(root+p,'utf8');
const partial=n=>read('Views/Shared/_Orbit'+n+'.cshtml').replace(/@\*[\s\S]*?\*@/g,'');
const resources=read('wwwroot/css/orbit-resources.css');
const css=['site','sidebar','sarmedix-ui','sarmedix-orbita-v2','sarmedix-system','sarmedix-structural','sarmedix-refinement','sarmedix-global','orbit-mini'].map(n=>read('wwwroot/css/'+n+'.css')).join('\n');
function extract(s,needle){const i=s.indexOf(needle);assert.ok(i>=0,needle);const start=s.lastIndexOf('<',i),tag=s.slice(start).match(/^<(\w+)/)[1];let depth=0;const tail=s.slice(start);for(const m of tail.matchAll(new RegExp('<(/?)'+tag+'\\b[^>]*>','g'))){depth+=m[1]?-1:1;if(!depth)return tail.slice(0,m.index+m[0].length);}throw Error(needle);}
function clean(s){return s.replace(/@Html\.AntiForgeryToken\(\)/g,'').replace(/<partial name="_Orbit(Scanner|Capsule|Pulse)"\s*\/>/g,(_,n)=>partial(n)).replace(/\son\w+="[^"]*"/g,'');}
function doc(name,body,raw='',extra=''){
 const local=[...raw.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1].replace(/@@/g,'@')).join('\n');
 return '<!doctype html><html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+local+resources+'body{display:block!important;margin:0}main.test{padding:24px;max-width:100%;width:720px;margin:auto}'+extra+'</style><body class="sm-app" data-sm-family="products" data-sm-screen="'+name+'"><main class="test"><div class="sm-reimagined sm-reception sm-lot-editor">'+body+'</div></main></body></html>';
}
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 // No external requests, actual scanning or business scripts are permitted in fixtures.
 await page.route('**/*',r=>r.abort());
 const specs=[['CrearProducto','class="bloque-codigo-barras"'],['EditarProducto','class="bloque-codigo-barras"'],['CrearLote','id="modoScanner"'],['EntregaDosificacion','class="orbit-scan-station"'],['Dosificaciones','class="sm-dose-proof"']];
 const lote=read('Views/Home/EditarLote.cshtml');const pos=lote.indexOf('<partial name="_OrbitScanner"');const begin=lote.lastIndexOf('<div>',pos);const end=lote.indexOf('</div>',pos)+6;
 const fragments=specs.map(([name,needle])=>{const raw=read('Views/Home/'+name+'.cshtml');return {name,raw,html:clean(extract(raw,needle))};});fragments.push({name:'EditarLote',raw:lote,html:clean(lote.slice(begin,end))});
 for(const f of fragments){
  for(const width of [1440,768,390,320]){
   await page.setViewportSize({width,height:1000});
   await page.setContent(doc(f.name,f.html,f.raw));
   assert.equal(await page.locator('.sm-scanner-art').count(),1);
   const state=await page.locator('.sm-scanner-art').evaluate(n=>({display:getComputedStyle(n).display,width:n.getBoundingClientRect().width}));
   assert.equal(state.display==='none',width<=480,f.name+' responsive visibility');
   if(width>480)assert.ok(await page.locator('.sm-scanner-art').evaluate(n=>{const a=n.getBoundingClientRect();return [...document.querySelectorAll('input,select,button,label')].every(e=>{const b=e.getBoundingClientRect();return !b.width||!b.height||a.right<=b.left||a.left>=b.right||a.bottom<=b.top||a.top>=b.bottom;});}),f.name+' no control overlap');
   const added=await page.evaluate(()=>document.documentElement.scrollWidth);
   await page.locator('.sm-scanner-art').evaluate(n=>n.remove());
   const original=await page.evaluate(()=>document.documentElement.scrollWidth);assert.ok(added<=original,f.name+' no added horizontal overflow');
  }
 }
 // Interaction remains on the original scanner input in a disconnected fixture.
 const delivery=fragments.find(f=>f.name==='EntregaDosificacion');
 await page.setViewportSize({width:1280,height:900});await page.setContent(doc(delivery.name,delivery.html,delivery.raw));
 await page.locator('#codigoScan').fill('PRUEBA-VISUAL');await page.locator('#codigoScan').focus();
 assert.equal(await page.evaluate(()=>document.activeElement.id),'codigoScan');assert.equal(await page.locator('#codigoScan').inputValue(),'PRUEBA-VISUAL');
 await page.screenshot({path:'design/visual-resources/scanner.png'});
 // Products: exercise both existing permission branches with and without a photo.
 const productRaw=read('Views/Home/Productos.cshtml');
 const cards=['class="producto-card"','class="producto-card producto-card-solo-lectura"'].map(key=>{
  let card=clean(extract(productRaw,key));const image=extract(card,'class="producto-imagen"');
  card=card.replace(image,'<div class="producto-imagen">💊</div>').replace(/@if[\s\S]*?\{([\s\S]*?)\}/g,'$1').replace(/@producto\.\w+/g,'');
  return card.replace('<div class="producto-nombre">','<div class="producto-nombre">Muestra visual');
 });
 const photo=cards[0].replace('<div class="producto-imagen">💊</div>','<div class="producto-imagen"><img class="producto-foto" alt="Foto de prueba" src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2780%27 height=%27120%27%3E%3Crect x=%2720%27 y=%2720%27 width=%2740%27 height=%2780%27 rx=%278%27 fill=%27%239fc8dd%27/%3E%3C/svg%3E"></div>');
 const footer='<footer class="footer-layout">SARMedix · Sistema de Gestión Farmacéutica · SAR de Chiguay'+partial('Pulse')+'</footer>';
 const content='<div class="productos-grid">'+cards.join('')+photo+'</div>'+footer;
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:900});await page.setContent(doc('Productos',content,productRaw));
  assert.equal(await page.locator('.sm-holo-capsule').count(),3);
  assert.ok(await page.locator('.sm-holo-capsule').evaluateAll(nodes=>nodes.every(n=>{const r=n.getBoundingClientRect(),p=n.parentElement.getBoundingClientRect();return r.left>=p.left&&r.right<=p.right&&r.bottom<=n.nextElementSibling.getBoundingClientRect().top;})),'capsule inside info, above name');
  const after=await page.evaluate(()=>document.documentElement.scrollWidth);await page.locator('.sm-visual').evaluateAll(ns=>ns.forEach(n=>n.remove()));assert.ok(after<=await page.evaluate(()=>document.documentElement.scrollWidth),'no new product/footer overflow');
 }
 await page.setViewportSize({width:1280,height:900});await page.setContent(doc('Productos',content,productRaw));await page.screenshot({path:'design/visual-resources/products.png'});
 // All three resources: motion controls, semantics, and print.
 await page.setContent(doc('Productos','<div class="producto-card">'+partial('Scanner')+partial('Capsule')+'</div>'+footer));
 assert.ok(await page.locator('.sm-scanner-beam,.sm-pulse-traveller,.sm-capsule-glint').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).animationName!=='none')));
 await page.emulateMedia({reducedMotion:'reduce'});assert.ok(await page.locator('.sm-visual *').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).animationName==='none')));
 await page.emulateMedia({reducedMotion:'no-preference'});await page.evaluate(()=>document.body.classList.add('sm-motion-paused'));assert.ok(await page.locator('.sm-visual *').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).animationName==='none')));
 await page.emulateMedia({media:'print'});assert.ok(await page.locator('.sm-visual').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).display==='none')));
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: six real scanner fragments at 1440/768/390/320; no added overlap/overflow; input typing/focus; medicine cards editable/read-only/photo; footer; reduced motion/global pause; print; no JS errors. Disconnected presentation tests only.');
})().catch(e=>{console.error(e);process.exit(1);});
