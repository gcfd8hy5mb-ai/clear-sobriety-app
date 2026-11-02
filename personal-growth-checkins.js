/* CLEAR personal-path check-ins, independent from alcohol-specific historical records. */
(()=>{'use strict';
const KEY='clear-growth-checkins-v1',COURSE='clear-course-v1';
const labels={alcohol:'Alcohol',substances:'Substances',gambling:'Gambling',digital:'Digital habits',spending:'Spending',gaming:'Gaming',relationships:'Relationships',codependency:'Codependency',family:'Family support',eating:'Eating-related concerns',other:'Other concern'};
const $=id=>document.getElementById(id);
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'{}')}catch{return {}}};
function create(){
const page=$('insights');if(!page)return;
const old=$('intensity')?.closest('.card');if(old)old.hidden=true;
const past=page.querySelector('.card');if(past)past.hidden=true;
const historic=$('history')?.closest('.card');if(historic)historic.hidden=true;
const legacy=$('clearRecoveryInsights')?.closest('.card');if(legacy)legacy.hidden=true;
const section=document.createElement('section');section.className='card';section.id='personalCheckins';
section.innerHTML='<div class="eyebrow">Optional reflection</div><h2>How are you doing today?</h2><p class="muted small">Select a personal focus and record how the day feels. Bible study and course progress do not depend on these check-ins.</p><label for="growthFocus">Focus</label><select class="input" id="growthFocus"></select><label for="growthFeel">Today</label><select class="input" id="growthFeel"><option value="1">Doing well</option><option value="2">Facing a challenge</option><option value="3">A difficult moment</option></select><label for="growthTrigger">What contributed? (optional)</label><select class="input" id="growthTrigger"><option value="">Not specified</option><option>Stress</option><option>Loneliness</option><option>Relationships</option><option>Routine</option><option>Other</option></select><button type="button" class="btn" id="growthSave" style="margin-top:14px">Save private check-in</button><p id="growthMessage" class="small muted" role="status"></p><h2>Recent reflections</h2><div id="growthHistory"></div>';
page.insertBefore(section,page.querySelector('.card'));
const select=$('growthFocus');function options(){const s=read(COURSE);const chosen=Array.isArray(s.tracks)?s.tracks.filter(x=>labels[x]):[];const prior=select.value;select.replaceChildren();for(const k of (chosen.length?chosen:['general'])){const o=document.createElement('option');o.value=k;o.textContent=labels[k]||'General personal growth';select.append(o)}if([...select.options].some(o=>o.value===prior))select.value=prior}
function render(){options();const entries=Array.isArray(read(KEY).entries)?read(KEY).entries:[];const host=$('growthHistory');host.replaceChildren();if(!entries.length){const p=document.createElement('p');p.className='small muted';p.textContent='No reflections recorded. This is completely optional.';host.append(p)}
for(const e of entries.slice(-10).reverse()){const row=document.createElement('p');row.className='small muted';const t=new Date(e.time);row.textContent=(Number.isNaN(t.getTime())?'':t.toLocaleDateString())+' · '+(labels[e.focus]||'Personal growth')+' · '+(['','Doing well','Facing a challenge','A difficult moment'][e.feeling]||'Check-in')+(e.trigger?' · '+e.trigger:'');host.append(row)}}
$('growthSave').onclick=()=>{const data=read(KEY);const entries=Array.isArray(data.entries)?data.entries:[];entries.push({time:new Date().toISOString(),focus:select.value,feeling:Number($('growthFeel').value),trigger:$('growthTrigger').value});try{localStorage.setItem(KEY,JSON.stringify({entries:entries.slice(-365)}));$('growthMessage').textContent='Saved on this device only.';render()}catch{$('growthMessage').textContent='Storage unavailable; check-in not saved.'}};
document.querySelectorAll('.nav button').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.tab==='insights')render()}));render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',create);else create();
})();