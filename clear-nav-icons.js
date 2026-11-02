/* Unified lightweight outlined icons for CLEAR bottom navigation. */
(()=>{'use strict';
const paths={
home:'<path d="m3 10 9-7 9 7v11H3V10Z"/><path d="M9 21v-7h6v7"/>',
insights:'<path d="M12 22V11"/><path d="M12 14C7 14 4 11 4 6c5 0 8 3 8 8Z"/><path d="M12 17c0-5 3-8 8-8 0 5-3 8-8 8Z"/>',
course:'<path d="m2 9 10-5 10 5-10 5-10-5Z"/><path d="M6 11v6c4 3 8 3 12 0v-6"/><path d="M22 9v8"/>',
bibleLibrary:'<path d="M12 21c-3-2-7-3-10-2V4c4-1 8 0 10 2 2-2 6-3 10-2v15c-3-1-7 0-10 2Z"/><path d="M12 6v15"/>',
settings:'<circle cx="12" cy="12" r="3"/><path d="M10 2h4l.7 2.5 2 1.1 2.5-.8 2 3.4-1.9 1.8v2.3l1.9 1.8-2 3.4-2.5-.8-2 1.1L14 22h-4l-.7-2.5-2-1.1-2.5.8-2-3.4 1.9-1.8v-2.3L2.8 9.9l2-3.4 2.5.8 2-1.1L10 2Z"/>'
};
function apply(){document.querySelectorAll('.nav-inner button[data-tab]').forEach(button=>{const path=paths[button.dataset.tab];if(!path)return;const strong=button.querySelector('strong');if(!strong)return;strong.innerHTML='<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+path+'</svg>';strong.style.display='grid';strong.style.placeItems='center';strong.style.height='25px';if(button.dataset.tab==='bibleLibrary')button.lastChild.textContent='Bible'})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{apply();setTimeout(apply,0)});else{apply();setTimeout(apply,0)}
})();