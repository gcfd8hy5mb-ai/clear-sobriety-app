/* CLEAR Bible reader groundwork. Whole WEBP text not yet bundled. */
(()=>{'use strict';
const books=['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'];
const bookIds=['GEN','EXO','LEV','NUM','DEU','JOS','JDG','RUT','1SA','2SA','1KI','2KI','1CH','2CH','EZR','NEH','EST','JOB','PSA','PRO','ECC','SNG','ISA','JER','LAM','EZK','DAN','HOS','JOL','AMO','OBA','JON','MIC','NAM','HAB','ZEP','HAG','ZEC','MAL','MAT','MRK','LUK','JHN','ACT','ROM','1CO','2CO','GAL','EPH','PHP','COL','1TH','2TH','1TI','2TI','TIT','PHM','HEB','JAS','1PE','2PE','1JN','2JN','3JN','JUD','REV'];
const chapterLimits=[50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22];
const $=id=>document.getElementById(id);
const make=(tag,text,cls)=>{let x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(cls)x.className=cls;return x};
function init(){
const app=document.querySelector('main.app'),nav=document.querySelector('.nav-inner');if(!app||!nav)return;
const page=make('section',undefined,'page hide');page.id='bibleLibrary';page.append(make('div','Scripture library','eyebrow'),make('h1','Read the Bible','title'));
page.append(make('p','NIV is the preferred translation. Read the selected chapter through BibleGateway; direct in-app NIV text requires permission. The optional public-domain WEB import is a separate fallback.','muted'));
const chooser=make('div',undefined,'card');
const select=make('select',undefined,'input');select.setAttribute('aria-label','Bible book');
books.forEach((name,i)=>{const opt=make('option',name);opt.value=String(i);select.append(opt)});chooser.append(select);
const chapter=make('input',undefined,'input');chapter.type='number';chapter.min='1';chapter.max=String(chapterLimits[0]);chapter.value='1';chapter.setAttribute('aria-label','Chapter');chooser.append(chapter);
const action=make('button','Open in official WEB reader','btn');action.type='button';
const niv=make('a','Read selected chapter in NIV (BibleGateway)','btn secondary');niv.target='_blank';niv.rel='noopener noreferrer';niv.style.display='block';niv.style.textAlign='center';niv.style.textDecoration='none';niv.style.marginTop='10px';const link=make('a','Read public-domain WEB version','small');link.href='https://ebible.org/engwebp/';link.target='_blank';link.rel='noopener noreferrer';
const download=make('button','Save complete WEB Bible for offline reading','btn secondary');download.type='button';download.style.marginTop='10px';download.disabled=true;const offlineStatus=make('p','Checking saved Bible books…','footer-note');offlineStatus.setAttribute('role','status');offlineStatus.setAttribute('aria-live','polite');async function savedCount(cache){let count=0;for(const code of bookIds){if(await cache.match('./bible-data/'+code+'.json'))count++}return count}
async function checkImport(){try{if(!('caches' in window))throw Error('offline storage unavailable');const cache=await caches.open('clear-bible-webp-v1');const saved=await savedCount(cache);download.disabled=false;if(saved===66){offlineStatus.textContent='All 66 WEB books are saved for offline reading.';return}offlineStatus.textContent=saved+' of 66 WEB books saved. Connect to download the remaining books.'}catch{download.disabled=true;offlineStatus.textContent='Offline storage is unavailable in this browser. You can still read the Bible while connected.'}}
download.onclick=async()=>{download.disabled=true;offlineStatus.textContent='Checking saved Bible books…';let count=0;try{const cache=await caches.open('clear-bible-webp-v1');count=await savedCount(cache);for(const code of bookIds){const url='./bible-data/'+code+'.json';if(await cache.match(url))continue;const response=await fetch(url,{cache:'no-cache'});if(!response.ok)throw Error('Book '+code+' unavailable');const data=await response.clone().json();if(!data||typeof data!=='object'||!data['1'])throw Error('Invalid Bible book '+code);await cache.put(url,response.clone());count++;offlineStatus.textContent='Saved '+count+' of 66 books for offline reading.'}offlineStatus.textContent='All 66 WEB books saved for offline reading.'}catch{offlineStatus.textContent='Saved '+count+' of 66 books. Download paused; reconnect and tap again to resume.'}finally{download.disabled=false}};
const STORAGE='clear-bible-reading-v1';
let personal={last:null,completed:{},bookmarks:{},notes:{}};
try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}');if(saved&&typeof saved==='object'){personal={...personal,...saved};personal.completed=personal.completed||{};personal.bookmarks=personal.bookmarks||{};personal.notes=personal.notes||{};for(const [ref,entry] of Object.entries(personal.bookmarks)){if(entry?.note&&!personal.notes[ref])personal.notes[ref]=entry.note}}}catch{}
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(personal));return true}catch{readingStatus.textContent='Browser storage is unavailable; changes may not be saved.';return false}}
const readingStatus=make('p','','footer-note');readingStatus.setAttribute('role','status');
const personalCard=make('div',undefined,'card');
personalCard.append(make('h2','My Bible reading',''));
const progress=make('p','','muted');
const bookmark=make('button','Bookmark chapter','btn secondary');bookmark.type='button';
const complete=make('button','Mark chapter read','btn secondary');complete.type='button';
const notes=make('textarea',undefined,'input');notes.rows=3;notes.maxLength=3000;notes.placeholder='Private notes about this chapter';notes.setAttribute('aria-label','Private Bible chapter notes');notes.style.width='100%';
const saveNotes=make('button','Save notes','btn secondary');saveNotes.type='button';
const resume=make('button','Continue last chapter','btn secondary');resume.type='button';
const savedList=make('div',undefined,'small');
const currentRef=()=>books[Number(select.value)]+' '+String(Number(chapter.value));
let noteRef=null;function storeDraft(){if(!noteRef)return;const value=notes.value.slice(0,3000);if(value)personal.notes[noteRef]=value;else delete personal.notes[noteRef];persist()}
function showSaved(){
 const ref=currentRef(),valid=!action.disabled;
 const done=Object.keys(personal.completed||{}).length,marks=Object.keys(personal.bookmarks||{}).length;
 progress.textContent=done+' of 1,189 chapters marked read · '+marks+' bookmarks';
 bookmark.disabled=!valid;complete.disabled=!valid;
 bookmark.textContent=personal.bookmarks?.[ref]?'Remove bookmark':'Bookmark chapter';
 complete.textContent=personal.completed?.[ref]?'Mark unread':'Mark chapter read';
 if(noteRef!==ref){storeDraft();notes.value=personal.notes?.[ref]||'';noteRef=ref;}notes.disabled=!valid;saveNotes.disabled=!valid;
 resume.disabled=!personal.last;
 savedList.replaceChildren();
 const items=Object.keys(personal.bookmarks||{}).slice(-12).reverse();
 if(!items.length)savedList.append(make('p','No bookmarked chapters yet.','muted'));
 for(const name of items){const b=make('button',name,'btn secondary tiny');b.type='button';b.style.margin='3px';b.onclick=()=>goToRef(name);savedList.append(b)}
}
function goToRef(ref){storeDraft();const i=books.findIndex(n=>ref.startsWith(n+' '));if(i<0)return;const n=Number(ref.slice(books[i].length+1));if(!Number.isInteger(n)||n<1||n>chapterLimits[i])return;select.value=String(i);chapter.value=String(n);refresh();readChapter()}
bookmark.onclick=()=>{const ref=currentRef();if(personal.bookmarks[ref])delete personal.bookmarks[ref];else personal.bookmarks[ref]={savedAt:new Date().toISOString()};persist();showSaved()};
complete.onclick=()=>{const ref=currentRef();if(personal.completed[ref])delete personal.completed[ref];else personal.completed[ref]=new Date().toISOString();persist();showSaved()};
saveNotes.onclick=()=>{const ref=currentRef(),value=notes.value.slice(0,3000);if(value)personal.notes[ref]=value;else delete personal.notes[ref];readingStatus.textContent=persist()?(value?'Notes saved on this device.':'Notes cleared on this device.'):'Could not save notes. Check browser storage.'};
notes.addEventListener('input',()=>{readingStatus.textContent='Unsaved changes · notes save when you leave this chapter.'});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')storeDraft()});
window.addEventListener('pagehide',storeDraft);
resume.onclick=()=>goToRef(personal.last);
personalCard.append(progress,resume,bookmark,complete,notes,saveNotes,readingStatus,savedList);
const verses=make('div',undefined,'card');let readingToken=0;const lastChapter=make('button','Previous chapter','btn secondary');lastChapter.type='button';const nextChapter=make('button','Next chapter','btn secondary');nextChapter.type='button';const controls=make('div');controls.style.display='flex';controls.style.gap='8px';controls.style.flexWrap='wrap';controls.append(lastChapter,nextChapter);verses.id='bibleVerseContent';const explanation=make('p','Select a book and chapter to read in CLEAR when available, or visit the official Bible source.','footer-note');
async function readChapter(){const token=++readingToken;refresh();if(action.disabled){verses.replaceChildren(make('p','Choose a valid chapter for this book.','muted'));return}const code=bookIds[Number(select.value)],num=String(Number(chapter.value));verses.replaceChildren(make('p','Loading '+books[Number(select.value)]+' '+num+'…','muted'));try{let response;try{response=await fetch('./bible-data/'+code+'.json');if(!response.ok)throw Error('network unavailable')}catch{response=await (await caches.open('clear-bible-webp-v1')).match('./bible-data/'+code+'.json');if(!response)throw Error('Bible book not saved for offline reading')}const data=await response.json();if(token!==readingToken)return;const chapterVerses=data[num];if(!chapterVerses)throw Error('chapter unavailable');verses.replaceChildren(make('h2',books[Number(select.value)]+' '+num));personal.last=books[Number(select.value)]+' '+num;persist();showSaved();for(const [verse,body] of Object.entries(chapterVerses)){const line=make('p',verse+'  '+body,'bible-verse');line.style.lineHeight='1.8';verses.append(line)}}catch{if(token!==readingToken)return;verses.replaceChildren(make('p','This chapter is not available offline yet. Connect to the internet or save the complete WEB Bible using the button above.','muted'))}}
function refresh(){const i=Number(select.value),n=Number(chapter.value);chapter.max=String(chapterLimits[i]||1);niv.href='https://www.biblegateway.com/passage/?search='+encodeURIComponent(books[i]+' '+n)+'&version=NIV';const good=Number.isInteger(i)&&i>=0&&i<66&&Number.isInteger(n)&&n>=1&&n<=chapterLimits[i];action.disabled=!good;lastChapter.disabled=!good||(i===0&&n===1);nextChapter.disabled=!good||(i===65&&n===chapterLimits[65]);explanation.textContent=good?'Selected: '+books[i]+' '+n+'. Read the public-domain WEB text below or open the NIV through BibleGateway.':'Choose a valid chapter number.'}
action.textContent='Read chapter inside CLEAR';action.onclick=()=>{if(!action.disabled)readChapter()};
function navigate(delta){storeDraft();let idx=Number(select.value),ch=Number(chapter.value)+delta;const limits=chapterLimits;if(delta>0&&ch>limits[idx]){if(idx===65)return;idx++;ch=1}else if(delta<0&&ch<1){if(idx===0)return;idx--;ch=limits[idx]}select.value=String(idx);chapter.value=String(ch);refresh();readChapter()};lastChapter.onclick=()=>navigate(-1);nextChapter.onclick=()=>navigate(1);select.onchange=()=>{storeDraft();chapter.value='1';refresh();showSaved();readChapter()};chapter.onchange=()=>{storeDraft();refresh();showSaved();readChapter()};chapter.oninput=()=>{refresh();showSaved()};chooser.append(niv,action,download,offlineStatus,explanation,link);page.append(chooser,personalCard,controls,verses);app.append(page);if(personal.last){const i=books.findIndex(n=>personal.last.startsWith(n+' '));const n=i>=0?Number(personal.last.slice(books[i].length+1)):0;if(i>=0&&n>=1&&n<=chapterLimits[i]){select.value=String(i);chapter.value=String(n)}}refresh();showSaved();checkImport();readChapter();
const tab=make('button');tab.type='button';tab.innerHTML='<strong>▤</strong>Bible';tab.dataset.tab='bibleLibrary';nav.append(tab);const settingsTab=nav.querySelector('button[data-tab="settings"]');if(settingsTab)nav.append(settingsTab);nav.style.gridTemplateColumns='repeat(5,minmax(0,1fr))';
tab.onclick=()=>{document.querySelectorAll('.page').forEach(p=>p.classList.toggle('hide',p!==page));document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b===tab));window.scrollTo(0,0)};
document.querySelectorAll('.nav button').forEach(b=>{if(b!==tab)b.addEventListener('click',()=>{page.classList.add('hide');tab.classList.remove('active')})});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();