/* CLEAR remote push enrollment. Inactive unless a secure backend has been configured.
   Personal journals stay on this device; only opt-in coarse time windows are sent. */
(()=>{
'use strict';
const ID='clear-push-device-v1';
const $=id=>document.getElementById(id);
const SERVER_URL=''; // Deliberately unset. NEVER add private secrets to this public repository.
function status(msg){const n=$('remotePushStatus');if(n)n.textContent=msg}
function getState(){try{return JSON.parse(localStorage.getItem('clear-v1')||'{}')}catch{return {}}}
function windows(){
 const bins=new Map();
 for(const e of (getState().entries||[])){
  if(Number(e.intensity)<2)continue;
  const when=new Date(e.time);
  if(Number.isNaN(when.getTime())||Date.now()-when.getTime()>90*86400000)continue;
  const k=when.getDay()+'-'+when.getHours();
  const v=bins.get(k)||{weekday:when.getDay(),hour:when.getHours(),minute:0,days:new Set(),score:0};
  v.days.add(when.toDateString());v.score+=Number(e.intensity);bins.set(k,v);
 }
 return [...bins.values()].filter(x=>x.days.size>=2).sort((a,b)=>b.score-a.score).slice(0,3).map(({weekday,hour,minute})=>({weekday,hour,minute}));
}
function hex(bytes){return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('')}
function vapidBytes(base64){const b=atob(base64.replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(b,c=>c.charCodeAt(0))}
async function send(path,token,payload,method='POST'){
 const r=await fetch(SERVER_URL+path,{method,headers:{'authorization':'Bearer '+token,...(payload?{'content-type':'application/json'}:{})},body:payload?JSON.stringify(payload):undefined});
 if(!r.ok)throw Error('Server request failed ('+r.status+')');
 return r.json();
}
async function enroll(){
 if(!SERVER_URL){status('Background notifications are not connected yet. Your manual test notifications still work.');return}
 if(!window.isSecureContext||!('serviceWorker'in navigator)||!('PushManager'in window)||!('Notification'in window)){status('Web push is not available on this device.');return}
 if(Notification.permission!=='granted'){status('Enable notifications in CLEAR first.');return}
 const available=windows();
 if(!available.length){status('CLEAR needs repeated reported craving windows before it can schedule reminders.');return}
 if(!confirm('Enable background reminders? This shares only up to three craving times and your time zone with the configured notification server.'))return;
 try{
  const {publicKey}=await (await fetch(SERVER_URL+'/public-key',{cache:'no-store'})).json();
  const reg=await navigator.serviceWorker.ready;
  const sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:vapidBytes(publicKey)});
  let token=sessionStorage.getItem(ID);
  if(!token){token=hex(crypto.getRandomValues(new Uint8Array(32)));sessionStorage.setItem(ID,token)}
  const state=getState();
  const response=await send('/device',token,{subscription:sub.toJSON(),windows:available,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,leadMinutes:Math.min(120,Math.max(0,Number(state.lead)||30))});
  status(response.scheduled?'Background reminders enabled.':'Subscription registered, but background scheduling is not active yet.');
 }catch(e){status('Registration did not complete: '+String(e.message||e))}
}
async function disconnect(){
 if(!confirm('Disconnect this device from future background reminders?'))return;
 try{
  const token=sessionStorage.getItem(ID);
  if(SERVER_URL&&token)await send('/device',token,null,'DELETE');
  if('serviceWorker'in navigator){const reg=await navigator.serviceWorker.ready;const sub=await reg.pushManager.getSubscription();if(sub)await sub.unsubscribe()}
  sessionStorage.removeItem(ID);
  status('Local push subscription disconnected.' );
 }catch(e){status('Could not confirm server removal: '+String(e.message||e))}
}
function init(){
 const settings=$('settings');if(!settings)return;
 const div=document.createElement('div');div.className='card';
 div.innerHTML='<h2>Background reminders</h2><p class="small muted" id="remotePushStatus" role="status"></p><button class="btn secondary" type="button" id="remotePushEnroll">Connect background reminders</button><button class="btn secondary" type="button" style="margin-top:10px" id="remotePushDisconnect">Disconnect this device</button><p class="footer-note">Not active until a secure notification server is configured. Your journal is not uploaded. Any eventual connection requires your permission.</p>';
 settings.append(div);
 $('remotePushEnroll').addEventListener('click',enroll);
 $('remotePushDisconnect').addEventListener('click',disconnect);
 status('Not connected. Automatic alerts while CLEAR is closed are still unavailable.');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();