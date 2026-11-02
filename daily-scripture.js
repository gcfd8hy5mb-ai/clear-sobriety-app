/* One source of truth for the Home and Daily Bible Study reading. */
(()=>{'use strict';
function readings(){const all=[...(window.CLEAR_STUDY_V1?.daily||[]),...(window.CLEAR_DAILY_EXPANDED_V1||[]),...(window.CLEAR_DAILY_BATCH_02||[]),...(window.CLEAR_DAILY_BATCH_03||[]),...(window.CLEAR_DAILY_BATCH_04||[]),...(window.CLEAR_DAILY_BATCH_05||[])];const seen=new Set();return all.filter(x=>{if(!x||!x.scripture||!x.title)return false;if(x.scripture==='Psalm 23')x={...x,scripture:'Psalm 23:1-6'};if(seen.has(x.scripture))return false;seen.add(x.scripture);return true}).map(x=>x.scripture==='Psalm 23'?{...x,scripture:'Psalm 23:1-6'}:x)}
function today(date=new Date()){const list=readings();if(!list.length)return null;const ordinal=Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000);return list[((ordinal%list.length)+list.length)%list.length]}
window.CLEAR_DailyScripture={today,readings};
})();