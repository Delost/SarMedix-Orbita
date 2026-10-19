import fs from 'node:fs';
import crypto from 'node:crypto';
export function walk(p){return fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>['bin','obj'].includes(e.name)?[]:e.isDirectory()?walk(p+'/'+e.name):[p+'/'+e.name]);}
export const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const paths=walk('LoginSARMedix/Views').filter(p=>p.endsWith('.cshtml'));
const views=Object.fromEntries(paths.map(p=>[p,fs.readFileSync(p,'utf8')]));
if(process.argv.includes('--capture')){
 if(fs.existsSync('design/global/baseline.json'))throw Error('Baseline exists');
 fs.writeFileSync('design/global/baseline.json',JSON.stringify({views,protected:Object.fromEntries(walk('LoginSARMedix').filter(p=>!p.includes('/Views/')).map(p=>[p,hash(fs.readFileSync(p))]))},null,2));
}
const inventory=paths.map(p=>{const s=views[p],html=s.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/g,'');return {path:p,family:s.match(/SmFamily"\] = "([^"]+)/)?.[1],forms:[...html.matchAll(/<form\b[^>]*>/g)].map(m=>m[0].replace(/\s+/g,' ')),modals:[...html.matchAll(/<div\b[^>]*class="[^"]*(?:modal-fondo|modal-contenido|overlay|ubicacion-modal|mc-modal|mcc-modal)[^"]*"[^>]*>/g)].map(m=>m[0].replace(/\s+/g,' ')),buttons:[...html.matchAll(/<(?:button|a|input)\b[^>]*>/g)].filter(m=>m[0].startsWith('<button')||/btn|boton|type="submit"/.test(m[0])).map(m=>m[0].replace(/\s+/g,' ')),headings:[...html.matchAll(/<h[123]\b[^>]*>([\s\S]*?)<\/h[123]>/g)].map(m=>m[1].trim().replace(/\s+/g,' ')),selectors:[...s.matchAll(/(?:querySelector(?:All)?|closest|getElementById)\(\s*(["'`])([^"'`]+)\1/g)].map(m=>m[2]),dynamic:[...s.matchAll(/(?:innerHTML|insertAdjacentHTML)/g)].length};});
fs.writeFileSync('design/global/inventory.json',JSON.stringify(inventory,null,2));
for(const v of inventory)console.log(v.path.replace('LoginSARMedix/Views/','')+' | forms '+v.forms.length+' | modal nodes '+v.modals.length+' | actions '+v.buttons.length+' | dynamic '+v.dynamic+' | '+v.headings.join(' / '));
