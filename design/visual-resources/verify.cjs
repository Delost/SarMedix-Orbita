const fs=require('fs'),assert=require('node:assert/strict'),crypto=require('crypto');
const baseline=JSON.parse(fs.readFileSync('design/visual-resources/baseline.json'));
const scanners=['CrearLote','EditarLote','CrearProducto','EditarProducto','Dosificaciones','EntregaDosificacion'];
const changed=[];
const norm=s=>s.replace(/\r\n/g,'\n');
const matches=(s,re)=>[...s.matchAll(re)].map(x=>x[0]);
for(const [p,b] of Object.entries(baseline)){
 const raw=fs.readFileSync(p),hash=crypto.createHash('sha256').update(raw).digest('hex');
 if(hash===b.hash)continue;
 changed.push(p);assert.ok(b.text,p+' unexpected non-view modification');
 const before=norm(b.text),after=norm(raw.toString());
 assert.deepEqual(matches(after,/<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)>/g),matches(before,/<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)>/g),p+' scripts/styles');
 assert.deepEqual(matches(after,/<\/?(?:form|input|select|option|textarea|button|a|table|thead|tbody|tr|td|th)\b(?:"[^"]*"|'[^']*'|[^'">])*?>/g),matches(before,/<\/?(?:form|input|select|option|textarea|button|a|table|thead|tbody|tr|td|th)\b(?:"[^"]*"|'[^']*'|[^'">])*?>/g),p+' controls and table structure');
 if(!p.endsWith('/_Layout.cshtml')){
   const stripped=after.replace(/\s*<partial name="_Orbit(?:Scanner|Capsule)"\s*\/>/g,'');
   assert.equal(stripped.replace(/\s+/g,' '),before.replace(/\s+/g,' '),p+' only partial insertion');
 }
}
assert.equal(changed.length,8);
for(const s of scanners)assert.equal(matches(fs.readFileSync('LoginSARMedix/Views/Home/'+s+'.cshtml','utf8'),/<partial name="_OrbitScanner" \/>/g).length,1,s+' scanner');
const products=fs.readFileSync('LoginSARMedix/Views/Home/Productos.cshtml','utf8');
assert.equal(matches(products,/<partial name="_OrbitCapsule" \/>/g).length,2);
assert.ok(products.lastIndexOf('_OrbitCapsule')<products.indexOf('x => x.tipo == "Insumo"'),'Capsules only in medicine branches');
for(const name of ['Scanner','Capsule','Pulse']){
 const s=fs.readFileSync('LoginSARMedix/Views/Shared/_Orbit'+name+'.cshtml','utf8');
 assert.ok(s.includes('aria-hidden="true"')&&s.includes('focusable="false"'));
 assert.ok(!/<(?:input|button|script|a)\b/.test(s));
}
fs.writeFileSync('design/visual-resources/changed.json',JSON.stringify(changed,null,2));
console.log('PASS: '+changed.length+' additive view/layout edits; '+(Object.keys(baseline).length-changed.length)+' previous files byte-identical; controls, tables, scripts and local CSS preserved; six scanner placements; both medication permission branches.');
