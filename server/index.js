// CLEAR push service prototype. Requires Node 20+, TLS reverse proxy and persistent DB before production.
// No secrets or real subscriptions belong in GitHub.
import http from 'node:http';
import crypto from 'node:crypto';
import webpush from 'web-push';
import {nextOccurrence} from './scheduler.js';
const port=Number(process.env.PORT||8787);
const publicKey=process.env.VAPID_PUBLIC_KEY,privateKey=process.env.VAPID_PRIVATE_KEY;
const contact=process.env.VAPID_SUBJECT;
if(!publicKey||!privateKey||!contact)throw Error('Missing private VAPID config.');
webpush.setVapidDetails(contact,publicKey,privateKey);
// This memory store intentionally cannot provide real background scheduling or survive restarts.
// Replace with durable encrypted data storage and access controls before accepting live user subscriptions.
const records=new Map();
const reply=(res,status,obj)=>{res.writeHead(status,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify(obj))};
const read=async req=>{let s='';for await(const c of req){s+=c;if(s.length>16000)throw Error('Payload too large')}return JSON.parse(s||'{}')};
const safe=(val,min,max)=>Number.isInteger(val)&&val>=min&&val<=max;
const server=http.createServer(async(req,res)=>{
try{
const url=new URL(req.url,'http://local');
if(req.method==='GET'&&url.pathname==='/health')return reply(res,200,{ok:true,mode:'prototype',persistent:false});
if(req.method==='GET'&&url.pathname==='/public-key')return reply(res,200,{publicKey});
if(!['/device','/schedule'].includes(url.pathname)||!['POST','DELETE','GET'].includes(req.method))return reply(res,404,{error:'Not found'});
// A token proves access only to its random per-device record; do not use it as user identity.
// For production add strict origin checks, abuse throttles, TLS, authentication and durable storage.
const token=req.headers.authorization?.replace(/^Bearer /,'');
if(!token||!/^[a-f0-9]{64}$/.test(token))return reply(res,401,{error:'Device token required'});
const id=crypto.createHash('sha256').update(token).digest('hex');
if(url.pathname==='/schedule'&&req.method==='GET'){const rec=records.get(id);if(!rec)return reply(res,404,{error:'Device not registered'});return reply(res,200,{scheduled:false,preview:rec.windows.map(w=>nextOccurrence(w,rec.timezone,Date.now(),rec.leadMinutes||30)).filter(Boolean).map(v=>({sendAt:new Date(v.sendAt).toISOString(),targetAt:new Date(v.targetAt).toISOString()}))})}
if(url.pathname!=='/device')return reply(res,405,{error:'Method not allowed'});
if(req.method==='DELETE'){records.delete(id);return reply(res,200,{deleted:true})}
const data=await read(req);
const sub=data.subscription;
if(!sub||typeof sub.endpoint!=='string'||!sub.endpoint.startsWith('https://')||!sub.keys?.p256dh||!sub.keys?.auth)return reply(res,400,{error:'Invalid push subscription'});
const windows=data.windows;
if(!Array.isArray(windows)||windows.length>4||!windows.every(w=>safe(w.weekday,0,6)&&safe(w.hour,0,23)&&safe(w.minute,0,59)))return reply(res,400,{error:'Invalid schedule'});
const timezone=data.timezone;
if(typeof timezone!=='string'||timezone.length>80)return reply(res,400,{error:'Timezone required'});
try{new Intl.DateTimeFormat('en-US',{timeZone:timezone})}catch{return reply(res,400,{error:'Invalid timezone'})}
const leadMinutes=data.leadMinutes===undefined?30:data.leadMinutes;
if(!safe(leadMinutes,0,120))return reply(res,400,{error:'Invalid warning lead time'});
records.set(id,{sub,windows,timezone,leadMinutes,updatedAt:Date.now()});
return reply(res,200,{registered:true,persistent:false,scheduled:false});
}catch(e){return reply(res,400,{error:'Invalid request'})}
});
server.listen(port,()=>console.log('CLEAR prototype service listening on',port));