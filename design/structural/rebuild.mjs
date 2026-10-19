import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const names=['Lotes','Dosificaciones','Historial'];
const file=n=>`LoginSARMedix/Views/Home/${n}.cshtml`;
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const baseline=path.join(root,'design/structural/baseline.json');
if(fs.existsSync(baseline)) throw Error('Structural baseline already exists. Do not repeat transformation.');
const walk=p=>fs.readdirSync(path.join(root,p),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+'/'+e.name):[p+'/'+e.name]);
const protectedFiles=[...walk('LoginSARMedix/Views'),...walk('LoginSARMedix/wwwroot/css'),...walk('LoginSARMedix/wwwroot/js'),...Object.keys(JSON.parse(read('design/integral/baseline.json')).protected)].filter(p=>!names.map(file).includes(p));
fs.writeFileSync(baseline,JSON.stringify({views:Object.fromEntries(names.map(n=>[file(n),read(file(n))])),protected:Object.fromEntries([...new Set(protectedFiles)].map(p=>[p,hash(read(p))]))},null,2));
const css='<link rel="stylesheet" href="~/css/sarmedix-structural.css" asp-append-version="true" />\n';
const icon=n=>`<svg class="sm-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#sm-icon-${n}" /></svg>`;
const instrument='<partial name="_OrbitInstrument" />';
const replace=(s,a,b)=>{if(!s.includes(a))throw Error('Missing anchor '+a.slice(0,100));return s.replace(a,b);};
let s=read(file('Lotes'));
const start=s.indexOf('<div class="usuarios-card sm-inventory">'),end=s.indexOf('<style>');
const message=s.slice(s.indexOf('    @if (TempData'),s.indexOf('    <!-- BOTON REGISTRAR')).replace(/\s*<!-- ========================================= -->\s*$/,'');
// Keep the original permission branch around the entry action.
const entry=s.slice(s.indexOf('    @if (puedeRegistrar)'),s.indexOf('    <!-- TABLA DE INVENTARIO')).replace(/\s*<!-- ========================================= -->\s*$/,'');
const navStart=s.indexOf('    <div class="contenedor-navegacion">');
const nav=s.slice(navStart,s.lastIndexOf('</div>',end));
s=s.slice(0,start)+css+`
<section class="usuarios-card sm-reimagined sm-stock-workspace" aria-label="Inventario">
    <aside class="sm-stock-rail">
        <div class="sm-overline">ÓRBITA / EXISTENCIAS</div>
        <h1>Todo el stock.<br /><em>En perspectiva.</em></h1>
        <p class="sm-lead">Consulta cada lote, su ubicación y su vencimiento desde una sola vista.</p>
        <div class="sm-stock-instrument">${instrument}<div class="sm-instrument-reading"><strong>@(Model?.Count ?? 0)</strong><span>Lotes en esta vista</span></div></div>
        <div class="sm-rail-actions">${entry}</div>
        <div class="sm-rail-navigation">${nav}</div>
    </aside>
    <div class="sm-stock-content">
        ${message}
        <header class="sm-workspace-heading"><div><span class="sm-overline">INVENTARIO / LOTES</span><h2>Mapa de existencias</h2></div><span class="sm-workspace-symbol">${icon('inventory')}</span></header>
        <div class="sm-stock-key"><span>Producto y lote</span><span>Vencimiento · Stock · Ubicación</span>@if (puedeRegistrar) { <span>Gestión</span> }</div>
        @if (Model != null && Model.Count > 0)
        {
            <ul class="sm-stock-list">
            @foreach (var lote in Model)
            {
                <li class="sm-stock-record">
                    <div class="sm-stock-product"><span class="sm-record-icon">${icon('products')}</span><div><h3>@lote.nombre_producto</h3><span class="sm-stock-lot">Lote <strong>@lote.numero_lote</strong></span></div></div>
                    <dl class="sm-stock-facts">
                        <div><dt>Vencimiento</dt><dd>@lote.fecha_vencimiento?.ToString("dd-MM-yyyy")</dd></div>
                        <div class="sm-stock-quantity"><dt>Stock actual</dt><dd><span class="cantidad-lote">@lote.cantidad_actual</span></dd></div>
                        <div><dt>Ubicación</dt><dd>@lote.nombre_ubicacion</dd></div>
                    </dl>
                    @if (puedeRegistrar)
                    {
                        <a asp-controller="Home" asp-action="EditarLote" asp-route-idLote="@lote.id_lote" class="btn-editar">Editar</a>
                    }
                </li>
            }
            </ul>
        }
        else
        {
            <div class="sin-registros">No existen existencias registradas en el inventario.</div>
        }
    </div>
</section>
`+s.slice(end);
fs.writeFileSync(path.join(root,file('Lotes')),s);

