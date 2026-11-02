/* CLEAR Bible reader groundwork. Whole WEBP text not yet bundled. */
(()=>{'use strict';
const books=['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'];
const bookIds=['GEN','EXO','LEV','NUM','DEU','JOS','JDG','RUT','1SA','2SA','1KI','2KI','1CH','2CH','EZR','NEH','EST','JOB','PSA','PRO','ECC','SNG','ISA','JER','LAM','EZK','DAN','HOS','JOL','AMO','OBA','JON','MIC','NAM','HAB','ZEP','HAG','ZEC','MAL','MAT','MRK','LUK','JHN','ACT','ROM','1CO','2CO','GAL','EPH','PHP','COL','1TH','2TH','1TI','2TI','TIT','PHM','HEB','JAS','1PE','2PE','1JN','2JN','3JN','JUD','REV'];
const $=id=>document.getElementById(id);
const make=(tag,text,cls)=>{let x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(cls)x.className=cls;return x};
function init(){
const app=document.querySelector('main.app'),nav=document.querySelector('.nav-inner');if(!app||!nav)return;
const page=make('section',undefined,'page hide');page.id='bibleLibrary';page.append(make('div','Scripture library','eyebrow'),make('h1','Read the Bible','title'));
page.append(make('p','The complete 66-book Protestant canon is indexed here. Full offline verse text is not yet imported. You can open a book in the official public-domain World English Bible reader.','muted'));
const chooser=make('div',undefined,'card');
const select=make('select',undefined,'input');select.setAttribute('aria-label','Bible book');
books.forEach((name,i)=>{const opt=make('option',name);opt.value=String(i);select.append(opt)});chooser.append(select);
const chapter=make('input',undefined,'input');chapter.type='number';chapter.min='1';chapter.max='150';chapter.value='1';chapter.setAttribute('aria-label','Chapter');chooser.append(chapter);
const action=make('button','Open in official WEB reader','btn');action.type='button';
const link=make('a','Official World English Bible','small');link.href='https://ebible.org/engwebp/';link.target='_blank';link.rel='noopener noreferrer';
const explanation=make('p','Select a book and chapter. While the Bible text import is pending, links open the verified public-domain Bible site.','footer-note');
function refresh(){const i=Number(select.value),n=Number(chapter.value);const good=Number.isInteger(n)&&n>=1&&n<=150&&Number.isInteger(i)&&i>=0&&i<66;action.disabled=!good;explanation.textContent=good?'Selected: '+books[i]+' '+n+'. External Bible reader opens at the book; select the chapter there.':'Choose a valid chapter number.'}
action.onclick=()=>{if(action.disabled)return;window.open('https://ebible.org/engwebp/'+bookIds[Number(select.value)]+'.htm','_blank','noopener,noreferrer')};
select.onchange=refresh;chapter.oninput=refresh;chooser.append(action,explanation,link);page.append(chooser);app.append(page);refresh();
const tab=make('button');tab.type='button';tab.innerHTML='<strong>▤</strong>Library';tab.dataset.tab='bibleLibrary';nav.append(tab);nav.style.gridTemplateColumns='repeat(7,minmax(0,1fr))';
tab.onclick=()=>{document.querySelectorAll('.page').forEach(p=>p.classList.toggle('hide',p!==page));document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b===tab));window.scrollTo(0,0)};
document.querySelectorAll('.nav button').forEach(b=>{if(b!==tab)b.addEventListener('click',()=>{page.classList.add('hide');tab.classList.remove('active')})});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();