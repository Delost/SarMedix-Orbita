import fs from 'node:fs';
import crypto from 'node:crypto';
const base='LoginSARMedix/Views/Home/';
const names=['Lotes','CrearLote','EditarLote','Dosificaciones','Historial'];
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const views=Object.fromEntries(names.map(n=>[base+n+'.cshtml',fs.readFileSync(base+n+'.cshtml','utf8')]));
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>['bin','obj'].includes(e.name)?[]:e.isDirectory()?walk(dir+'/'+e.name):[dir+'/'+e.name]);}
const protectedFiles=Object.fromEntries(walk('LoginSARMedix').filter(p=>!Object.hasOwn(views,p)).map(p=>[p,hash(fs.readFileSync(p))]));
if(fs.existsSync('design/refinement/baseline.json'))throw Error('Baseline already exists; do not rerun migration.');
fs.writeFileSync('design/refinement/baseline.json',JSON.stringify({views,protected:protectedFiles},null,2));
const link='<link rel="stylesheet" href="~/css/sarmedix-refinement.css" asp-append-version="true" />\n';
for(const n of names){
 let s=views[base+n+'.cshtml'].replace(/\r\n/g,'\n');
 // Load after local styles. All new styles are screen-only and scoped.
 s+='\n'+link;
 if(n==='Lotes'){
  s=s.replace('<li class="sm-stock-record">',`@{ /* Presentation uses the existing 30-day inventory threshold. */ }
                var fecha = lote.fecha_vencimiento?.Date;
                var estado = !fecha.HasValue ? "Sin fecha" : fecha.Value < DateTime.Today ? "Vencido" : fecha.Value <= DateTime.Today.AddDays(30) ? "Próximo a vencer" : "Vigente";
                var estadoClase = !fecha.HasValue ? "unknown" : fecha.Value < DateTime.Today ? "expired" : fecha.Value <= DateTime.Today.AddDays(30) ? "soon" : "current";
                <li class="sm-stock-record" data-expiry="@estadoClase">`);
  s=s.replace('@{ /* Presentation uses the existing 30-day inventory threshold. */ }','// Presentation uses the existing 30-day inventory threshold.');
  s=s.replace('<dd>@lote.fecha_vencimiento?.ToString("dd-MM-yyyy")</dd>','<dd>@lote.fecha_vencimiento?.ToString("dd-MM-yyyy") <span class="sm-state">@estado</span></dd>');
  s=s.replace('<span class="cantidad-lote">@lote.cantidad_actual</span>','<span class="cantidad-lote">@lote.cantidad_actual</span>@if (lote.cantidad_actual <= 0) { <span class="sm-state sm-zero">Sin stock</span> }');
 }
 if(n==='CrearLote'){
  s=s.replace('class="entrada-pagina"','class="entrada-pagina sm-reception"');
  s=s.replace('<div class="entrada-encabezado">','<div class="entrada-encabezado"><span class="sm-form-eyebrow">ÓRBITA / RECEPCIÓN</span>');
  s=s.replace('<section class="entrada-seccion">','<section class="entrada-seccion sm-identify">');
  s=s.replace('<div class="entrada-columnas">','<div class="sm-receipt-body"><div class="entrada-columnas">');
  s=s.replace('    </form>','        </div>\n    </form>'); // closes receipt body after summary and datosEntrada below
  // Keep datosEntrada as the visibility owner of both details and summary.
  s=s.replace('        </div>\n    </form>','        </div>\n    </form>');
 }
 if(n==='EditarLote'){
  s=s.replace('<h2>Editar lote</h2>',`<section class="sm-lot-editor"><header class="sm-edit-heading"><span class="sm-form-eyebrow">ÓRBITA / FICHA DE LOTE</span><h1>Editar lote</h1><p>Identidad, existencias y destino en una sola ficha.</p></header>`);
  s=s.replace('    <!-- PRODUCTO -->','    <div class="sm-edit-grid"><fieldset class="sm-edit-identity"><legend>01 · Identidad y vigencia</legend>\n    <!-- PRODUCTO -->');
  s=s.replace('    <!-- CANTIDAD ACTUAL -->','    </fieldset><fieldset class="sm-edit-stock"><legend>02 · Existencias y destino</legend>\n    <!-- CANTIDAD ACTUAL -->');
  s=s.replace('    <!-- BOTON ACTUALIZAR -->','    </fieldset></div><footer class="sm-edit-footer"><p>Revisa los datos. La confirmación aparece antes de guardar.</p>\n    <!-- BOTON ACTUALIZAR -->');
  s=s.replace('</form>','</footer></form>');
  s=s.replace('<!-- VENTANA DE CONFIRMACION -->','</section>\n<!-- VENTANA DE CONFIRMACION -->');
  for(const [label,id] of [['Producto','producto'],['Número de lote','numeroLote'],['Fecha de vencimiento','fechaVencimiento'],['Cantidad actual','cantidadActual'],['Ubicación','ubicacion']])s=s.replace('<label>'+label+'</label>','<label for="'+id+'">'+label+'</label>');
 }
 if(n==='CrearLote'||n==='EditarLote'){
  s=s.replace('class="modal-fondo"','class="modal-fondo sm-confirmation" role="dialog" aria-modal="true" aria-labelledby="smConfirmTitle"');
  const pos=s.indexOf('class="modal-contenido"');
  s=s.slice(0,pos)+s.slice(pos).replace('<h2>','<h2 id="smConfirmTitle">');
  s=s.replace('<div class="modal-botones">','<div class="sm-confirm-actions"><span class="sm-form-eyebrow">CONFIRMACIÓN</span><div class="modal-botones">');
  s=s.replace('\n<style>','\n</div>\n<style>');
  s+='\n<script src="~/js/sarmedix-form-focus.js" asp-append-version="true"></script>\n';
 }
 if(n==='Dosificaciones'){
  s=s.replace('<fieldset class="sm-dose-origin"><legend>Destino y medicamento</legend>','<fieldset class="sm-dose-origin"><legend>01 · Destino y medicamento</legend>');
  s=s.replace('<fieldset class="sm-dose-amount"><legend>Contenido del paquete</legend>','<fieldset class="sm-dose-amount"><legend>02 · Contenido del paquete</legend>');
  s=s.replace('id="resumenDosif"','id="resumenDosif" aria-live="polite" aria-atomic="true"');
  s=s.replace('<div class="sm-library-heading">','<div class="sm-library-heading"><span class="sm-form-eyebrow">BIBLIOTECA · @programaciones.Count PROGRAMACIONES</span>');
  s=s.replace('                            <input type="number"\n                                   name="copias"','                            <label class="sm-copy-label">Copias\n                            <input type="number"\n                                   name="copias"');
  s=s.replace('title="Cantidad de copias" />','title="Cantidad de copias" /></label>');
 }
 if(n==='Historial'){
  s=s.replace('<div class="filtro-busqueda">','<label for="smHistorySearch">Responsable o descripción</label><div class="filtro-busqueda">');
  s=s.replace('name="buscar"\n                       value=', 'name="buscar"\n                       id="smHistorySearch"\n                       value=');
  s=s.replace('placeholder="Buscar por responsable o descripción..."','placeholder="Buscar en la bitácora…"');
  s=s.replace('class="sm-history-event"','class="sm-history-event @claseCategoria" data-important="@(esAccionImportante ? "true" : "false")"');
 }
 fs.writeFileSync(base+n+'.cshtml',s.replace(/\n/g,'\r\n'));
}
