import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {groups} from './migrate.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const legacy=JSON.parse(read('design/phase-one/baseline.json'));
// The integral baseline protects all screens; this additionally checks the
// layout and navigation against the original pilot's functional contracts.
for(const name of ['Shared/_Layout','Shared/_Sidebar']) {
  const p=`LoginSARMedix/Views/${name}.cshtml`, s=read(p), expected=legacy.views[p];
  const actual={
    scripts:[...s.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m=>hash(m[0])),
    attributes:[...s.matchAll(/\b(?:id|name|asp-[\w-]+|on\w+|method|type|data-[\w-]+)="[^"]*"/g)].map(m=>m[0]),
    conditions:[...s.matchAll(/@if\s*\(([\s\S]*?)\)\s*\{/g)].map(m=>m[1].replace(/\s/g,''))
  };
  for(const key of Object.keys(actual)) {
    const remaining=[...actual[key]];
    for(const value of expected[key]) {
      const i=remaining.indexOf(value);
      assert.ok(i>=0,`${p}: missing original ${key} contract`);
      remaining.splice(i,1);
    }
  }
  const start=s.indexOf('@{');
  assert.equal(hash(s.slice(start,s.indexOf('\n}',start)+2)),expected.initialBlock,`${p}: original Razor logic`);
}
let count=0;
for(const [family,names] of Object.entries(groups)) {
  for(const name of names) {
    const p=path.posix.normalize(`LoginSARMedix/Views/Home/${name}.cshtml`),s=read(p);
    assert.equal((s.match(/SM-ORBITA-METADATA/g)||[]).length,1,`${p}: missing/duplicate metadata`);
    assert.ok(s.includes(`ViewData["SmFamily"] = "${family}"`),`${p}: wrong family`);
    if(/Layout\s*=\s*null/.test(s)) assert.ok(s.includes('~/css/sarmedix-system.css'),`${p}: standalone CSS missing`);
    count++;
  }
}
const layout=read('LoginSARMedix/Views/Shared/_Layout.cshtml');
for(const match of layout.matchAll(/(?:src|href)="~\/([^"?]+\.(?:css|js))"/g)) {
  if(match[1]==='LoginSARMedix.styles.css') continue; // MSBuild generated scoped stylesheet.
  assert.ok(fs.existsSync(path.join(root,'LoginSARMedix/wwwroot',match[1])),`Missing dependency ${match[1]}`);
}
const icons=read('LoginSARMedix/Views/Shared/_ModuleIcons.cshtml');
for(const id of ['users','products','movements','controlled','sectors','inventory']) assert.ok(icons.includes(`id="sm-icon-${id}"`),`Missing icon ${id}`);
console.log(`PASS: ${count}/39 real screens integrated once; layout/navigation contracts, local dependencies and six icon symbols verified.`);
