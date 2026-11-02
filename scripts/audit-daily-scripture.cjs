// Run from repository root: node scripts/audit-daily-scripture.cjs
// Structural and Bible-text reference checks. This is not independent theological sign-off.
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const source=['christian-step-study.js','daily-bible-expanded.js','daily-bible-batch-02.js','daily-bible-batch-03.js','daily-bible-batch-04.js','daily-bible-batch-05.js','daily-scripture.js'];
const context=vm.createContext({window:{},Date,Set});
for(const name of source)vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),context,{filename:name});
const library=fs.readFileSync(path.join(root,'bible-library.js'),'utf8');
function extract(name){const match=library.match(new RegExp('const '+name+'=\\[([^\\]]+)\\]'));if(!match)throw Error('Cannot find Bible '+name+' list');return [...match[1].matchAll(/'([^']+)'/g)].map(m=>m[1])}
const bookNames=extract('books'),bookIds=extract('bookIds');
if(bookNames.length!==66||bookIds.length!==66)throw Error('Expected 66 mapped Bible books');
const lookup=new Map(bookNames.map((name,i)=>[name,bookIds[i]]));
lookup.set('Psalm','PSA');lookup.set('Psalms','PSA');
const all=context.window.CLEAR_DailyScripture.readings();
const errors=[],seen=new Set(),cache=new Map();
for(let i=0;i<all.length;i++){
 const item=all[i],id='reading '+(i+1)+' ('+(item.scripture||'missing reference')+')';
 for(const k of ['title','scripture','context','prompt','prayer'])if(typeof item[k]!=='string'||!item[k].trim())errors.push(id+': missing '+k);
 if(seen.has(item.scripture))errors.push(id+': duplicate reference');seen.add(item.scripture);
 const match=/^((?:[1-3] )?[A-Za-z ]+) (\d+):(\d+)(?:-(\d+))?$/.exec(item.scripture||'');
 if(!match){errors.push(id+': invalid reference format');continue}
 const [,book,ch,start,end]=match,bookId=lookup.get(book);
 if(!bookId){errors.push(id+': unknown Bible book');continue}
 if(!cache.has(bookId)){try{cache.set(bookId,JSON.parse(fs.readFileSync(path.join(root,'bible-data',bookId+'.json'),'utf8')))}catch(e){errors.push(id+': Bible data unavailable: '+e.message);continue}}
 const chapter=cache.get(bookId)[ch];
 if(!chapter){errors.push(id+': missing chapter');continue}
 const from=+start,to=end?+end:from;
 if(to<from||to>200||from<1){errors.push(id+': invalid verse range');continue}
 for(let v=from;v<=to;v++)if(!chapter[String(v)])errors.push(id+': missing verse '+v);
}
if(all.length!==365)errors.push('Expected 365 distinct daily readings, found '+all.length);
const sample=new Date(2027,0,1,12);
const yearReadings=new Set();
for(let day=0;day<365;day++){
 const date=new Date(sample.getFullYear(),sample.getMonth(),sample.getDate()+day,12);
 const a=context.window.CLEAR_DailyScripture.today(date);
 const b=context.window.CLEAR_DailyScripture.today(new Date(date.getFullYear(),date.getMonth(),date.getDate(),20));
 if(!a||a.scripture!==b?.scripture)errors.push('Unstable daily reading for '+date.toDateString());
 if(a&&yearReadings.has(a.scripture))errors.push('Repeated reading within 365-day cycle: '+a.scripture);
 if(a)yearReadings.add(a.scripture);
}
if(yearReadings.size!==365)errors.push('365-day cycle produced '+yearReadings.size+' distinct readings');
console.log('Audited '+all.length+' distinct readings against '+cache.size+' Bible data books and a full 365-day calendar cycle; '+errors.length+' issues.');
if(errors.length){for(const e of errors)console.error(e);process.exitCode=1}
