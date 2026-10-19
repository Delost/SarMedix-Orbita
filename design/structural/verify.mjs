import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const baseline=JSON.parse(read('design/structural/baseline.json'));
const norm=s=>s.replace(/\s+/g,'');
const matches=(s,re)=>[...s.matchAll(re)].map(m=>norm(m[0])).sort();
function subset(old,current,label){const remaining=[...current];for(const item of old){const i=remaining.indexOf(item);assert.ok(i>=0,`${label}: missing ${item}`);remaining.splice(i,1);}}
for(const [p,old] of Object.entries(baseline.views)) {
    const s=read(p);
    assert.deepEqual(matches(s,/<script\b[^>]*>[\s\S]*?<\/script>/g),matches(old,/<script\b[^>]*>[\s\S]*?<\/script>/g),p+' scripts');
    // Preserve exact original scripts too, including whitespace and literals.
    assert.deepEqual([...s.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m=>hash(m[0])),[...old.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m=>hash(m[0])),p+' script hashes');
    for(const re of [/\b(?:id|name|asp-[\w-]+|on\w+|method|type|data-[\w-]+)="[^"]*"/g, /@(?:if|foreach|for)\s*\([\s\S]*?\)\s*\{/g, /@Html\.AntiForgeryToken\(\)/g]) subset(matches(old,re),matches(s,re),p);
    // Full control opening tags preserve required/disabled/min/max/options and
    // all form boundaries, rather than checking just selected attributes.
    for(const re of [/<(?:input|select|option|button|form)\b[^>]*>/g, /<\/form>/g]) assert.deepEqual(matches(s,re),matches(old,re),p+' form controls');
    subset(matches(old,/@(?:lote|item|registro)\.[\w?.]+/g),matches(s,/@(?:lote|item|registro)\.[\w?.]+/g),p+' data bindings');
    const headerEnd=old.search(/<(?:div|style)\b/);
    assert.equal(s.slice(0,headerEnd),old.slice(0,headerEnd),p+' original Razor setup');
    // Check static HTML nesting after removing opaque scripts/styles/comments.
    // This is a source check, not a replacement for rendered DOM validation.
    const html=s.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/g,'').replace(/<!--[\s\S]*?-->/g,'');
    const stack=[];
    for(const m of html.matchAll(/<(\/?)(div|section|aside|header|article|ul|li|dl|dt|dd|form|fieldset|legend|span|h1|h2|h3|p|strong|em|a|svg|select|option|button)\b(?:"[^"]*"|'[^']*'|[^'">])*?>/g)) {
        if(m[0].endsWith('/>'))continue;
        if(m[1])assert.equal(stack.pop(),m[2],p+' HTML nesting near '+m.index);
        else { if(m[2]==='form')assert.ok(!stack.includes('form'),p+' nested form'); stack.push(m[2]); }
    }
    assert.deepEqual(stack,[],p+' unclosed HTML');
    console.log('PASS '+p+': scripts, forms, routes, permissions, data bindings and static nesting.');
}
const oldHistory=baseline.views['LoginSARMedix/Views/Home/Historial.cshtml'];
const newHistory=read('LoginSARMedix/Views/Home/Historial.cshtml');
const parsing=(s,end)=>s.slice(s.indexOf('@foreach (var registro in Model)'),s.indexOf(end,s.indexOf('@foreach (var registro in Model)')));
assert.equal(norm(parsing(newHistory,'<article')),norm(parsing(oldHistory,'<tr>')),'History parsing logic');
for(const [p,h] of Object.entries(baseline.protected))assert.equal(hash(read(p)),h,'Protected file '+p);
assert.ok(fs.existsSync(path.join(root,'LoginSARMedix/wwwroot/css/sarmedix-structural.css')));
assert.ok(fs.existsSync(path.join(root,'LoginSARMedix/Views/Shared/_OrbitInstrument.cshtml')));
console.log(`PASS: ${Object.keys(baseline.protected).length} existing protected files unchanged, including other views, shared layout, backend, dependencies, scanner and print screens.`);