s=read(file('Dosificaciones'));
s=replace(s,'<section class="dosif-pagina">',css+'<section class="dosif-pagina sm-reimagined sm-dose-workspace">');
const headStart=s.indexOf('    <div class="dosif-encabezado">'), headEnd=s.indexOf('    <div class="dosif-aviso">',headStart);
s=s.slice(0,headStart)+`<header class="sm-dose-heading"><div><span class="sm-overline">ÓRBITA / PREPARACIÓN</span><h1>Preparar hoy.<br /><em>Entregar con precisión.</em></h1><p>Crea códigos reutilizables para los paquetes que se preparan con anticipación.</p></div><div class="sm-dose-orbit" aria-hidden="true">${instrument}</div></header>\n`+s.slice(headEnd);
s=replace(s,'<div class="dosif-grid">','<div class="dosif-grid sm-dose-studio">');
s=replace(s,'<div class="dosif-panel">','<div class="dosif-panel sm-dose-composer">');
s=replace(s,'<h2>Nueva programación</h2>','<div class="sm-composer-title"><span class="sm-step-number" aria-hidden="true">01</span><div><span class="sm-overline">MESA DE PREPARACIÓN</span><h2>Nueva programación</h2></div></div>');
const firstField=s.indexOf('                <div class="campo">',s.indexOf('id="formDosificacion"'));
s=s.slice(0,firstField)+'<div class="sm-dose-fields"><fieldset class="sm-dose-origin"><legend>Destino y medicamento</legend>'+s.slice(firstField);
const quantity=s.indexOf('                <div class="campo">\r\n                    <label>Cantidad por paquete');
if(quantity<0)throw Error('Quantity anchor missing');
s=s.slice(0,quantity)+'</fieldset><fieldset class="sm-dose-amount"><legend>Contenido del paquete</legend>'+s.slice(quantity);
const summary=s.indexOf('                <div class="resumen"');
s=s.slice(0,summary)+'</fieldset></div><aside class="sm-dose-proof"><div class="sm-proof-heading">'+icon('products')+'<span>Antes de imprimir</span></div>'+s.slice(summary);
const formEnd=s.indexOf('            </form>',summary);
s=s.slice(0,formEnd)+'</aside>'+s.slice(formEnd);
s=replace(s,'<div class="dosif-panel">','<div class="dosif-panel sm-dose-library">');
s=replace(s,'<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:18px;">','<div class="sm-library-heading">');
s=replace(s,'<h2 style="margin:0;">','<h2>');
s=replace(s,'<div class="sin-programaciones">','<div class="sin-programaciones">');
const each=s.indexOf('                @foreach (var item in programaciones)');
s=s.slice(0,each)+'<div class="sm-program-library">'+s.slice(each);
const libraryEnd=s.indexOf('\r\n            }',each);
s=s.slice(0,libraryEnd)+'</div>'+s.slice(libraryEnd);
fs.writeFileSync(path.join(root,file('Dosificaciones')),s);

s=read(file('Historial'));
s=replace(s,'<div class="historial-card">',css+'<div class="historial-card sm-reimagined sm-history-workspace">');
const hs=s.indexOf('    <div class="historial-titulo">'),he=s.indexOf('    <!-- =========================================================',hs);
s=s.slice(0,hs)+`<header class="sm-history-heading"><span class="sm-workspace-symbol">${icon('movements')}</span><div><span class="sm-overline">ÓRBITA / TRAZABILIDAD</span><h1>La memoria del sistema.</h1><p>Cada acción, su responsable y su momento. Historial del sistema.</p></div></header><div class="sm-history-grid"><aside class="sm-history-console"><div class="sm-console-heading"><span class="sm-overline">EXPLORAR REGISTROS</span><h2>Encuentra el contexto</h2><p>Busca por responsable o descripción y delimita la consulta.</p></div>\n`+s.slice(he);
const filtersEnd=s.indexOf('    <div class="historial-resumen-filtros">');
s=s.slice(0,filtersEnd)+'</aside><section class="sm-history-ledger" aria-label="Registros del sistema">'+s.slice(filtersEnd);
// Replace the table's visual structure with semantic event articles. The
// foreach, parsing code, conditions and every original data expression remain.
s=replace(s,'<div class="tabla-contenedor">','<div class="sm-event-stream">');
const table=s.indexOf('            <table class="tabla-historial">'),tbody=s.indexOf('<tbody>',table);
s=s.slice(0,table)+s.slice(tbody+7);
s=replace(s,'                        <tr>','                        <article class="sm-history-event">');
s=replace(s,'                        </tr>','                        </article>');
s=replace(s,'                </tbody>','');
s=replace(s,'            </table>','');
const articleStart=s.indexOf('<article class="sm-history-event">'),articleEnd=s.indexOf('</article>',articleStart);
let article=s.slice(articleStart,articleEnd);
article=article.replace('<td>','<div class="sm-event-id"><span class="sm-overline">Registro</span>').replace('</td>','</div>');
article=article.replace('<td>','<div class="sm-event-person"><span class="sm-overline">Responsable</span>').replace('</td>','</div>');
article=article.replace('<td class="descripcion-historial">','<div class="descripcion-historial sm-event-detail">').replace('</td>','</div>');
article=article.replace('<td>','<div class="sm-event-date"><span class="sm-overline">Fecha y hora</span>').replace('</td>','</div>');
s=s.slice(0,articleStart)+article+s.slice(articleEnd);
const back=s.indexOf('    <div class="contenedor-volver">');
s=s.slice(0,back)+'</section></div>'+s.slice(back);
fs.writeFileSync(path.join(root,file('Historial')),s);
console.log('Three real Razor views structurally rebuilt; original scripts retained.');
