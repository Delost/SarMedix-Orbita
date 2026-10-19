import fs from 'node:fs';
const baseline=JSON.parse(fs.readFileSync('design/global/baseline.json','utf8'));
const actions=[];
const tag=/<([a-z][\w-]*)\b(?:"[^"]*"|'[^']*'|[^'">])*?>/gi;
function endElement(s,start){const first=s.slice(start).match(/^<([\w-]+)/)[1];let depth=0;const re=new RegExp('<(\\/?)'+first+'\\b(?:"[^"]*"|\'[^\']*\'|[^\'">])*?>','g');re.lastIndex=start;for(const m of s.matchAll(re)){depth+=m[1]?-1:1;if(!depth)return m.index+m[0].length;}throw Error('Unbalanced '+first);}
function wrap(s,start,end,open,close){return s.slice(0,start)+open+s.slice(start,end)+close+s.slice(end);}
function groupStart(s,needle){const i=s.indexOf(needle);if(i<0)throw Error('Missing '+needle);return s.lastIndexOf('<div',i);}
function userForm(s){const a=s.indexOf('<div class="grupo-campo">'),b=groupStart(s,s.includes('for="id_rol"')?'for="id_rol"':'<select asp-for="id_rol"'),c=s.indexOf('<button type="submit"',b);return s.slice(0,a)+'<div class="orbit-identity-grid"><fieldset><legend>01 · Identidad personal</legend>'+s.slice(a,b)+'</fieldset><fieldset class="orbit-credentials"><legend>02 · Perfil de acceso</legend>'+s.slice(b,c)+'</fieldset></div><div class="orbit-form-actions">'+s.slice(c).replace('</form>','</div></form>');}
for(const [p,raw] of Object.entries(baseline.views)){
 let s=raw.replace(/\r\n/g,'\n');const name=p.split('/').at(-1).replace('.cshtml','');
 if(['CrearUsuario','EditarUsuario'].includes(name))s=userForm(s);
 if(name==='EditarUsuario')s=s.replace(/<script>\s*alert\('@ViewBag.Mensaje'\);\s*<\/script>/,'<div class="orbit-inline-error" role="alert">@ViewBag.Mensaje</div>');
 if(['CrearProducto','EditarProducto'].includes(name)){
  const a=groupStart(s,'<label>Tipo de producto'),b=s.indexOf('<div class="seccion-inventario">'),c=s.indexOf('<button type="submit"',b);
  s=s.slice(0,a)+'<div class="orbit-product-grid"><fieldset class="orbit-product-identity"><legend>01 · Identificación y presentación</legend>'+s.slice(a,b)+'</fieldset><fieldset class="orbit-product-content"><legend>02 · Contenido e inventario</legend>'+s.slice(b,c)+'</fieldset></div><div class="orbit-form-actions">'+s.slice(c).replace('</form>','</div></form>');
 }
 if(['CrearRol','EditarRol'].includes(name)){
  const form=s.indexOf('<form'),a=s.indexOf('<div class="grupo-rol">',form),b=s.indexOf('<button',a);
  if(a>=0&&b>=0)s=wrap(s,a,b,'<fieldset class="orbit-role-fields"><legend>Definición del rol</legend>','</fieldset>');
 }
 if(['Index','RecuperarContrasena','VerificarCodigo'].includes(name)){
  const a=s.indexOf('<h2>'),b=s.indexOf('</form>',a)+7;
  s=wrap(s,a,b,'<section class="orbit-access"><aside class="orbit-access-brand"><span class="orbit-eyebrow">SARMedix / ÓRBITA 2.0</span><div class="orbit-access-art" aria-hidden="true"><partial name="_OrbitInstrument" /></div><h1>Todo conectado.<br />Mejor cuidado.</h1><p>Tu espacio de trabajo farmacéutico.</p></aside><div class="orbit-access-fields">','</div></section>');
 }
 if(name==='NuevaContrasena')s=s.replace('<div class="tarjeta-recuperacion">','<aside class="orbit-access-brand"><span class="orbit-eyebrow">ÓRBITA / ACCESO</span><h1>Un nuevo acceso.<br />El mismo cuidado.</h1><div class="orbit-access-art" aria-hidden="true"><partial name="_OrbitInstrument" /></div></aside><div class="tarjeta-recuperacion">');
 if(['CrearUsuario','EditarUsuario','CrearProducto','EditarProducto'].includes(name)){
  s=s.replace(/<h2>([^<]+)<\/h2>/,'<header class="orbit-editor-heading"><span class="orbit-eyebrow">ÓRBITA / '+(name.includes('Usuario')?'PERSONAS':'CATÁLOGO')+'</span><h1>$1</h1></header>');
 }
 if(name==='EntregaDosificacion'){
  s=s.replace('<div class="scan-panel">','<div class="scan-panel"><div class="orbit-scan-station"><span class="orbit-eyebrow">PUNTO DE ENTREGA</span>');
  s=s.replace('        <div id="resultadoScan"','        </div><section class="orbit-scan-feedback" aria-label="Resultado de la lectura"><span class="orbit-eyebrow">RESULTADO DE LA OPERACIÓN</span><div id="resultadoScan"');
  s=s.replace('<div class="scan-acciones">','</section><div class="scan-acciones">');
 }
 if(['BajaInventario','SalidaExtraordinaria','TrasladarStock'].includes(name)){
  const grid=s.indexOf(name==='TrasladarStock'?'<div class="traslado-grid">':'<div class="grid">');
  const a=s.indexOf('<div',grid+10),b=endElement(s,a);
  s=wrap(s,a,b,'<section class="orbit-movement-input"><span class="orbit-eyebrow">'+(name==='BajaInventario'?'BAJA / TRAZABILIDAD':name==='TrasladarStock'?'TRASLADO / RECORRIDO':'SALIDA / DESTINO')+'</span>','</section>');
 }
 if(['HistorialProductos','HistorialUsuarios'].includes(name)){
  const a=s.indexOf('<div class="historial-herramientas">');
  if(a>=0){const b=endElement(s,a);s=wrap(s,a,b,'<aside class="orbit-query-console"><span class="orbit-eyebrow">EXPLORAR LA BITÁCORA</span>','</aside>');}
 }
 if(name==='HistorialSectores')s=s.replace('<form asp-controller','<div class="orbit-sector-query"><span class="orbit-eyebrow">TRAZABILIDAD / SECTOR</span><form asp-controller').replace('</form>','</form></div>');
 if(name==='RolesPermisos')s=s.replace('<div class="tarjeta">','<div class="tarjeta orbit-permission-workbench"><div class="orbit-permission-intro"><span class="orbit-eyebrow">CONTROL DE ACCESO</span><h2>Un rol, sus capacidades.</h2><p>Selecciona un perfil para consultar sus permisos.</p></div>');
 if(name==='Ubicaciones')s=s.replaceAll('<div class="ubicacion-modal-cuerpo">','<div class="ubicacion-modal-cuerpo"><div class="orbit-sector-intro"><span class="orbit-eyebrow">MAPA OPERATIVO</span><p>Identidad y función del sector</p></div>');
 if(name==='MedicamentosControlados')s=s.replace('<!-- FORMULARIO -->','<div class="orbit-controlled-form"><span class="orbit-eyebrow">REGISTRO DEL MOVIMIENTO</span><!-- FORMULARIO -->').replace('</form>','</form></div>');
 if(name==='HistorialSalidasTurno'){
  const a=s.indexOf('<div class="filtro-grid">'),b=endElement(s,a);
  s=wrap(s,a,b,'<fieldset class="orbit-turno-fields"><legend>Ventana de consulta</legend>','</fieldset>');
 }
 if(name==='Error'){
  const a=s.indexOf('<h1');s=wrap(s,a,s.length,'<section class="orbit-error-panel"><span class="orbit-eyebrow">ÓRBITA / ESTADO DEL SISTEMA</span>','</section>');
 }
 // Explicit associations where the original label immediately precedes a bound control.
 s=s.replace(/<label>([\s\S]*?)<\/label>(\s*<(?:input|select)\b[^>]*>)/g,(full,label,control)=>{
  if(label.includes('<'))return full;
  const id=control.match(/\bid="([^"]+)"/)?.[1]||control.match(/asp-for="([\w]+)"/)?.[1];
  return id?'<label for="'+id+'">'+label+'</label>'+control:full;
 });
 // Presentation annotations only. Opaque scripts/styles are left byte-identical.
 const chunks=s.split(/(<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)>)/g);
 s=chunks.map(chunk=>/^<(script|style)\b/.test(chunk)?chunk:chunk.replace(tag,(opening,tagName,offset)=>{
  let o=opening;const t=tagName.toLowerCase();
  if(['button','a'].includes(t)||t==='input'&&/type="(?:submit|button|reset)"/.test(o)){
   const close=chunk.indexOf('</'+t+'>',offset+opening.length);
   const following=chunk.slice(offset+opening.length,close<0?offset+opening.length:close).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
   const context=(o+' '+following.split('</')[0]).toLowerCase();
   let kind=t==='a'?'secondary':/type="submit"/.test(o)?'primary':'secondary';
   if(/buscar|filtrar|aplicar|limpiar|preset|pagina-boton|paginacion/.test(context))kind='quiet';
   if(/guardar|registrar|crear|nuevo|agregar|procesar|imprimir|reactivar|btn-modal-si|mcc-btn-si|confirmar/.test(context))kind='primary';
   if(/desactivar|inactivar|cerrar.sesion|salida|trasladar/.test(context))kind='warning';
   if(/eliminar|dar de baja|baja de|baja inventario/.test(context))kind='danger';
   if(/cancelar|volver|btn-modal-no|mcc-btn-no/.test(o.toLowerCase()))kind='secondary';
   if(/btn-modal-si|mcc-btn-si|btnConfirmarAccionUbicacion/.test(o)&&['Usuarios','ListadoEliminarUsuarios','Ubicaciones','MedicamentosControlados'].includes(name))kind='warning';
   if(/sidebar|modulo|submenu-card|ubicacion-card-agregar/.test(o))kind='navigation';
   if(/alertas-boton|modal-cerrar|mc-cerrar|btn-cerrar-menu|ubicacion-menu-boton/.test(o))kind='icon';
   if(t==='a'&&!['navigation','quiet'].includes(kind))kind=/asp-action="(?:Crear|Nuevo)/.test(o)?'primary':'secondary';
   if(/btn-editar|btn-reimprimir|btn-inactivos/.test(o))kind='secondary';
   if(/id="btnBaja"/.test(o))kind='danger';
   if(/controlados-btn-entrada/.test(o))kind='primary';
   if(/btn-cerrar-layout/.test(o))kind='warning';
   if(name==='_Layout'&&/btn-sesion-si/.test(o))kind='warning';
   if(/class="ubicacion-menu"/.test(o))kind='icon';
   if(/producto-card|producto-tarjeta|alertas-item|logo-layout|sm-skip/.test(o))kind='navigation';
   o=o.replace(/\s*\/? >$/,'>'); // no functional attribute changes
   o=o.replace(/(\s*\/?>)$/,' data-orbit-action="'+kind+'"$1');
   if(/modal-cerrar|mc-cerrar/.test(o)&&!o.includes('aria-label='))o=o.replace(/>$/,' aria-label="Cerrar">');
   actions.push({view:p,kind,control:opening.replace(/\s+/g,' ')});
  }
  if(t==='form')o=o.replace(/>$/,' data-orbit-form="'+name+'">');
  if(t==='table'&&!['ImprimirDosificacion','InformeSalidasTurno'].includes(name)){
   o=o.replace(/>$/,' data-orbit-table="'+name+'">');
   const captions={Usuarios:'Directorio · Identidad, rol y estado',ListadoEliminarUsuarios:'Usuarios inactivos · Gestión de acceso',InventarioUbicacion:'Existencias · Lote, cantidad y vigencia',RolesInactivos:'Roles inactivos · Perfiles de acceso'};
   if(captions[name])o+='<caption class="orbit-table-caption">'+captions[name]+'</caption>';
  }
  if(t==='div'&&/class="(?:modal-contenido|modal-contenido-sesion|ubicacion-modal|mc-modal|mcc-modal)"/.test(o))o=o.replace(/>$/,' data-orbit-dialog="surface">');
  return o;
 })).join('');
 // New stylesheet is last in the cascade on shared and standalone pages.
 if(name==='_Layout')s=s.replace('</body>','<link rel="stylesheet" href="~/css/sarmedix-global.css" asp-append-version="true" />\n</body>');
 else if(/Layout\s*=\s*null/.test(s))s=s.replace('</body>','<link rel="stylesheet" href="~/css/sarmedix-global.css" asp-append-version="true" />\n</body>');
 if(s!==raw.replace(/\r\n/g,'\n'))fs.writeFileSync(p,s.replace(/\n/g,'\r\n'));
}
fs.writeFileSync('design/global/actions.json',JSON.stringify(actions,null,2));
console.log('Annotated '+actions.length+' controls across '+Object.keys(baseline.views).length+' Razor files.');
