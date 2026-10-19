import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
let observe, keydown, display='none';
const doc={activeElement:null,getElementById:()=>modal};
const control=()=>({isConnected:true,disabled:false,getClientRects:()=>[{}],focus(){doc.activeElement=this;}});
const yes=control(), back=control(), reset=control(), opener=control(), scanner=control();
const modal={querySelector:()=>back,querySelectorAll:()=>[yes,back,reset],contains:el=>[yes,back,reset].includes(el),addEventListener:(name,fn)=>{keydown=fn;}};
back.click=()=>{display='none';observe();};
vm.runInNewContext(fs.readFileSync('LoginSARMedix/wwwroot/js/sarmedix-form-focus.js','utf8'),{
 document:doc,getComputedStyle:()=>({display}),MutationObserver:class{constructor(fn){observe=fn;}observe(){}}
});
const open=()=>{doc.activeElement=opener;display='flex';observe();assert.equal(doc.activeElement,back);};
const key=(key,shiftKey=false)=>{let prevented=false;keydown({key,shiftKey,preventDefault(){prevented=true;}});return prevented;};
open(); reset.focus(); assert.equal(key('Tab'),true); assert.equal(doc.activeElement,yes);
assert.equal(key('Tab',true),true); assert.equal(doc.activeElement,reset);
assert.equal(key('Escape'),true); assert.equal(display,'none'); assert.equal(doc.activeElement,opener);
open(); scanner.focus(); display='none'; observe(); assert.equal(doc.activeElement,scanner);
open(); assert.equal(key('Enter'),false); assert.equal(display,'flex');
console.log('PASS: opening focus, Tab/Shift+Tab containment, Escape uses original return action, focus restoration and preservation of scanner/reset focus. Simulated DOM; browser tests remain pending.');
