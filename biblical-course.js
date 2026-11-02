/* CLEAR Biblical Recovery Course v1 — original independent curriculum. */
(()=>{'use strict';
const KEY='clear-course-v1';
const tracks=[
['alcohol','Alcohol'],['substances','Drugs & substances'],['gambling','Gambling'],
['digital','Pornography & compulsive digital habits'],['spending','Compulsive spending'],
['gaming','Gaming & technology'],['relationships','Relationship dependency'],
['codependency','Codependency'],['family','Supporting a loved one'],
['eating','Food-related concerns'],['other','Another concern']];
const stages=[
['Awareness','Recognizing patterns without condemnation'],
['Honesty','Facing the impact with compassion and truth'],
['Hope','Making room for change and support'],
['Surrender','Releasing what is outside your control'],
['Personal Inventory','Reviewing emotions, triggers and choices'],
['Accountability','Practicing openness with safe people'],
['Forgiveness','Working through shame, hurt and responsibility'],
['Transformation','Learning alternative responses'],
['Relationships','Developing boundaries and respectful connection'],
['Resilience','Planning for difficult situations and setbacks'],
['Daily Spiritual Growth','Scripture, prayer and sustained practices'],
['Lifelong Recovery','Community, service and ongoing care']];
const lessons=[
{title:'1. Understanding the Pattern',scripture:'Psalm 139:23–24; Romans 12:2',teach:[
'Awareness starts with paying attention, not assigning blame. A repeated response may temporarily ease distress yet create longer-term consequences. Describe what happens before, during and after the response without calling yourself a failure.',
'The biblical invitation in Psalm 139:23–24 is to examine the heart openly. Romans 12:2 connects change with renewed thinking. These passages do not imply that a medical condition or a difficult relationship can be solved by willpower or prayer alone.',
'Notice the difference between an emotion and an action. Feeling anxious, lonely or responsible for others is not wrongdoing. You can observe a feeling and still choose a safe next step.'],
prompt:'What tends to happen immediately before this pattern? What is one situation in which it did not happen?',check:{q:'Which response best represents healthy awareness?',a:['Notice triggers without judging your worth','Promise you will never struggle again','Keep the struggle secret'],correct:0,why:'Observation makes patterns understandable. Harsh promises and secrecy can interfere with meaningful support.'}},
{title:'2. What Is and Is Not Mine to Carry',scripture:'Galatians 6:2, 6:5; Matthew 11:28–30',teach:[
'Galatians uses two complementary ideas: helping carry one another’s burdens and being responsible for our own conduct. Supporting others does not mean managing their choices or accepting harm.',
'With codependency, this might mean caring about a family member without hiding consequences for them, making decisions for them, or taking responsibility for their emotions. With another dependency, it might mean accepting support while owning your next action.',
'Boundaries are descriptions of what you will do to remain safe and respectful. They are not punishments, ultimatums intended to control someone, or demands that another person change.'],
prompt:'Write one responsibility that belongs to you, and one that belongs to someone else. What boundary would respect both?',check:{q:'Which statement is a healthy boundary?',a:['You must stop feeling upset','If shouting begins, I will end the conversation and return later if safe','I have to fix every problem'],correct:1,why:'A boundary identifies your own safe action rather than controlling someone else.'}},
{title:'3. A Small, Supported Next Step',scripture:'Proverbs 11:14; Ecclesiastes 4:9–10',teach:[
'Recovery is rarely one dramatic turning point. Small, specific, repeatable choices and supportive relationships can help build stability. Wisdom includes seeking informed guidance when a struggle carries health, safety or legal risks.',
'Choose an action within your control: pause for two minutes, contact a trusted person, avoid a particular trigger when safe, ask about professional care, or schedule a support meeting. A setback is information about what help may be needed, not proof of personal failure.',
'Faith may be an important source of hope, but Scripture study is not a replacement for appropriate treatment, medication, or crisis services.'],
prompt:'What one realistic step can you take in the next 24 hours, and who could support you?',check:{q:'What is the safest interpretation of a setback?',a:['My recovery is over','I need to hide this','I can review what happened and seek appropriate support'],correct:2,why:'A setback calls for learning, safety and support, not shame.'}}
]; const extras=window.CLEAR_RECOVERY_CONTENT||{core:[],paths:{}}; const more=window.CLEAR_RECOVERY_CONTENT_V2||{core:[],paths:{}};const allLessons=[...lessons,...(extras.core||[]),...(more.core||[])].map(x=>({...x,stage:x.stage||1}));const applied=window.CLEAR_RECOVERY_CONTENT_V3||{core:[],paths:{}};const theology=window.CLEAR_THEOLOGY_V1||{core:[],paths:{}};const study=window.CLEAR_STUDY_V1||{weeks:[],daily:[]};allLessons.push(...(theology.core||[]),...(study.weeks||[]));const pathLessons=t=>[...((extras.paths||{})[t]||[]),...((more.paths||{})[t]||[]),...((applied.paths||{})[t]||[]),...((theology.paths||{})[t]||[])];
const readings=window.CLEAR_TRACK_READINGS_V1||{};const $=id=>document.getElementById(id);
const safeLoad=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return x&&typeof x==='object'?x:{}}catch{return {}}};
let s={track:'',tracks:[],done:[],responses:{},...safeLoad()};
if(!Array.isArray(s.done))s.done=[];
if(!s.responses||typeof s.responses!=='object')s.responses={};
if(!Array.isArray(s.tracks))s.tracks=[];
if(!s.tracks.length && s.track)s.tracks=[s.track];
s.tracks=[...new Set(s.tracks.filter(t=>tracks.some(x=>x[0]===t)))];
const lessonId=(l,t='core')=>t+':'+(l.stage||1)+':'+l.title.toLowerCase().replace(/[^a-z0-9]+/g,'-');
const availableLessons=()=>[...allLessons.map(l=>({...l,id:lessonId(l)})),...s.tracks.flatMap(t=>pathLessons(t).map(l=>({...l,id:lessonId(l,t),track:t})))];
/* Migrate index-based progress from earlier versions, when only one track was selectable. */
if(!s.migratedIds){
 const old=[...allLessons,...pathLessons(s.track)];
 s.done=s.done.map(v=>typeof v==='number' && old[v]?lessonId(old[v],v<allLessons.length?'core':s.track):v);
 const responses={};
 for(const [key,value] of Object.entries(s.responses)){
   const i=Number(key),valid=Number.isInteger(i)&&String(i)===key&&old[i];
   responses[valid?lessonId(old[i],i<allLessons.length?'core':s.track):key]=value;
 }
 s.responses=responses;s.migratedIds=true;
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(s))}catch{status('Storage unavailable: progress cannot be saved on this device.')}}
function el(tag,cls,txt){const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;return x}
function status(t){const x=$('courseStatus');if(x)x.textContent=t}
function paragraph(parent,t,cls='muted'){parent.append(el('p',cls,t))}
function btn(label,fn,cls='btn secondary'){const b=el('button',cls,label);b.type='button';b.onclick=fn;return b}
function renderDaily(host){const items=study.daily||[];if(!items.length)return;const start=new Date();const localDay=new Date(start.getFullYear(),start.getMonth(),start.getDate());const dayIndex=Math.floor(localDay.getTime()/86400000);const item=items[((dayIndex%items.length)+items.length)%items.length];const card=el('div','card');card.append(el('div','eyebrow','Daily Bible Study · '+start.toLocaleDateString()),el('h2','',item.title));paragraph(card,'Read: '+item.scripture,'notice small');paragraph(card,'Biblical interpretation: '+item.context,'muted');paragraph(card,'Reflection: '+item.prompt,'muted');paragraph(card,'Optional prayer: '+item.prayer,'muted');paragraph(card,'Daily readings rotate through a growing original study library. Read the passage in your Bible; reflections are not graded.','footer-note');host.append(card)}
function render(){
const host=$('courseBody');if(!host)return;host.replaceChildren();
const intro=el('div','card');intro.append(el('div','eyebrow','Private learning path'),el('h2','', 'Choose a recovery focus'));
paragraph(intro,'Baptist/Evangelical foundation: Scripture, the Gospel of Jesus Christ, grace through faith, repentance, sanctification, prayer, and church community.','notice small');paragraph(intro,'The same biblical foundation is available to everyone. Examples and reflections can focus on your own circumstances. This is not a diagnosis.','small muted');
const choices=el('div','');choices.style.display='grid';choices.style.gridTemplateColumns='repeat(2,minmax(0,1fr))';choices.style.gap='9px';
tracks.forEach(([value,label])=>{
 const wrap=el('label','small');wrap.style.display='flex';wrap.style.gap='8px';wrap.style.alignItems='center';wrap.style.margin='0';wrap.style.padding='10px';wrap.style.border='1px solid #31565a';wrap.style.borderRadius='10px';
 const input=el('input');input.type='checkbox';input.checked=s.tracks.includes(value);input.style.accentColor='#35cdb8';
 input.onchange=()=>{s.tracks=input.checked?[...s.tracks,value]:s.tracks.filter(x=>x!==value);s.track=s.tracks[0]||'';save();render()};
 wrap.append(input,el('span','',label));choices.append(wrap);
});intro.append(choices);
paragraph(intro,'Select multiple areas if needed. Progress is shared for foundational lessons and independent for each recovery path.','small muted');
if(s.tracks.includes('codependency')||s.tracks.includes('family'))paragraph(intro,'Caring for someone does not make you responsible for their decisions. Forgiveness never requires remaining in danger.','notice small');
if(s.tracks.includes('alcohol')||s.tracks.includes('substances'))paragraph(intro,'Stopping alcohol or sedatives abruptly can be dangerous. Seek medical guidance about withdrawal. Other substance-related risks may require professional care.','notice warning small');
if(s.tracks.includes('eating'))paragraph(intro,'Eating-related difficulties may require specialist care; CLEAR is not a treatment or diet plan.','notice warning small');
host.append(intro);
const p=el('div','card');p.append(el('div','eyebrow','12-stage journey'),el('h2','','Course roadmap'));paragraph(p,'Core lessons and selected-path lessons are available. Additional course depth is still being developed.','small muted');
const available=availableLessons();const completed=available.filter(l=>s.done.includes(l.id)).length;paragraph(p,completed+' of '+available.length+' available lessons completed. Personal reflections are optional.','small muted');
const bar=el('div','bar');const fill=el('i');fill.style.width=(100*completed/Math.max(1,available.length))+'%';bar.append(fill);p.append(bar);
stages.forEach(([name,desc],i)=>{const line=el('div','log');line.append(el('strong','',String(i+1)+'. '+name));paragraph(line,desc+(available.some(l=>(l.stage||1)===i+1)?' · lessons available':' · upcoming'),'small muted');s.tracks.forEach(t=>{const ref=(readings[t]||[])[i];if(ref)paragraph(line,(tracks.find(x=>x[0]===t)||[])[1]+' reading: '+ref,'small muted')});p.append(line)});host.append(p);
if(!s.tracks.length){const prompt=el('div','card');paragraph(prompt,'Choose a focus to open your first lesson. You can change it later without losing completed lessons.');host.append(prompt);return}
const section=el('div','card');section.append(el('div','eyebrow','Curriculum'),el('h2','','Your lessons'));
available.forEach((lesson,i)=>{const line=el('div','log');line.append(el('strong','',lesson.title));paragraph(line,(s.done.includes(lesson.id)?'✓ Completed · ':'')+lesson.scripture,'small muted');line.append(btn('Open lesson',()=>openLesson(i),'btn secondary tiny'));section.append(line)});host.append(section);
}
function openLesson(i){
const host=$('courseBody');host.replaceChildren();const available=availableLessons();const L=available[i],box=el('article','card');
box.append(btn('← Back to course',render,'btn secondary tiny'),el('div','eyebrow','Stage '+(L.stage||1)+' · Lesson '+(i+1)),el('h2','',L.title));
paragraph(box,'Scripture study: '+L.scripture+'. Read these passages in your preferred Bible translation.','notice small');if(L.week){const stage=(L.stage||1)-1;s.tracks.forEach(t=>{const ref=(readings[t]||[])[stage];if(ref)paragraph(box,'Your '+(tracks.find(x=>x[0]===t)||[])[1]+' focus · '+ref+'. Read in context and consider how the passage applies without forcing a clinical meaning onto it.','notice small')})}
L.teach.forEach(t=>paragraph(box,t,'muted'));if(L.case){box.append(el('h2','','Biblical case study'));paragraph(box,L.case,'muted')}if(L.workbook?.length){box.append(el('h2','','Christian recovery workbook'));L.workbook.forEach((question,n)=>paragraph(box,(n+1)+'. '+question,'muted'))}
box.append(el('h2','','Personal reflection'));paragraph(box,L.prompt,'small muted');
const ta=el('textarea','input');ta.rows=5;ta.placeholder='Optional private reflection (stored in this browser only)';ta.value=s.responses[L.id]||'';ta.style.width='100%';box.append(ta);
box.append(btn('Save reflection',()=>{s.responses[L.id]=ta.value.slice(0,3000);save();status('Reflection saved on this device.')},'btn secondary'));
box.append(el('h2','','Knowledge check'));paragraph(box,L.check.q);
const answers=el('div','');answers.style.display='grid';answers.style.gap='8px';
L.check.a.forEach((t,n)=>answers.append(btn(t,()=>{const correct=n===L.check.correct;status((correct?'Correct. ':'Try again. ')+L.check.why)},'btn secondary')));box.append(answers);
box.append(btn(s.done.includes(L.id)?'Lesson completed ✓':'Mark lesson complete',()=>{if(!s.done.includes(L.id))s.done.push(L.id);save();render();status('Lesson marked complete. You can revisit it anytime.')}));host.append(box);
}
function init(){
const home=$('home'),nav=document.querySelector('.nav-inner'),app=document.querySelector('main.app');if(!home||!nav||!app)return;
const homeBtn=el('button','btn secondary','Open Biblical Recovery Course →');homeBtn.type='button';homeBtn.style.margin='0 0 16px';homeBtn.onclick=()=>activate();home.insertBefore(homeBtn,$('dailyRecovery'));
const page=el('section','page hide');page.id='course';page.append(el('div','eyebrow','CLEAR · Biblical recovery'),el('h1','title','Your Recovery Course'));paragraph(page,'Faith, learning, boundaries and practical recovery skills—one step at a time.','muted');const body=el('div');body.id='courseBody';page.append(body);const note=el('p','footer-note','Independent CLEAR course, not an official Celebrate Recovery program. Educational and spiritual support only; not a replacement for professional care. Your course selections and reflections are kept in this device’s browser storage, not encrypted or synced.');page.append(note);const live=el('p','small muted');live.id='courseStatus';live.setAttribute('role','status');page.append(live);app.append(page);
const biblePage=el('section','page hide');biblePage.id='dailyBible';biblePage.append(el('div','eyebrow','Daily discipleship · independent of recovery'),el('h1','title','Daily Bible Study'));paragraph(biblePage,'A daily Scripture study for Christian growth. No recovery track is required and your step-study completion is unaffected.','muted');const bibleBody=el('div');biblePage.append(bibleBody);app.append(biblePage);
function openDaily(){document.querySelectorAll('.page').forEach(x=>x.classList.toggle('hide',x!==biblePage));document.querySelectorAll('.nav button').forEach(x=>x.classList.toggle('active',x===dailyBtn));bibleBody.replaceChildren();renderDaily(bibleBody);window.scrollTo(0,0)}
const dailyBtn=el('button');dailyBtn.type='button';dailyBtn.dataset.tab='dailyBible';dailyBtn.innerHTML='<strong>✝</strong>Bible';dailyBtn.onclick=openDaily;
const dailyHomeBtn=btn('Open Daily Bible Study →',openDaily);dailyHomeBtn.style.margin='0 0 16px';home.insertBefore(dailyHomeBtn,homeBtn);
const navBtn=el('button','','');navBtn.dataset.tab='course';navBtn.innerHTML='<strong>✦</strong>Course';nav.append(navBtn,dailyBtn);nav.style.gridTemplateColumns='repeat(6,1fr)';
function activate(){document.querySelectorAll('.page').forEach(x=>x.classList.toggle('hide',x.id!=='course'));document.querySelectorAll('.nav button').forEach(x=>x.classList.toggle('active',x===navBtn));window.scrollTo(0,0);render()}
window.CLEAR_nextStage=focus=>{const pool=availableLessons().filter(x=>x.track===focus);const next=pool.find(x=>!s.done.includes(x.id));return next?.stage||pool.at(-1)?.stage||1};
navBtn.onclick=activate;
window.addEventListener('clear:open-path-lesson',event=>{
 const focus=event.detail?.focus,stage=Number(event.detail?.stage)||1;
 if(!tracks.some(t=>t[0]===focus))return;
 if(!s.tracks.includes(focus)){s.tracks=[...s.tracks,focus];s.track=s.tracks[0];save()}
 activate();
 const options=availableLessons();
 const index=options.findIndex(x=>x.track===focus&&x.stage===stage);
 const backup=options.findIndex(x=>x.track===focus);
 const selected=index>=0?index:backup;
 if(selected>=0)openLesson(selected);else status('No specialized lesson exists yet for this focus. Explore the foundational course.');
});

document.querySelectorAll('.nav button').forEach(b=>{if(b!==navBtn&&b!==dailyBtn)b.addEventListener('click',()=>{page.classList.add('hide');biblePage.classList.add('hide');navBtn.classList.remove('active');dailyBtn.classList.remove('active')})});
render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();