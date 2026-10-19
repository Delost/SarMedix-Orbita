import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const baseline=JSON.parse(fs.readFileSync('design/refinement/baseline.json','utf8'));
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const norm=s=>s.replace(/\r\n/g,'\n');
const matches=(s,re)=>[...s.matchAll(re)].map(m=>m[0].replace(/\s+/g,' ')).sort();
const subset=(before,after,label)=>{const remaining=[...after];for(const item of before){const i=remaining.indexOf(item);assert.ok(i>=0,label+': '+item);remaining.splice(i,1);}};
for(const [p,old] of Object.entries(baseline.views)){
 const s=fs.readFileSync(p,'utf8');
 const inline=/<script\s*>[\s\S]*?<\/script>/g;
 assert.deepEqual([...norm(s).matchAll(inline)].map(m=>hash(m[0])),[...norm(old).matchAll(inline)].map(m=>hash(m[0])),p+' original inline JS');
 for(const re of [/\b(?:id|name|asp-[\w-]+|on\w+|method|type|value|min|max|step)="[^"]*"/g,/@Html\.AntiForgeryToken\(\)/g,/@(?:if|foreach)\s*\([\s\S]*?\)\s*\{/g])subset(matches(old,re),matches(s,re),p+' contracts');
 // Only accessible naming changes are permitted on controls. Required,
 // disabled, defaults, methods, routes and event bindings remain exact.
 const controls=t=>matches(t,/<(?:input|select|option|button|form)\b(?:"[^"]*"|[^">])*?>/g).map(x=>x.replace(/ (?:aria-[\w-]+|id="smHistorySearch"|placeholder)(?:="[^"]*")?/g,''));
 assert.deepEqual(controls(s),controls(old),p+' controls');
 const html=s.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/g,'').replace(/<!--[\s\S]*?-->/g,'');
 const stack=[];
 for(const m of html.matchAll(/<(\/?)(div|section|aside|header|footer|article|ul|li|dl|dt|dd|form|fieldset|legend|span|h1|h2|h3|p|strong|em|a|svg|select|option|button|label)\b(?:"[^"]*"|'[^']*'|[^'">])*?>/g)){
  if(m[0].endsWith('/>'))continue;
  if(m[1])assert.equal(stack.pop(),m[2],p+' nesting at '+m.index);
  else {if(m[2]==='form')assert.ok(!stack.includes('form'));stack.push(m[2]);}
 }
 assert.deepEqual(stack,[],p+' closed HTML');
 console.log('PASS '+p+': original scripts, controls, routes, tokens, conditions and nesting');
}
for(const [p,h] of Object.entries(baseline.protected))assert.equal(hash(fs.readFileSync(p)),h,p+' protected');
console.log('PASS '+Object.keys(baseline.protected).length+' existing files outside scope unchanged.');
