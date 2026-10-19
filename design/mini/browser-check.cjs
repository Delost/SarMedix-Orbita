// Offline presentation fixtures only. Never launches SARMedix or contacts MySQL.
const fs=require('fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.CODEX_NODE_MODULES+'/playwright');
const root='LoginSARMedix/';
const source=fs.readFileSync(root+'Views/Shared/_OrbitMini.cshtml','utf8');
const mapping=JSON.parse(fs.readFileSync('design/mini/mapping.json'));
function svg(variant){
  let start=source.slice(source.indexOf('<svg'),source.indexOf('@if (mini.Item1 == "inventory")'));
  if(variant==='inventory')start+=source.match(/<g class="sm-mini-ellipses">[\s\S]*?<\/g>/)[0];
  const name=variant==='protection'?'preparation':variant;
  let icon=source.slice(source.indexOf('case "'+name+'":')+name.length+8);
  icon=icon.slice(0,icon.indexOf('break;')).replace(/\s*case "protection":/,'');
  if(['preparation','protection'].includes(variant)){
    const i=icon.indexOf('@if');const branches=icon.slice(i).match(/\{([\s\S]*?)\}\s*else\s*\{([\s\S]*?)\}/);
    icon=icon.slice(0,i)+branches[variant==='preparation'?1:2];
  }
  start+='<g class="sm-mini-icon">'+icon+'</g>';
  if(['memory','security'].includes(variant))start+=source.match(/<g class="sm-mini-events">[\s\S]*?<\/g>/)[0];
  start+=source.match(/<path class="sm-mini-marks"[^>]*\/>/)[0]+'</svg>';
  return '<span class="sm-mini sm-mini--'+variant+'" aria-hidden="true">'+start+'</span>';
}
const css=fs.readFileSync(root+'wwwroot/css/orbit-mini.css','utf8');
const script=fs.readFileSync(root+'wwwroot/js/orbit-mini.js','utf8');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const variants=[...new Set(mapping.map(m=>m.variant))];
 await page.setContent('<style>'+css+'body{background:#edf3fa;font:15px Segoe UI;color:#23446b;padding:36px}.gallery{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}.sample{padding:20px;background:#fff;border:1px solid #cfdeee;border-radius:18px}.sm-mini{margin:auto}h2{font-size:16px;text-align:center}</style><h1>Órbita · familia de miniórbitas</h1><p>Muestra decorativa aislada, sin datos de la aplicación.</p><div class="gallery">'+variants.map(v=>'<div class="sample"><h2>'+v+'</h2>'+svg(v)+'</div>').join('')+'</div>');
 await page.screenshot({path:'design/mini/gallery.png'});
 const running=await page.locator('.sm-mini-track').evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n).animationName!=='none'));assert.ok(running);
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.ok(await page.locator('.sm-mini *').evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n).animationName==='none')));
 await page.emulateMedia({reducedMotion:'no-preference'});await page.evaluate(()=>document.body.classList.add('sm-motion-paused'));
 assert.ok(await page.locator('.sm-mini *').evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n).animationName==='none')));
 // Actual mounting code, representative flex, block and reserved-slot headings.
 for(const mode of ['heading','below','slot']){
   await page.setViewportSize({width:1440,height:900});
   await page.setContent('<style>'+css+'body{margin:0}main{padding:24px}.host{'+(mode==='heading'?'display:flex;justify-content:space-between;align-items:center;':mode==='slot'?'position:relative;width:120px;height:120px;':'width:280px;')+'}h1{max-width:100%;overflow-wrap:anywhere}</style><body class="sm-app" data-sm-family="users" data-sm-screen="Usuarios"><main><div class="host"><h1>Encabezado conservado</h1>'+(mode==='heading'?'<button>Acción existente</button>':'')+'</div></main><template id="sm-mini-template" data-mini-target=".host" data-mini-placement="'+mode+'">'+svg('security')+'</template></body>');
   await page.addScriptTag({content:script});
   await page.waitForFunction(()=>!document.querySelector('.sm-mini').hidden);
   assert.equal(await page.locator('.sm-mini').count(),1);
   if(mode==='heading')assert.ok(await page.evaluate(()=>{const mini=document.querySelector('.sm-mini').getBoundingClientRect();return [...document.querySelectorAll('h1,button')].every(n=>n.getBoundingClientRect().right<=mini.left);}));
   await page.setViewportSize({width:390,height:844});await page.waitForFunction(()=>document.querySelector('.sm-mini').hidden);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 // Real header fragments + their local/global styles; Razor data is not evaluated.
 const paths=fs.readdirSync(root+'Views/Home',{recursive:true}).filter(p=>p.endsWith('.cshtml'));
 const sheets=['site','sidebar','sarmedix-ui','sarmedix-orbita-v2','sarmedix-system','sarmedix-structural','sarmedix-refinement','sarmedix-global'].map(p=>fs.readFileSync(root+'wwwroot/css/'+p+'.css','utf8')).join('\n');
 for(const m of mapping){
   const raw=paths.map(p=>fs.readFileSync(root+'Views/Home/'+p,'utf8')).find(s=>new RegExp('SmScreen"\\]\\s*=\\s*"'+m.screen+'"').test(s));
   const cls=m.target.split('.').at(-1);
   const opening=new RegExp('<(\\w+)\\b[^>]*class="[^"\\n]*\\b'+cls+'\\b[^"\\n]*"[^>]*>').exec(raw);
   const tag=opening[1];let depth=0,end=0;
   const tail=raw.slice(opening.index);const tags=new RegExp('<(/?)'+tag+'\\b[^>]*>','g');
   for(const t of tail.matchAll(tags)){depth+=t[1]?-1:1;if(!depth){end=t.index+t[0].length;break;}}
   let header=tail.slice(0,end).replace(/@\*[\s\S]*?\*@/g,'').replace(/\son\w+="[^"]*"/g,'').replace(/@\([^]*?\)/g,'').replace(/@[\w.]+(?:\([^)]*\))?/g,'').replace(/<partial[^>]*\/>/g,'');
   const local=[...raw.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(x=>x[1].replace(/@@/g,'@')).join('\n');
   const family=raw.match(/SmFamily"\]\s*=\s*"([^"]+)"/)[1];
   await page.setViewportSize({width:1440,height:900});
   await page.setContent('<style>'+sheets+'\n'+local+'\n'+css+'</style><body class="sm-app" data-sm-screen="'+m.screen+'" data-sm-family="'+family+'"><main style="margin:32px;width:1000px;max-width:calc(100% - 64px)"><div class="sm-reimagined">'+header+'</div></main><template id="sm-mini-template" data-mini-target="'+m.target+'" data-mini-placement="'+m.placement+'">'+svg(m.variant)+'</template></body>');
   await page.addScriptTag({content:script});
   await page.waitForFunction(()=>document.querySelector('.sm-mini'));
   const mounted=await page.locator('.sm-mini').evaluate(n=>!n.hidden);
   console.log(m.screen+': '+(mounted?'visible':'omitted: insufficient space'));
   if(m.placement==='heading' && mounted)assert.ok(await page.locator(m.target).evaluate(host=>{const mini=host.querySelector('.sm-mini').getBoundingClientRect();return [...host.querySelectorAll('h1,h2,button,a,input,select')].filter(n=>!n.closest('.sm-mini')).every(n=>n.getBoundingClientRect().right<=mini.left+1);}),m.screen+' reserved space');
   if(m.screen==='Historial')await page.screenshot({path:'design/mini/history-heading.png'});
   await page.setViewportSize({width:390,height:844});await page.waitForFunction(()=>document.querySelector('.sm-mini').hidden);
   await page.emulateMedia({media:'print'});assert.equal(await page.locator('.sm-mini').evaluate(n=>getComputedStyle(n).display),'none');await page.emulateMedia({media:'screen'});
 }
 assert.deepEqual(errors,[]);await browser.close();
 console.log('PASS Edge headless: 8 SVG variants; reduced motion; global pause; 3 placement modes; mobile hide/overflow; 31 real header fragments with original styles, reserved title/control space, mobile and print hiding; no JS errors. Offline fixtures only.');
})().catch(e=>{console.error(e);process.exit(1);});
