import fs from 'node:fs';
const b=JSON.parse(fs.readFileSync('design/global/baseline.json'));
for(const p of Object.keys(b.views)){
 const s=fs.readFileSync(p,'utf8').replace(/<(script|style)[\s\S]*?<\/\1>/g,'');
 const lines=[...s.matchAll(/<(button|a)\b([^>]*data-orbit-action="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g)].map(m=>m[3]+': '+m[4].replace(/<[^>]*>/g,'').trim().replace(/\s+/g,' ').slice(0,85));
 if(lines.length)console.log(p.split('/').slice(-2).join('/')+'\n'+lines.join('\n'));
}
