const fs = require('fs');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const vm = require('vm');
const baseline = JSON.parse(fs.readFileSync('design/mini/baseline.json'));
for (const [file, hash] of Object.entries(baseline)) {
  if (file.endsWith('/Shared/_Layout.cshtml')) continue;
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), hash, file);
}
const source = fs.readFileSync('LoginSARMedix/Views/Shared/_OrbitMini.cshtml','utf8');
const mappings = [...source.matchAll(/^\s*((?:"[^"]+"(?: or )?)+) => \("([^"]+)", "([^"]+)", "([^"]+)"\),/gm)]
  .flatMap(m=>[...m[1].matchAll(/"([^"]+)"/g)].map(n=>({screen:n[1],variant:m[2],target:m[3],placement:m[4]})));
assert.equal(mappings.length, 31);
assert.equal(new Set(mappings.map(m=>m.screen)).size,mappings.length);
const views = fs.readdirSync('LoginSARMedix/Views/Home',{recursive:true}).filter(p=>p.endsWith('.cshtml')).map(p=>({path:p,raw:fs.readFileSync('LoginSARMedix/Views/Home/'+p,'utf8')}));
for (const m of mappings) {
  const v=views.find(v=>new RegExp('SmScreen"\\]\\s*=\\s*"'+m.screen+'"').test(v.raw));
  assert.ok(v, m.screen);
  assert.ok(new RegExp('class="[^"\\n]*\\b'+m.target.split('.').at(-1)+'\\b').test(v.raw),m.screen+' target');
}
// Exercise actual mounting code with a small DOM double: no application handlers.
const script = fs.readFileSync('LoginSARMedix/wwwroot/js/orbit-mini.js','utf8');
for (const placement of ['heading','below','slot']) {
  let width=900, wide=true, callback, mediaCallback;
  const classes=new Set(); const mini={getBoundingClientRect:()=>({left:750,right:900,top:0,bottom:120})};
  const host={querySelectorAll:()=>[],style:{setProperty(){}},append(n){assert.equal(n,mini);},getBoundingClientRect:()=>({width}),classList:{remove(n){classes.delete(n);},toggle(n,on){on?classes.add(n):classes.delete(n);}}};
  const template={dataset:{miniTarget:'.heading',miniPlacement:placement},content:{firstElementChild:{cloneNode:()=>mini}}};
  function ResizeObserver(fn){callback=fn;this.observe=n=>assert.equal(n,host);}
  const media={get matches(){return wide;},addEventListener(_,fn){mediaCallback=fn;}};
  vm.runInNewContext(script,{document:{getElementById:()=>template,querySelector:()=>host},window:{ResizeObserver,matchMedia:()=>media},ResizeObserver,getComputedStyle:()=>({paddingRight:'20px'})});
  assert.equal(mini.hidden,false);
  wide=false;mediaCallback();assert.equal(mini.hidden,true);assert.equal(classes.size,0);
  wide=true;width=500;callback();assert.equal(mini.hidden,placement==='heading');
  width=900;callback();assert.equal(mini.hidden,false);
}
fs.writeFileSync('design/mini/mapping.json',JSON.stringify(mappings,null,2));
console.log('PASS: '+Object.keys(baseline).length+' existing files preserved (only layout integration excepted); 31 explicit mappings; mount/resize/mobile checks.');

