/* Offline empty-state presentation fixtures. No application scripts, requests,
 * credentials, inventory or synthetic medication records. Not a Razor runtime. */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
const root=path.resolve('LoginSARMedix');
function end(s,start,open='{',close='}') {let depth=0,quote='';for(let i=start;i<s.length;i++){const c=s[i];if(quote){if(c===quote&&s[i-1]!=='\\')quote='';continue;}if(c==='"'||c==="'"){quote=c;continue;}if(c===open)depth++;if(c===close&&!--depth)return i;}throw Error('Unbalanced fixture at '+start);}
function strip(s){
 s=s.replace(/@\*[\s\S]*?\*@/g,'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/@(?:using|model|inject)[^\n]*/g,'');
 let i;while((i=s.indexOf('@{'))>=0)s=s.slice(0,i)+s.slice(end(s,i+1)+1);
 while((i=s.search(/@(?:if|foreach|for|section)\b/))>=0){const a=s.indexOf('{',i),b=end(s,a);let tail=b+1;const following=s.slice(tail).match(/^\s*else\s*(?:if\s*\([^]*?\)\s*)?\{/);if(following){const c=tail+following[0].lastIndexOf('{');tail=end(s,c)+1;}s=s.slice(0,i)+s.slice(tail);}
 s=s.replace(/@Html\.AntiForgeryToken\(\)/g,'').replace(/<partial name="_OrbitInstrument"\s*\/>/g,fs.readFileSync(root+'/Views/Shared/_OrbitInstrument.cshtml','utf8'));
 s=s.replace(/@@media/g,'@media');
 // Empty bound values; never substitute invented records.
 s=s.replace(/@(Model|ViewBag|TempData)\.[\w?.]+(?:\([^)]*\))?/g,'').replace(/@(?:buscarActual|filtroActual|periodoActual|nombreUbicacion)/g,'');
 s=s.replace(/\sasp-[\w-]+="[^"]*"/g,'').replace(/\son\w+="[^"]*"/g,'');
 s=s.replace(/(href|src)="~\//g,'$1="/');
 return s;
}
const names=['Index','RecuperarContrasena','NuevaContrasena','CrearUsuario','EditarUsuario','CrearProducto','EditarProducto','CrearRol','EditarRol','CrearLote','EditarLote','EntregaDosificacion'];
fs.mkdirSync('design/global/previews',{recursive:true});
const css=['site','sidebar','sarmedix-ui','sarmedix-orbita-v2','sarmedix-system','sarmedix-structural','sarmedix-refinement'];
for(const name of names){const raw=fs.readFileSync(root+'/Views/Home/'+name+'.cshtml','utf8');const family=raw.match(/SmFamily"\] = "([^"]+)/)[1];
 const html='<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+css.map(n=>'<link rel="stylesheet" href="/css/'+n+'.css">').join('')+'<body class="sm-app" data-sm-screen="'+name+'" data-sm-family="'+family+'"><div style="padding:10px;background:#fff;color:#385575;font:13px system-ui">Vista estática sin datos · '+name+' · Formularios desconectados</div><main role="main" id="sm-main" style="width:100%;padding:24px;display:block">'+strip(raw)+'</main><link rel="stylesheet" href="/css/sarmedix-global.css"><script>document.addEventListener("submit",e=>e.preventDefault());document.querySelectorAll("a").forEach(a=>a.removeAttribute("href"));</script></body></html>';
 fs.writeFileSync('design/global/previews/'+name+'.html',html);
}
if(process.argv.includes('--serve'))http.createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(pathname.startsWith('/css/')?root+'/wwwroot':'design/global/previews','.'+pathname);const allowed=pathname.startsWith('/css/')?path.resolve(root+'/wwwroot'):path.resolve('design/global/previews');if(!file.startsWith(allowed+path.sep)){res.writeHead(403).end();return;}try{res.setHeader('Content-Type',file.endsWith('.css')?'text/css':'text/html; charset=utf-8');res.end(fs.readFileSync(file));}catch{res.writeHead(404).end();}}).listen(4179,'127.0.0.1',()=>console.log('Offline fixtures: http://127.0.0.1:4179/Index.html'));
