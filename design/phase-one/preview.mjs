// Static presentation fixture built from the actual Razor markup. NOT a Razor
// runtime or an application server. Never loads .NET, configuration or MySQL.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const outputDir=process.argv.includes('--v2') ? path.resolve(dir,'../phase-two') : dir;
fs.mkdirSync(outputDir,{recursive:true});
const root=path.resolve(dir,'../../LoginSARMedix');
const read=p=>fs.readFileSync(path.join(root,p),'utf8').replace(/^\uFEFF/,'');
function end(s,start,open='{',close='}') {
  let depth=0, quote='';
  for(let i=start;i<s.length;i++) {
    const c=s[i];
    if(quote) { if(c===quote && s[i-1]!=='\\') quote=''; continue; }
    if(c==='"' || c==="'") { quote=c; continue; }
    if(c===open) depth++;
    if(c===close) { depth--; if(depth===0)return i; }
  }
  throw new Error('Unbalanced fixture markup');
}
function conditions(s,values={}) {
  let start=s.indexOf('@if');
  while(start>=0) {
    const a=s.indexOf('(',start), b=end(s,a,'(',')');
    const expression=s.slice(a+1,b).replace(/\s+/g,' ').trim();
    const c=s.indexOf('{',b), d=end(s,c);
    let tail=d+1, alternative='';
    const following=s.slice(tail).match(/^\s*else\s*\{/);
    if(following) { const e=tail+following[0].lastIndexOf('{'), f=end(s,e); alternative=s.slice(e+1,f); tail=f+1; }
    let yes=values[expression] ?? true;
    if(expression.includes('TempData')) yes=false;
    if(expression==='Model.Total > 0') yes=false;
    if(expression==='Model.Total == 0') yes=true;
    s=s.slice(0,start)+conditions(yes?s.slice(c+1,d):alternative,values)+s.slice(tail);
    start=s.indexOf('@if');
  }
  return s;
}
function removeInitial(s) {
  const i=s.indexOf('@{');
  return i<0?s:s.slice(0,i)+s.slice(end(s,i+1)+1);
}
function prepare(s,values) {
  return conditions(removeInitial(s),values).replace(/^@(using|model).*$/gm,'').replace(/@@media/g,'@media');
}
function sidebar(page) {
  return prepare(read('Views/Shared/_Sidebar.cshtml')).replace(/@\(([^\r\n]*?)\s*\?\s*"activo"\s*:\s*""\)/g,(_,v)=>page!=='welcome'&&(v==='inventarioActivo'||v.includes('accionActual == "Lotes"'))?'activo':'');
}
const alerts=prepare(read('Views/Shared/Components/Alertas/Default.cshtml'));
const artwork=read('Views/Shared/_OrbitalMark.cshtml').replace(/@\*[\s\S]*?\*@/g,'');
const data=[
  ['Paracetamol 500 mg','LT-2026-041','15-08-2027','240','Bodega central'],
  ['Ibuprofeno 400 mg','LT-2026-058','22-11-2027','180','Clínica 01'],
  ['Suero fisiológico 0,9%','LT-2026-062','10-03-2028','96','Bodega central'],
  ['Guantes de examen · talla M','LT-2026-073','30-06-2028','320','Clínica 02'],
  ['Gasas estériles 10 × 10','LT-2026-081','18-09-2028','150','Bodega central']
];
function inventory(empty=false) {
  let s=read('Views/Home/Lotes.cshtml');
  const i=s.indexOf('@foreach'), a=s.indexOf('{',i), b=end(s,a);
  const template=s.slice(a+1,b);
  const rows=data.map((row,index)=>template.replace(/@lote.fecha_vencimiento\?\.ToString\(\s*"dd-MM-yyyy"\s*\)/g,row[2]).replace(/@lote.nombre_producto/g,row[0]).replace(/@lote.numero_lote/g,row[1]).replace(/@lote.cantidad_actual/g,row[3]).replace(/@lote.nombre_ubicacion/g,row[4]).replace(/@lote.id_lote/g,String(index+1))).join('');
  s=s.slice(0,i)+rows+s.slice(b+1);
  return prepare(s,{'Model != null && Model.Count > 0':!empty});
}
function documentFor(page) {
  const body=page==='welcome'?prepare(read('Views/Home/Bienvenida.cshtml')).replace('<partial name="_OrbitalMark" />',artwork):inventory(page==='empty');
  let layout=read('Views/Shared/_Layout.cshtml');
  layout=prepare(layout).replace(/@await Component.InvokeAsync\(\s*"Alertas"\s*\)/g,alerts)
    .replace('<partial name="_ModuleIcons" />',read('Views/Shared/_ModuleIcons.cshtml').replace(/@\*[\s\S]*?\*@/g,''))
    .replace('<partial name="_Sidebar" />',sidebar(page)).replace('@RenderBody()',body)
    .replace(/@await RenderSectionAsync\([\s\S]*?\)/g,'')
    .replace(/@ViewData\["Title"\]/g,'Vista previa · Órbita')
    .replace(/@tituloBarra/g,page==='welcome'?'Espacio de trabajo':'Inventario')
    .replace(/@nombreCompleto/g,'Usuario de demostración').replace(/@rol/g,'Administrador').replace(/@inicial/g,'D')
    .replace(/href="~\/LoginSARMedix.styles.css"/g,'href="/empty.css"')
    .replace(/(["'])~\//g,'$1/');
  // TagHelper links become local fixture links. No URL points to a real endpoint.
  layout=layout.replace(/<a\b([^>]*?)asp-action="([^"]+)"([^>]*)>/g,(_,a,action,b)=>`<a ${a}href="${action==='Modulos'?'/':action==='Lotes'?'/inventory.html':'#preview-unavailable'}" ${b}>`);
  const toolbar=`<div class="preview-bar"><strong>ÓRBITA / FASE 01</strong><span>Vista estática · Datos ficticios · Sin conexión a MySQL</span><nav><a href="/">Bienvenida</a><a href="/inventory.html">Inventario</a><a href="/empty.html">Sin registros</a></nav></div>`;
  const previewStyle=`<style>.preview-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 24px;background:#e8effc;color:#26416a;font:11px 'Segoe UI',sans-serif;order:-1}.preview-bar strong{font-size:9px;letter-spacing:1.5px}.preview-bar nav{display:flex;gap:16px}.preview-bar a{color:#204fa0;text-decoration:none}.preview-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#102c51;color:white;padding:14px 22px;border-radius:12px;font-size:13px;z-index:100000;box-shadow:0 12px 40px #122c5144}@media(max-width:700px){.preview-bar{flex-wrap:wrap;padding:10px 14px}.preview-bar>span{display:none}}@media print{.preview-bar{display:none}}</style>`;
  const previewScript=`<script>document.addEventListener('click',e=>{const a=e.target.closest('a[href="#preview-unavailable"]');if(a){e.preventDefault();note();}});document.addEventListener('submit',e=>{e.preventDefault();note();},true);function note(){document.querySelector('.preview-toast')?.remove();const n=document.createElement('div');n.className='preview-toast';n.setAttribute('role','status');n.textContent='Vista previa: esta acción no se ejecuta.';document.body.append(n);setTimeout(()=>n.remove(),3000);}document.getElementById('formCerrarSesion').submit=()=>{cerrarConfirmacionCerrarSesion();note();};</script>`;
  layout=layout.replace('</head>',previewStyle+'</head>').replace('<body class="sm-app">','<body class="sm-app">'+toolbar).replace('</body>',previewScript+'</body>');
  // Portable, offline deliverable: embed the exact project CSS and JS.
  layout=layout.replace(/<link\b[^>]*href="([^"]+)"[^>]*>/g,(_,url)=>url==='/empty.css'?'':`<style>${read('wwwroot'+url)}</style>`);
  layout=layout.replace(/<script\b[^>]*src="([^"]+)"[^>]*>[\s\S]*?<\/script>/g,(_,url)=>`<script>${read('wwwroot'+url)}</script>`);
  layout=layout.replace(/href="\/"/g,'href="index.html"').replace(/href="\/inventory.html"/g,'href="inventory.html"').replace(/href="\/empty.html"/g,'href="empty.html"');
  return layout;
}
for(const [page,file] of [['welcome','index.html'],['inventory','inventory.html'],['empty','empty.html']]) {
  const html=documentFor(page).replace('ÓRBITA / FASE 01',process.argv.includes('--v2')?'ÓRBITA / VERSIÓN 02':'ÓRBITA / FASE 01');
  if(/@(if|foreach|RenderBody|await|lote|Model|ViewData)/.test(html))throw new Error(`Unresolved Razor in ${file}`);
  fs.writeFileSync(path.join(outputDir,file),html);
}
console.log('Generated 3 static fixtures from current view markup and original scripts. Demo data only.');
if(process.argv.includes('--serve')) {
  const server=http.createServer((req,res)=>{
    const url=new URL(req.url,'http://127.0.0.1');
    if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}
    let target;
    if(['/','/index.html','/inventory.html','/empty.html'].includes(url.pathname))target=path.join(outputDir,url.pathname==='/'?'index.html':url.pathname.slice(1));
    else if(/^\/(css|js|lib|images)\//.test(url.pathname)) {
      target=path.resolve(root,'wwwroot','.'+decodeURIComponent(url.pathname));
      if(!target.startsWith(path.join(root,'wwwroot')+path.sep))target=null;
    }
    if(url.pathname==='/empty.css'){res.writeHead(200,{'Content-Type':'text/css'});res.end();return;}
    if(!target||!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);res.end('Static preview only');return;}
    const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(fs.readFileSync(target));
  });
  server.listen(4173,'127.0.0.1',()=>console.log('Static preview: http://127.0.0.1:4173 (no ASP.NET or database)'));
}
