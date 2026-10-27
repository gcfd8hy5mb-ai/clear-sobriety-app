// CLEAR reminder worker entry point. Default is dry-run; real sends require explicit gate.
import {previewDue} from './job-preview.js';
const send=process.argv.includes('--send');
if(!send){
 const due=previewDue();
 console.log(JSON.stringify({mode:'dry-run',dueCount:due.length,notificationsSent:0},null,2));
}else{
 if(process.env.CLEAR_ALLOW_DELIVERY!=='yes')throw Error('Real sends disabled. Set CLEAR_ALLOW_DELIVERY=yes only after deployment and explicit device opt-in.');
 if(!process.env.VAPID_PUBLIC_KEY||!process.env.VAPID_PRIVATE_KEY||!process.env.VAPID_SUBJECT)throw Error('Missing push credentials');
 const webpush=(await import('web-push')).default;
 webpush.setVapidDetails(process.env.VAPID_SUBJECT,process.env.VAPID_PUBLIC_KEY,process.env.VAPID_PRIVATE_KEY);
 const {dispatch}=await import('./dispatch.js');
 const counts=await dispatch();
 console.log(JSON.stringify({mode:'send',...counts},null,2));
}
