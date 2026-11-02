/* One source of truth for the Home and Daily Bible Study reading. */
(()=>{'use strict';
function readings(){const all=[...(window.CLEAR_STUDY_V1?.daily||[]),...(window.CLEAR_DAILY_EXPANDED_V1||[]),...(window.CLEAR_DAILY_BATCH_02||[])];const seen=new Set();return all.filter(x=>{if(!x||!x.scripture||!x.title||seen.has(x.scripture))return false;seen.add(x.scripture);return true})}
function today(date=new Date()){const list=readings();if(!list.length)return null;const ordinal=Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000);return list[((ordinal%list.length)+list.length)%list.length]}
window.CLEAR_DailyScripture={today,readings};
})();