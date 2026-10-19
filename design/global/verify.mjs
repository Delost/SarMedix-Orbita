import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const baseline=JSON.parse(fs.readFileSync('design/global/baseline.json','utf8'));
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const norm=s=>s.replace(/\r\n/g,'\n');
const clean=s=>s.replace(/\sdata-orbit-[\w-]+="[^"]*"/g,'').replace(/ aria-label="Cerrar"/g,'');
const all=(s,re)=>[...s.matchAll(re)].map(m=>m[0]);
const subset=(a,b,label)=>{const remaining=[...b];for(const item of a){const i=remaining.indexOf(item);assert.ok(i>=0,label+' '+item);remaining.splice(i,1);}};
const tags=/<(?:input|select|option|textarea|button|form|a)\b(?:"[^"]*"|'[^']*'|[^'">])*?>/g;
function nesting(s){const stack=[],errors=[];const html=s.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/g,'').replace(/<!--[\s\S]*?-->/g,'');for(const m of html.matchAll(/<(\/?)(div|section|aside|header|footer|article|ul|li|dl|dt|dd|form|fieldset|legend|span|h1|h2|h3|p|strong|em|a|svg|select|option|button|label|table|tr|td|th|thead|tbody)\b(?:"[^"]*"|'[^']*'|[^'">])*?>/g)){if(m[0].endsWith('/>'))continue;if(m[1]){const last=stack.pop();if(last!==m[2])errors.push(last+' / '+m[2]);}else stack.push(m[2]);}return {errors,stack};}
let controlCount=0;
for(const [p,raw] of Object.entries(baseline.views)){
 const before=norm(raw),after=norm(fs.readFileSync(p,'utf8')),s=clean(after);
 assert.deepEqual(all(s,/<style\b[^>]*>[\s\S]*?<\/style>/g),all(before,/<style\b[^>]*>[\s\S]*?<\/style>/g),p+' local styles including print remain exact');
 const expectedScripts=all(before,/<script\b[^>]*>[\s\S]*?<\/script>/g).filter(x=>!(p.endsWith('/EditarUsuario.cshtml')&&/^<script>\s*alert\('@ViewBag.Mensaje'\);\s*<\/script>$/.test(x)));
 assert.deepEqual(all(s,/<script\b[^>]*>[\s\S]*?<\/script>/g),expectedScripts,p+' functional JS unchanged');
 if(p.endsWith('/EditarUsuario.cshtml'))assert.ok(s.includes('<div class="orbit-inline-error" role="alert">@ViewBag.Mensaje</div>'),'Existing error rendered accessibly');
 assert.deepEqual(all(s,tags),all(before,tags),p+' exact controls/order');
 for(const re of [/\b(?:id|name|asp-[\w-]+|on\w+|method|type|data-[\w-]+)="[^"]*"/g,/@(?:if|foreach|for)\s*\([\s\S]*?\)\s*\{/g,/@Html\.AntiForgeryToken\(\)/g])subset(all(before,re),all(s,re),p+' functional contract');
 // Preserved old class tokens ensure existing CSS/JS visibility hooks survive.
 subset(all(before,/\bclass="[^"]*"/g).flatMap(x=>x.slice(7,-1).split(/\s+/)),all(s,/\bclass="[^"]*"/g).flatMap(x=>x.slice(7,-1).split(/\s+/)),p+' classes');
 const oldN=nesting(before),newN=nesting(s);assert.deepEqual(newN,oldN,p+' no new static HTML nesting errors');
 // The same controls must remain in the same form, even after regrouping.
 const membership=t=>{let form=null;return all(t,/<\/?form\b[^>]*>|<(?:input|select|textarea|button)\b(?:"[^"]*"|[^">])*?>/g).map(x=>{if(x.startsWith('<form'))form=x;else if(x==='</form>')form=null;return [form,x];});};
 assert.deepEqual(membership(s),membership(before),p+' form ownership');
 const html=after.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/g,'');
 const buttons=all(html,/<(?:button|a)\b(?:"[^"]*"|'[^']*'|[^'">])*?>/g);
 assert.ok(buttons.every(t=>t.includes('data-orbit-action=')),p+' unclassified action');controlCount+=buttons.length;
 for(const m of s.matchAll(/(?:src|href)="~\/([^"?]+\.(?:css|js))"/g))if(m[1]!=='LoginSARMedix.styles.css')assert.ok(fs.existsSync('LoginSARMedix/wwwroot/'+m[1]),p+' missing asset '+m[1]);
 for(const m of s.matchAll(/<partial\s+name="([^"]+)"/g))assert.ok(fs.existsSync('LoginSARMedix/Views/Shared/'+m[1]+'.cshtml'),p+' partial '+m[1]);
 console.log('PASS '+p.replace('LoginSARMedix/Views/',''));
}
const consolidated='LoginSARMedix/wwwroot/css/sarmedix-system.css';
for(const [p,h] of Object.entries(baseline.protected))if(p!==consolidated)assert.equal(hash(fs.readFileSync(p)),h,p+' protected');
assert.ok(!fs.readFileSync(consolidated,'utf8').includes('/* Action hierarchy:'),'Old duplicated action block removed');
console.log(`PASS: ${Object.keys(baseline.views).length} Razor files; ${controlCount} annotated actions; ${Object.keys(baseline.protected).length-1} existing protected assets/backend files unchanged; system action CSS consolidated.`);
