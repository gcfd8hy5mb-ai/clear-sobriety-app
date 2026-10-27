import {allDevices,sent,prune} from './storage.js';
import {dueWindows} from './scheduler.js';

// Read-only dry run: preview reminders that would be due.
// Actual push sending requires a separate secured deployment and explicit opt-in.
export function previewDue(now=Date.now()){
  const due=[];
  for(const device of allDevices()){
    for(const event of dueWindows(device.windows,device.timezone,now,device.leadMinutes??30,2)){
      if(!sent(device.id,event.key+'|'+device.timezone)){
        due.push({deviceId:device.id,sendAt:new Date(event.sendAt).toISOString()});
      }
    }
  }
  prune();
  return due;
}
