import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(dir,'../..');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
export const groups={
  access:['Index','RecuperarContrasena','VerificarCodigo','NuevaContrasena','AccesoDenegado'],
  users:['Modulos/UsuariosPermisos','Usuarios','CrearUsuario','EditarUsuario','ListadoEliminarUsuarios','RolesPermisos','CrearRol','EditarRol','RolesInactivos'],
  products:['Modulos/Productos','Productos','CrearProducto','EditarProducto','Lotes','CrearLote','EditarLote'],
  sectors:['Ubicaciones','InventarioUbicacion'],
  movements:['Modulos/MovimientoHistorial','TrasladarStock','BajaInventario','SalidaExtraordinaria'],
  dosing:['Dosificaciones','EntregaDosificacion','ImprimirDosificacion'],
  controlled:['Modulos/MedicamentosControlados'],
  history:['Historial','HistorialUsuarios','HistorialProductos','HistorialSectores','HistorialSalidasTurno','InformeSalidasTurno'],
  home:['Bienvenida'],
  error:['../Shared/Error']
};
const viewPath=name=>path.posix.normalize('LoginSARMedix/Views/Home/'+name+'.cshtml');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function walk(p){return fs.readdirSync(path.join(root,p),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+'/'+e.name):[p+'/'+e.name]);}
// Only these deliberately added presentation annotations and decorative icons
// are normalized. Every original script, condition, field and markup stays exact.
function original(s){return s.replace(/@\* SM-ORBITA-METADATA \*@\r?\n@\{ ViewData\["SmScreen"\] = "[^"]+"; ViewData\["SmFamily"\] = "[^"]+"; \}\r?\n/,'')
  .replace(/<!-- SM-ORBITA-STANDALONE -->\n<link rel="stylesheet" href="~\/css\/sarmedix-system.css" asp-append-version="true" \/>\n/,'')
  .replace(/<body class="sm-standalone" data-sm-family="[^"]+" data-sm-screen="[^"]+">/,'<body>')
  .replace(/(<div class="submenu-icono">)[\s\S]*?(<\/div>)/g,'$1[DECORATIVE ICON]$2');}
const baselineFile=path.join(dir,'baseline.json');
const action=process.argv[2];
if(action==='capture') {
  if(fs.existsSync(baselineFile))throw Error('Baseline already exists');
  const views=Object.values(groups).flat().map(viewPath);
  const protectedPaths=[...walk('LoginSARMedix/Controllers'),...walk('LoginSARMedix/Repository'),...walk('LoginSARMedix/Models'),...walk('LoginSARMedix/EmailService'),...walk('LoginSARMedix/ViewComponents'),...walk('LoginSARMedix/wwwroot/js'),...walk('LoginSARMedix/wwwroot/css'),
    ...walk('LoginSARMedix/Views').filter(p=>!views.includes(p)&&!p.endsWith('/_Layout.cshtml')),
    ...fs.readdirSync(path.join(root,'LoginSARMedix')).filter(p=>p.startsWith('appsettings')||p==='Program.cs'||p.endsWith('.csproj')).map(p=>'LoginSARMedix/'+p)];
  fs.writeFileSync(baselineFile,JSON.stringify({views:Object.fromEntries(views.map(p=>[p,{original:hash(original(read(p))),scripts:[...read(p).matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m=>hash(m[0]))}])),protected:Object.fromEntries(protectedPaths.map(p=>[p,hash(fs.readFileSync(path.join(root,p)))]))},null,2));
  console.log(`Captured ${views.length} real screens and ${protectedPaths.length} protected files.`);
} else if(action==='apply') {
  const family=process.argv[3];
  if(!groups[family])throw Error('Unknown family');
  for(const name of groups[family]) {
    const p=viewPath(name);let s=read(p);
    if(s.includes('SM-ORBITA-METADATA'))continue;
    const screen=name.replace('Modulos/','Modulo').replace('../Shared/','');
    const bom=s.startsWith('\uFEFF')?'\uFEFF':'';
    s=bom+`@* SM-ORBITA-METADATA *@\n@{ ViewData["SmScreen"] = "${screen}"; ViewData["SmFamily"] = "${family}"; }\n`+s.slice(bom.length);
    if(name==='AccesoDenegado'||name==='InformeSalidasTurno') {
      s=s.replace('</head>','<!-- SM-ORBITA-STANDALONE -->\n<link rel="stylesheet" href="~/css/sarmedix-system.css" asp-append-version="true" />\n</head>')
        .replace('<body>',`<body class="sm-standalone" data-sm-family="${family}" data-sm-screen="${screen}">`);
    }
    // Same links, labels and conditions; replace only the old decorative glyph.
    if(name.startsWith('Modulos/')&&family!=='controlled') {
      const icon=family==='users'?'users':family==='products'?'products':'movements';
      s=s.replace(/(<div class="submenu-icono">)[\s\S]*?(<\/div>)/g,`$1<svg class="sm-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#sm-icon-${icon}" /></svg>$2`);
    }
    fs.writeFileSync(path.join(root,p),s);
  }
  console.log(`Applied ${family}: ${groups[family].length} Razor screens.`);
} else if(action==='verify') {
  const baseline=JSON.parse(fs.readFileSync(baselineFile,'utf8'));const errors=[];
  for(const [p,v] of Object.entries(baseline.views)) {
    const s=read(p);
    if(hash(original(s))!==v.original)errors.push('Nonpresentation markup changed: '+p);
    if(JSON.stringify([...s.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m=>hash(m[0])))!==JSON.stringify(v.scripts))errors.push('Script changed: '+p);
  }
  for(const [p,h] of Object.entries(baseline.protected))if(hash(fs.readFileSync(path.join(root,p)))!==h)errors.push('Protected file changed: '+p);
  if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
  else console.log(`PASS: all ${Object.keys(baseline.views).length} screen contracts and original scripts preserved; ${Object.keys(baseline.protected).length} protected files unchanged.`);
}
