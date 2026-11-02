/* Contextual faith-and-growth insights for voluntary check-ins. No predictive diagnoses. */
(()=>{'use strict';
const KEY='clear-growth-checkins-v1',COURSE='clear-course-v1';
const $=id=>document.getElementById(id);
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'{}')}catch{return {}}};
const names={alcohol:'Alcohol',substances:'Substances',gambling:'Gambling',digital:'Digital habits',spending:'Spending',gaming:'Gaming',relationships:'Relationships',codependency:'Codependency',family:'Family support',eating:'Eating-related concerns',other:'Another concern',general:'Personal growth'};
const guidance={
codependency:['Galatians 6:1–5','Paul teaches mutual burden-bearing alongside responsibility for one\'s own conduct. Consider what care is yours to offer, without assuming control over another adult.','List what is yours to do and what belongs to someone else.'],
gambling:['Luke 12:13–21','Jesus warns that life does not consist in possessions. Consider what values a financial decision serves.','Pause before any wager and consider support or blocking access.'],
alcohol:['1 Corinthians 6:12','Paul speaks about Christian freedom and what masters us. This text does not replace medical advice, including about dangerous alcohol withdrawal.','Identify appropriate support, including medical guidance when necessary.'],
substances:['Romans 8:1–4','Paul addresses life in Christ and freedom from condemnation. Faith and evidence-based treatment can work together.','Consider a safe support person or qualified care professional.'],
relationships:['Ephesians 4:15','Paul describes truthful love in the Christian community. It should never be used to require unsafe confrontation.','Write one respectful, safe boundary.'],
family:['Galatians 6:1–5','Paul joins caring for others with responsibility. Real caregiving duties and safety needs still matter.','Identify a sustainable form of support.'],
spending:['Luke 12:15','Jesus warns against measuring life by possessions. This can inform financial reflection without labeling people.','Delay an unplanned purchase and reflect on the need behind it.'],
digital:['Philippians 4:8','Paul encourages attention to what is worthy of thought. His counsel is not a clinical diagnosis of technology use.','Choose one intentional device boundary.'],
gaming:['Ephesians 5:15–17','Paul encourages wise use of time and discipleship. Enjoyable recreation is not inherently wrong.','Protect time for sleep, responsibilities, and relationships.'],
eating:['Psalm 139:13–18','The psalm praises God\'s care in creating human life. This is not a prescription for diet or weight.','Respond with dignity and seek specialist support when appropriate.'],
other:['Psalm 139:23–24','The psalmist invites God to examine the heart with honesty and trust.','Write one compassionate observation and a helpful next step.'],
general:['Micah 6:8','Micah links faithfulness with justice, mercy, and humble walking with God.','Choose one act of mercy or integrity today.']
};
function render(){
const root=$('growthInsights');if(!root)return;root.replaceChildren();
const all=read(KEY).entries;const entries=Array.isArray(all)?all.filter(e=>e&&e.time):[];
const course=read(COURSE);const paths=Array.isArray(course.tracks)?course.tracks.filter(k=>guidance[k]):[];
const field=document.createElement('select');field.className='input';field.setAttribute('aria-label','Filter growth insights by focus');
for(const key of (paths.length?paths:['general'])){const o=document.createElement('option');o.value=key;o.textContent=names[key];field.append(o)}
const current=document.getElementById('growthFocus')?.value;if([...field.options].some(o=>o.value===current))field.value=current;
root.append(field);
function show(){
const path=field.value,rows=entries.filter(x=>x.focus===path),recent=rows.slice(-30),counts={};
for(const e of recent){if(e.trigger)counts[e.trigger]=(counts[e.trigger]||0)+1}
const common=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
let info=root.querySelector('.growth-summary');if(!info){info=document.createElement('div');info.className='growth-summary';root.append(info)}info.replaceChildren();
const p=(text)=>{const node=document.createElement('p');node.className='small muted';node.textContent=text;info.append(node)};
p(rows.length+' voluntary check-ins recorded for '+names[path]+'.');
if(recent.length>=3){p('In the last '+recent.length+' check-ins, '+recent.filter(e=>e.feeling===3).length+' were marked as difficult moments.'+(common?' Most frequently selected factor: '+common[0]+'.':''));}else p('A pattern summary needs at least three check-ins for this focus. No predictions are made.');
const [verse,interpretation,exercise]=guidance[path];const heading=document.createElement('h3');heading.textContent='Scripture to explore: '+verse;info.append(heading);p(interpretation);p('Optional exercise: '+exercise);p('This is an educational suggestion, not a personalized message from God or a medical assessment. Read the passage in context.');
if(path!=='general'){
 const lesson=document.createElement('button');lesson.type='button';lesson.className='btn secondary';lesson.style.marginTop='12px';lesson.textContent='Open '+names[path]+' biblical lesson';
 lesson.onclick=()=>window.dispatchEvent(new CustomEvent('clear:open-path-lesson',{detail:{focus:path,stage:window.CLEAR_nextStage?.(path)||1}}));
 info.append(lesson);
}
}
field.onchange=show;show();
}
function init(){const page=$('insights');if(!page)return;const section=document.createElement('section');section.className='card';section.id='growthInsightsCard';section.innerHTML='<div class="eyebrow">Bible and reflection</div><h2>Your growth insights</h2><p class="small muted">Optional Scripture suggestions based on your chosen focus and the check-ins you record.</p><div id="growthInsights"></div>';const entry=$('personalCheckins');if(entry)entry.after(section);else page.prepend(section);
document.querySelectorAll('.nav button').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.tab==='insights')render()}));$('growthSave')?.addEventListener('click',()=>setTimeout(render,0));render()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();