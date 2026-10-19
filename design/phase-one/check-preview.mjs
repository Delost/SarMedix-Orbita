import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const dir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),process.argv.includes('--v2')?'../phase-two':'.');
let scripts=0;
for(const file of ['index.html','inventory.html','empty.html']) {
  const html=fs.readFileSync(path.join(dir,file),'utf8');
  if(/@(using|model|if|foreach|RenderBody|await|lote|Model|ViewData)/.test(html))throw new Error(`Unresolved Razor: ${file}`);
  if(/<(?:script|link)\b[^>]*(?:src|href)="\//.test(html))throw new Error(`Non-portable resource: ${file}`);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(new Set(ids).size!==ids.length)throw new Error(`Duplicate IDs: ${file}`);
  for(const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
    new vm.Script(match[1],{filename:file}); scripts++;
  }
  if(!html.includes('Datos ficticios'))throw new Error(`Missing demonstration label: ${file}`);
  if(file==='inventory.html' && !html.includes('LT-2026-041'))throw new Error('Missing inventory fixture');
  if(file==='empty.html' && html.includes('LT-2026-041'))throw new Error('Empty fixture contains rows');
  console.log(`PASS ${file}: standalone assets, unique IDs, valid script syntax, correct fixture state.`);
}
console.log(`${scripts} inline scripts parsed without execution. No browser or database used.`);
