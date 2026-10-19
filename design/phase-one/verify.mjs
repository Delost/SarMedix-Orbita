import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const base = path.join(root, 'design/phase-one/baseline.json');
const views = ['Shared/_Layout', 'Shared/_Sidebar', 'Home/Bienvenida', 'Home/Lotes'].map(p => `LoginSARMedix/Views/${p}.cshtml`);
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
function files(dir) {
  return fs.readdirSync(path.join(root, dir), {withFileTypes:true}).flatMap(e => e.isDirectory() ? files(`${dir}/${e.name}`) : [`${dir}/${e.name}`]);
}
const protectedFiles = [
  ...files('LoginSARMedix/Controllers'), ...files('LoginSARMedix/Repository'),
  ...files('LoginSARMedix/Models'), ...files('LoginSARMedix/EmailService'),
  ...files('LoginSARMedix/ViewComponents'),
  ...files('LoginSARMedix/Views').filter(p => !views.includes(p)),
  ...files('LoginSARMedix/wwwroot/js'),
  ...fs.readdirSync(path.join(root, 'LoginSARMedix')).filter(p => p.startsWith('appsettings') || p === 'Program.cs' || p.endsWith('.csproj')).map(p => `LoginSARMedix/${p}`)
].filter(p => !p.endsWith('/sarmedix-ui.js'));
function contract(p) {
  const s = fs.readFileSync(path.join(root,p),'utf8');
  return {
    scripts: [...s.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m=>hash(m[0])),
    attributes: [...s.matchAll(/\b(?:id|name|asp-[\w-]+|on\w+|method|type|data-[\w-]+)="[^"]*"/g)].map(m=>m[0]),
    conditions: [...s.matchAll(/@if\s*\(([\s\S]*?)\)\s*\{/g)].map(m=>m[1].replace(/\s/g,'')),
    initialBlock: hash(s.slice(s.indexOf('@{'), s.indexOf('\n}',s.indexOf('@{'))+2))
  };
}
if (process.argv.includes('--capture')) {
  if (fs.existsSync(base)) throw new Error('Baseline already exists');
  fs.writeFileSync(base,JSON.stringify({ protectedFiles: Object.fromEntries(protectedFiles.map(p=>[p,hash(fs.readFileSync(path.join(root,p)))])), views:Object.fromEntries(views.map(p=>[p,contract(p)])) },null,2));
  console.log('Captured initial hashes and Razor/JavaScript contracts. No configuration values stored.');
} else {
  const baseline=JSON.parse(fs.readFileSync(base,'utf8'));
  const errors=[];
  for(const [p,h] of Object.entries(baseline.protectedFiles)) if(hash(fs.readFileSync(path.join(root,p)))!==h) errors.push(`Protected file changed: ${p}`);
  for(const [p,expected] of Object.entries(baseline.views)) {
    const actual=contract(p);
    for(const key of ['scripts','attributes','conditions']) {
      const remaining=[...actual[key]];
      for(const entry of expected[key]) { const i=remaining.indexOf(entry); if(i<0) errors.push(`${p}: missing ${key} contract ${entry}`); else remaining.splice(i,1); }
    }
    if(expected.initialBlock!==actual.initialBlock) errors.push(`${p}: initial Razor logic changed`);
  }
  if(errors.length) { console.error(errors.join('\n')); process.exitCode=1; }
  else console.log(`PASS: ${Object.keys(baseline.protectedFiles).length} protected files unchanged; all original scripts, functional attributes, conditions and initial Razor blocks preserved in 4 views.`);
}
