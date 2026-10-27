// Pure scheduling calculations. All times stored and compared as UTC instants.
// Weekday values: Sun=0 ... Sat=6. Missing DST local times are skipped;
// repeated fall-back local times resolve to their first occurrence only.
const msMinute=60000;
export function parts(instant,timeZone){
 const tokens=new Intl.DateTimeFormat('en-US',{timeZone,weekday:'short',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(instant));
 const v=Object.fromEntries(tokens.map(t=>[t.type,t.value]));
 return {day:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(v.weekday),date:`${v.year}-${v.month}-${v.day}`,hour:Number(v.hour),minute:Number(v.minute)};
}
export function nextOccurrence({weekday,hour,minute=0},timezone,from=Date.now(),leadMinutes=30){
 if(!Number.isInteger(weekday)||weekday<0||weekday>6||!Number.isInteger(hour)||hour<0||hour>23||!Number.isInteger(minute)||minute<0||minute>59)throw Error('Invalid pattern');
 if(!Number.isInteger(leadMinutes)||leadMinutes<0||leadMinutes>120)throw Error('Invalid lead');
 // Search local calendar-minute matches for a week plus a DST transition day.
 // First match represents the earliest valid occurrence, including the first of repeated fall hours.
 const floor=Math.floor(from/msMinute)*msMinute;
 const horizon=floor+9*24*60*msMinute;
 const seen=new Set();
 for(let utc=floor;utc<horizon;utc+=msMinute){
  const local=parts(utc,timezone);
  if(local.day!==weekday||local.hour!==hour||local.minute!==minute)continue;
  const localKey=local.date+' '+hour+':'+minute;
  if(seen.has(localKey))continue;
  seen.add(localKey);
  const sendAt=utc-leadMinutes*msMinute;
  if(sendAt<from)continue;
  return {sendAt,targetAt:utc,key:localKey,timezone};
 }
 return null;
}
export function dueWindows(windows,timezone,now=Date.now(),leadMinutes=30,graceMinutes=2){
 return windows.flatMap(w=>{
  // Search from just before now so an alert isn't lost because the periodic job started seconds late.
  const hit=nextOccurrence(w,timezone,now-(graceMinutes+1)*msMinute,leadMinutes);
  return hit&&hit.sendAt<=now&&now-hit.sendAt<=graceMinutes*msMinute?[hit]:[];
 });
}
