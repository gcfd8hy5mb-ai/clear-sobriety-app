// Explicitly invoked only after the deployment owner enables the worker.
// No scheduler starts automatically when this module is imported.
import webpush from 'web-push';
import {allDevices,sent,markSent,deleteDevice,prune} from './storage.js';
import {dueWindows} from './scheduler.js';
export async function dispatch(now=Date.now()){
 let attempted=0,delivered=0,errors=0;
 for(const device of allDevices()){
  for(const hit of dueWindows(device.windows,device.timezone,now,device.leadMinutes??30,2)){
   const id=hit.key+'|'+device.timezone;
   if(sent(device.id,id))continue;
   attempted++;
   try{
    await webpush.sendNotification(device.sub,JSON.stringify({title:'A little check-in',body:'Take a moment for yourself. CLEAR is here if you need it.',url:'/clear-sobriety-app/'}),{TTL:1800});
    markSent(device.id,id);delivered++;
   }catch(err){
    errors++;
    if(err.statusCode===404||err.statusCode===410)deleteDevice(device.id);
   }
  }
 }
 prune();return {attempted,delivered,errors};
}
