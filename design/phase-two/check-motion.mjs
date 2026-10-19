// Behavioral checks for the additive motion script, with no browser or network.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../../LoginSARMedix/wwwroot/js/sarmedix-orbita-v2.js',import.meta.url),'utf8');
function element() {
    const attributes={},properties={},events={};
    return {attributes,properties,events,hidden:true,textContent:'',
        setAttribute(k,v){attributes[k]=v;},
        addEventListener(k,fn){events[k]=fn;},
        style:{setProperty(k,v){properties[k]=v;},removeProperty(k){delete properties[k];}},
        getBoundingClientRect(){return {left:0,top:0,width:400,height:200};}
    };
}
const control=element(),label=element(),original=element(),card=element();
control.querySelector=()=>label;
const classes=new Set();
const body={classList:{contains:k=>classes.has(k),toggle(k){if(classes.has(k))classes.delete(k);else classes.add(k);}}};
const reduced={matches:false,addEventListener(k,fn){this.change=fn;}};
const fine={matches:true,addEventListener(k,fn){this.change=fn;}};
let observer,seq=0;
const frames=new Map();
const context={document:{body,querySelectorAll:s=>s.includes('motion-control')?[control]:[card],querySelector:()=>original},
    matchMedia:s=>s.includes('reduced-motion')?reduced:fine,
    MutationObserver:class {constructor(fn){observer=fn;} observe(){}},
    requestAnimationFrame:fn=>{frames.set(++seq,fn);return seq;},cancelAnimationFrame:id=>frames.delete(id)
};
vm.runInNewContext(source,context);
assert.equal(control.hidden,false);
assert.equal(control.attributes['aria-pressed'],'false');
card.events.pointermove({clientX:400,clientY:0});
for(const fn of frames.values())fn();frames.clear();
assert.equal(card.properties['--sm-tilt-x'],'1.5deg');
assert.equal(card.properties['--sm-tilt-y'],'1.5deg');
control.events.click();observer();
assert.equal(control.attributes['aria-pressed'],'true');
assert.equal(original.textContent,'Reanudar efectos');
assert.deepEqual(card.properties,{});
card.events.pointermove({clientX:400,clientY:0});
assert.equal(frames.size,0);
body.classList.toggle('sm-motion-paused');observer();
assert.equal(original.textContent,'Pausar efectos');
reduced.matches=true;reduced.change();
assert.equal(control.hidden,true);
card.events.pointermove({clientX:400,clientY:0});
assert.equal(frames.size,0);
reduced.matches=false;reduced.change();fine.matches=false;fine.change();
card.events.pointermove({clientX:400,clientY:0});assert.equal(frames.size,0);
fine.matches=true;fine.change();card.events.pointermove({clientX:300,clientY:30});card.events.pointercancel();
assert.equal(frames.size,0);
assert.deepEqual(card.properties,{});
console.log('PASS: tilt bounded to 1.5 degrees; pause sync; original welcome control sync; reduced motion; touch exclusion; cancellation. No business/network APIs available to the test.');
