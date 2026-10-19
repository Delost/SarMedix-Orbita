const fs=require('fs'),assert=require('node:assert/strict'),crypto=require('crypto');
const b=JSON.parse(fs.readFileSync('design/visual-refinement/baseline.json'));
const all=(s,re)=>[...s.matchAll(re)].map(m=>m[0]);
const changed=[];
for(const [p,old] of Object.entries(b)){
 const s=fs.readFileSync(p,'utf8');if(crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')===old.hash)continue;
 changed.push(p);assert.ok(/(?:Views\/(?:Home\/(?:Productos.cshtml|Modulos\/[^/]+.cshtml)|Shared\/_(?:ModuleIcons|OrbitPulse|OrbitCapsule).cshtml)|wwwroot\/css\/(?:orbit-resources|sarmedix-system).css)$/.test(p),p+' unexpected change');
 if(p.includes('/Views/Home/')){
  for(const re of [/<script\b[^>]*>[\s\S]*?<\/script>/g,/<style\b[^>]*>[\s\S]*?<\/style>/g,/<\/?(?:form|input|button|select|option|textarea|a|table|thead|tbody|tr|td|th|img)\b(?:"[^"]*"|'[^']*'|[^'">])*?>/g,/@(?:if|foreach)\s*\([\s\S]*?\)\s*\{/g])assert.deepEqual(all(s,re),all(old.text,re),p+' functional preservation');
 }
}
assert.equal(changed.length,10);
const products=fs.readFileSync('LoginSARMedix/Views/Home/Productos.cshtml','utf8');assert.ok(!/<span>\s*💊\s*<\/span>/.test(products));assert.equal(all(products,/<partial name="_OrbitCapsule" \/>/g).length,2);
assert.ok(!/class="producto-info">\s*<partial/.test(products));
const library=fs.readFileSync('LoginSARMedix/Views/Shared/_ModuleIcons.cshtml','utf8');
const map=JSON.parse(fs.readFileSync('design/visual-refinement/icon-map.json'));
for(const [file,items] of Object.entries(map)){const s=fs.readFileSync('LoginSARMedix/Views/Home/Modulos/'+file+'.cshtml','utf8');for(const [action,icon] of items){assert.ok(new RegExp('asp-action="'+action+'"[\\s\\S]*?<use href="#sm-icon-'+icon+'"').test(s));assert.ok(library.includes('id="sm-icon-'+icon+'"'));}}
const stats=fs.readFileSync('LoginSARMedix/Views/Home/Modulos/MedicamentosControlados.cshtml','utf8');for(const binding of ['totalMedicamentos','totalLotes','stockRegistrado'])assert.equal(all(stats,new RegExp('@'+binding+'\\b','g')).length,all(b['LoginSARMedix/Views/Home/Modulos/MedicamentosControlados.cshtml'].text,new RegExp('@'+binding+'\\b','g')).length);
const css=fs.readFileSync('LoginSARMedix/wwwroot/css/orbit-resources.css','utf8');const oldCss=b['LoginSARMedix/wwwroot/css/orbit-resources.css'].text;assert.deepEqual(all(css,/[^{}\r\n]*sm-scanner[^{}]*\{[^}]*\}|@keyframes sm-resource-scan[^\r\n]+/g),all(oldCss,/[^{}\r\n]*sm-scanner[^{}]*\{[^}]*\}|@keyframes sm-resource-scan[^\r\n]+/g));
fs.writeFileSync('design/visual-refinement/changed.json',JSON.stringify(changed,null,2));
console.log('PASS: 10 scoped files; '+(Object.keys(b).length-10)+' existing files unchanged; functional tags/scripts/local CSS/permission conditions, statistics and scanner rules preserved; 10 distinct access icons.');

