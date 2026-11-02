// Run: node scripts/audit-daily-scripture.cjs
// Structural audit; theological interpretation requires independent human review.
const fs=require('node:fs');
const vm=require('node:vm');
const names=['christian-step-study.js','daily-bible-expanded.js','daily-bible-batch-02.js','daily-bible-batch-03.js','daily-bible-batch-04.js','daily-bible-batch-05.js','daily-scripture.js'];
const window={};const context=vm.createContext({window,Date,Set});
for(const name of names)vm.runInContext(fs.readFileSync(name,'utf8'),context,{filename:name});
const items=Array.from(window.CLEAR_DailyScripture.readings());
const errors=[];const seen=new Set();
for(let i=0;i<items.length;i++){
 const item=items[i];
 for(const field of ['title','scripture','context','prompt','prayer'])if(typeof item[field]!=='string'||!item[field].trim())errors.push('Entry '+i+': missing '+field);
 if(!/^(?:[1-3] )?[A-Za-z ]+ \d+:\d+(?:-\d+)?$/.test(item.scripture))errors.push('Entry '+i+': invalid Scripture reference '+item.scripture);
 if(seen.has(item.scripture))errors.push('Entry '+i+': duplicate '+item.scripture);
 seen.add(item.scripture);
}
if(items.length!==365)errors.push('Expected 365 unique readings, found '+items.length);
for(let day=0;day<365;day++){
 const date=new Date(Date.UTC(2027,0,1+day,12));
 const a=window.CLEAR_DailyScripture.today(date),b=window.CLEAR_DailyScripture.today(date);
 if(a?.scripture!==b?.scripture)errors.push('Unstable daily selection at '+date.toISOString());
}
console.log('Daily Scripture audit: '+items.length+' unique complete entries; '+errors.length+' structural errors.');
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}
