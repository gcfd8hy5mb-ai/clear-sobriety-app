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
];
const $=id=>document.getElementById(id);
const safeLoad=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return x&&typeof x==='object'?x:{}}catch{return {}}};
let s={track:'',done:[],responses:{},...safeLoad()};if(!Array.isArray(s.done))s.done=[];if(!s.responses||typeof s.responses!=='object')s.responses={};
function save(){try{localStorage.setItem(KEY,JSON.stringify(s))}catch{status('Storage unavailable: progress cannot be saved on this device.')}}
function el(tag,cls,txt){const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;return x}
function status(t){const x=$('courseStatus');if(x)x.textContent=t}
function paragraph(parent,t,cls='muted'){parent.append(el('p',cls,t))}
function btn(label,fn,cls='btn secondary'){const b=el('button',cls,label);b.type='button';b.onclick=fn;return b}
function render(){
const host=$('courseBody');if(!host)return;host.replaceChildren();
const intro=el('div','card');intro.append(el('div','eyebrow','Private learning path'),el('h2','', 'Choose a recovery focus'));
paragraph(intro,'The same biblical foundation is available to everyone. Examples and reflections can focus on your own circumstances. This is not a diagnosis.','small muted');
const select=el('select','input');select.setAttribute('aria-label','Recovery focus');
[['','Choose a learning path'],...tracks].forEach(([value,label])=>{const o=el('option','',label);o.value=value;select.append(o)});select.value=s.track;select.onchange=()=>{s.track=select.value;save();render()};intro.append(select);
if(s.track==='codependency'||s.track==='family'){paragraph(intro,'Codependency is a descriptive term, not a clinical diagnosis. Caring for someone does not make you responsible for their choices. Forgiveness never requires remaining in danger.','notice small')}
if(s.track==='alcohol'||s.track==='substances'){paragraph(intro,'Important: stopping alcohol or some sedatives suddenly can cause dangerous withdrawal. Seek medical guidance before abrupt cessation if withdrawal is possible. Opioid-use treatment and overdose-prevention care are also available.','notice warning small')}
if(s.track==='eating'){paragraph(intro,'Eating-related difficulties may require specialized clinical support. CLEAR does not recommend restriction, fasting, purging or weight targets.','notice warning small')}
host.append(intro);
const p=el('div','card');p.append(el('div','eyebrow','12-stage journey'),el('h2','','Course roadmap'));paragraph(p,'Stage 1 includes three original interactive lessons. Later stages are planned, not yet authored.','small muted');
const completed=lessons.filter((_,i)=>s.done.includes(i)).length;paragraph(p,completed+' of '+lessons.length+' available lessons completed. Personal reflections are optional.','small muted');
const bar=el('div','bar');const fill=el('i');fill.style.width=(100*completed/lessons.length)+'%';bar.append(fill);p.append(bar);
stages.forEach(([name,desc],i)=>{const line=el('div','log');line.append(el('strong','',String(i+1)+'. '+name));paragraph(line,desc+(i===0?' · lessons available':' · upcoming'),'small muted');p.append(line)});host.append(p);
if(!s.track){const prompt=el('div','card');paragraph(prompt,'Choose a focus to open your first lesson. You can change it later without losing completed lessons.');host.append(prompt);return}
const section=el('div','card');section.append(el('div','eyebrow','Stage 1 · Awareness'),el('h2','','Your first lessons'));
lessons.forEach((lesson,i)=>{const line=el('div','log');line.append(el('strong','',lesson.title));paragraph(line,(s.done.includes(i)?'✓ Completed · ':'')+lesson.scripture,'small muted');line.append(btn('Open lesson',()=>openLesson(i),'btn secondary tiny'));section.append(line)});host.append(section);
}
function openLesson(i){
const host=$('courseBody');host.replaceChildren();const L=lessons[i],box=el('article','card');
box.append(btn('← Back to course',render,'btn secondary tiny'),el('div','eyebrow','Stage 1 · Lesson '+(i+1)),el('h2','',L.title));
paragraph(box,'Scripture study: '+L.scripture+'. Read these passages in your preferred Bible translation.','notice small');
L.teach.forEach(t=>paragraph(box,t,'muted'));
box.append(el('h2','','Personal reflection'));paragraph(box,L.prompt,'small muted');
const ta=el('textarea','input');ta.rows=5;ta.placeholder='Optional private reflection (stored in this browser only)';ta.value=s.responses[i]||'';ta.style.width='100%';box.append(ta);
box.append(btn('Save reflection',()=>{s.responses[i]=ta.value.slice(0,3000);save();status('Reflection saved on this device.')},'btn secondary'));
box.append(el('h2','','Knowledge check'));paragraph(box,L.check.q);
const answers=el('div','');answers.style.display='grid';answers.style.gap='8px';
L.check.a.forEach((t,n)=>answers.append(btn(t,()=>{const correct=n===L.check.correct;status((correct?'Correct. ':'Try again. ')+L.check.why)},'btn secondary')));box.append(answers);
box.append(btn(s.done.includes(i)?'Lesson completed ✓':'Mark lesson complete',()=>{if(!s.done.includes(i))s.done.push(i);save();render();status('Lesson marked complete. You can revisit it anytime.')}));host.append(box);
}
function init(){
const home=$('home'),nav=document.querySelector('.nav-inner'),app=document.querySelector('main.app');if(!home||!nav||!app)return;
const homeBtn=el('button','btn secondary','Open Biblical Recovery Course →');homeBtn.type='button';homeBtn.style.margin='0 0 16px';homeBtn.onclick=()=>activate();home.insertBefore(homeBtn,$('dailyRecovery'));
const page=el('section','page hide');page.id='course';page.append(el('div','eyebrow','CLEAR · Biblical recovery'),el('h1','title','Your Recovery Course'));paragraph(page,'Faith, learning, boundaries and practical recovery skills—one step at a time.','muted');const body=el('div');body.id='courseBody';page.append(body);const note=el('p','footer-note','Independent CLEAR course, not an official Celebrate Recovery program. Educational and spiritual support only; not a replacement for professional care. Your course selections and reflections are kept in this device’s browser storage, not encrypted or synced.');page.append(note);const live=el('p','small muted');live.id='courseStatus';live.setAttribute('role','status');page.append(live);app.append(page);
const navBtn=el('button','','');navBtn.dataset.tab='course';navBtn.innerHTML='<strong>✦</strong>Course';nav.append(navBtn);nav.style.gridTemplateColumns='repeat(5,1fr)';
function activate(){document.querySelectorAll('.page').forEach(x=>x.classList.toggle('hide',x.id!=='course'));document.querySelectorAll('.nav button').forEach(x=>x.classList.toggle('active',x===navBtn));window.scrollTo(0,0);render()}
navBtn.onclick=activate;
document.querySelectorAll('.nav button:not([data-tab="course"])').forEach(b=>b.addEventListener('click',()=>{page.classList.add('hide');navBtn.classList.remove('active')}));
render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();