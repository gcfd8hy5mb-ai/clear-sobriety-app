(()=>{'use strict';
const KEY='clear-aa-support-v1';
const $=id=>document.getElementById(id);
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
function write(v){localStorage.setItem(KEY,JSON.stringify(v))}
function init(){
 const section=document.createElement('section');section.className='card';section.id='aaSupport';
 section.innerHTML='<p class="eyebrow">Community support</p><h2>A.A. & recovery</h2><p class="muted small">Find people to talk to, explore meetings, and track your own progress. Optional and private.</p><div style="display:grid;gap:9px"><a class="btn secondary" style="display:block;text-align:center;text-decoration:none" target="_blank" rel="noopener noreferrer" href="https://www.aa.org/find-aa">Find in-person A.A. meetings</a><a class="btn secondary" style="display:block;text-align:center;text-decoration:none" target="_blank" rel="noopener noreferrer" href="https://aa-intergroup.org/meetings/">Find online A.A. meetings</a><a class="btn secondary" style="display:block;text-align:center;text-decoration:none" target="_blank" rel="noopener noreferrer" href="https://www.aa.org/meeting-guide-app">A.A. Meeting Guide</a><a class="btn secondary" style="display:block;text-align:center;text-decoration:none" target="_blank" rel="noopener noreferrer" href="https://www.aa.org/everything-aa-app">A.A. reading & daily reflections</a></div><p class="small muted" style="margin-top:15px">Meetings attended (saved only on this phone)</p><div class="row"><strong id="aaCount">0 meetings</strong><button id="aaAdd" type="button" class="btn secondary tiny">Log a meeting</button></div><p class="small muted" id="aaLatest"></p><label class="small" for="aaContact">Trusted support contact (optional)</label><input id="aaContact" type="tel" autocomplete="off" placeholder="Phone number" style="width:100%;margin:8px 0 10px;padding:12px;border-radius:12px;background:#092024;color:#fff;border:1px solid #31565a"><div class="row"><button id="aaSave" type="button" class="btn secondary tiny">Save contact</button><a id="aaCall" class="btn secondary tiny" style="text-decoration:none;text-align:center" href="#" hidden>Call contact</a></div><p class="small muted">CLEAR is independent and is not affiliated with or endorsed by Alcoholics Anonymous. External links open official A.A. resources. No meeting attendance is verified or shared.</p>';
 const target=$('support')||$('settings')||document.querySelector('.app');if(!target)return;target.append(section);
 function draw(){const s=read();$('aaCount').textContent=(s.meetings||[]).length+' meetings';$('aaLatest').textContent=s.meetings?.length?'Last logged: '+new Date(s.meetings[s.meetings.length-1]).toLocaleDateString():'';$('aaContact').value=s.contact||'';if(s.contact){$('aaCall').hidden=false;$('aaCall').href='tel:'+s.contact.replace(/[^+\d]/g,'')}else{$('aaCall').hidden=true;$('aaCall').removeAttribute('href')}}
 $('aaAdd').onclick=()=>{const s=read();s.meetings=[...(s.meetings||[]),new Date().toISOString()];write(s);draw()};
 $('aaSave').onclick=()=>{const s=read();s.contact=$('aaContact').value.trim().slice(0,40);write(s);draw()};
 draw();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
// Original CLEAR exercises inspired by recovery principles; not A.A. literature.
function recoveryPractice(){
 const host=document.getElementById('aaSupport');if(!host)return;
 const panel=document.createElement('div');panel.style.marginTop='18px';
 panel.innerHTML='<h3>Today’s recovery practice</h3><p class="small muted">One day at a time. Choose one small action for today.</p><p id="clearPrompt"></p><textarea id="clearReflection" rows="3" placeholder="Write a private reflection…" style="width:100%;border-radius:12px;padding:12px;background:#092024;color:#fff;border:1px solid #31565a"></textarea><button class="btn secondary" id="clearSaveReflection" type="button">Save today’s reflection</button><p class="small muted" id="clearReflectionStatus"></p><h3>Recovery tools</h3><div style="display:grid;gap:8px"><button class="btn secondary" type="button" id="clearAccept">Acceptance: name what I cannot control</button><button class="btn secondary" type="button" id="clearReach">Connection: who can I reach out to?</button><button class="btn secondary" type="button" id="clearReview">Personal inventory: what went well, what can improve?</button><button class="btn secondary" type="button" id="clearPause">Pause: breathe and choose my next action</button></div><p class="small muted">These are original CLEAR prompts inspired by common recovery practices, not official A.A. exercises. Spiritual practices are optional.</p>';
 host.append(panel);
 const prompts=['What is one healthy choice I can make today?','What situation might challenge me today, and what is my plan?','Who could I ask for support instead of handling everything alone?','What am I grateful for today?','What did I learn from a difficult moment?','What is within my control right now?','How can I show myself or someone else kindness today?'];
 const date=new Date();const key=date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');
 const storeKey='clear-reflections-v1';let saved={};try{saved=JSON.parse(localStorage.getItem(storeKey)||'{}')}catch{}
 document.getElementById('clearPrompt').textContent=prompts[Math.floor(date.getTime()/86400000)%prompts.length];
 document.getElementById('clearReflection').value=saved[key]||'';
 document.getElementById('clearSaveReflection').onclick=()=>{saved[key]=document.getElementById('clearReflection').value.slice(0,3000);localStorage.setItem(storeKey,JSON.stringify(saved));document.getElementById('clearReflectionStatus').textContent='Saved privately on this device.'};
 const setPrompt=t=>{document.getElementById('clearPrompt').textContent=t};
 document.getElementById('clearAccept').onclick=()=>setPrompt('What can I accept today, and what one action is still mine to take?');
 document.getElementById('clearReach').onclick=()=>setPrompt('Who is a safe person I could call or message today? What would I say?');
 document.getElementById('clearReview').onclick=()=>setPrompt('What went well today? Where could I make a different choice tomorrow?');
 document.getElementById('clearPause').onclick=()=>setPrompt('Pause for a few slow breaths. What choice would support your recovery in the next ten minutes?');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',recoveryPractice);else recoveryPractice();
