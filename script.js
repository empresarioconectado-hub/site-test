(()=> {
'use strict';
const KIWIFY_CHECKOUT_URL = 'https://pay.kiwify.com.br/kGaCJmL';
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const brl=n=>'R$ '+Math.round(n).toLocaleString('pt-BR');

function trackEvent(eventName, params={}) {
  try {
    if (typeof window.fbq === 'function') window.fbq('track', eventName, params);
    if (typeof window.gtag === 'function') window.gtag('event', eventName, params);
  } catch (_) {}
}
function checkoutUrl() {
  return KIWIFY_CHECKOUT_URL;
}
const burger=$('#burger'),nav=$('#nav');
if(burger&&nav){
 burger.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  burger.setAttribute('aria-expanded',String(open));
  burger.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
 });
 $$('a',nav).forEach(a=>a.addEventListener('click',()=>{
  nav.classList.remove('open');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Abrir menu');
 }));
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&nav.classList.contains('open')){
   nav.classList.remove('open');burger.setAttribute('aria-expanded','false');burger.focus();
  }
 });
}
const progress=$('#progress');
let ticking=false;
window.addEventListener('scroll',()=>{
 if(ticking)return;ticking=true;
 requestAnimationFrame(()=>{
  const doc=document.documentElement,max=doc.scrollHeight-doc.clientHeight;
  if(progress)progress.style.width=(max>0?doc.scrollTop/max*100:0)+'%';
  ticking=false;
 });
},{passive:true});

const inputIn=$('#in'),inputOut=$('#out'),saldo=$('#saldo'),status=$('#status');
const calc=()=>{
 if(!inputIn||!inputOut||!saldo)return;
 const incoming=Math.max(0,Number(inputIn.value)||0),outgoing=Math.max(0,Number(inputOut.value)||0),result=incoming-outgoing;
 saldo.textContent=brl(result);
 if(status)status.textContent=result>0?'Resultado positivo neste exemplo':result<0?'Atenção: saídas maiores que entradas':'Entradas e saídas estão iguais';
};
if(inputIn&&inputOut){
 [inputIn,inputOut].forEach(el=>el.addEventListener('input',calc));
 calc();
}
const roi=()=>{
 const vals=['r1','r2','r3'].map((id,index)=>{
  const el=$('#'+id);if(!el)return 0;
  const out=$('#o'+(index+1));if(out)out.textContent=el.value;
  return Number(el.value)||0;
 });
 const [people,hours,cost]=vals,result=$('#roiv');
 if(result)result.textContent=brl(people*hours*cost*52);
};
$$('#roi input[type="range"]').forEach(el=>el.addEventListener('input',roi));
roi();
const year=$('#ano');if(year)year.textContent=new Date().getFullYear();

// Contagem da sessão: não cria escassez nem altera preço/checkout ao zerar.
const countdown=$('#session-countdown');
if(countdown){
 const key='prumo_session_deadline_v1';
 let deadline=0;
 try{
  deadline=Number(sessionStorage.getItem(key))||0;
  if(!deadline){
   deadline=Date.now()+15*60*1000;
   sessionStorage.setItem(key,String(deadline));
  }
 }catch(_){deadline=Date.now()+15*60*1000;}
 const updateTimer=()=>{
  const remaining=Math.max(0,deadline-Date.now());
  const seconds=Math.ceil(remaining/1000);
  countdown.textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
  if(remaining===0){
   const label=$('.session-timer small');
   if(label)label.textContent='Contagem encerrada. A oferta continua disponível por R$ 197.';
   clearInterval(timer);
  }
 };
 updateTimer();
 const timer=setInterval(updateTimer,1000);
}

// Prévia acessível: restaura foco e mantém o scroll somente enquanto o modal está aberto.
const modal=$('#preview-modal'),previewTabs=$$('[data-preview-tab]');
let lastFocused=null;
function setPreview(tab){
 previewTabs.forEach(button=>{
  const active=button.dataset.previewTab===tab;
  button.setAttribute('aria-selected',String(active));
  button.tabIndex=active?0:-1;
  const panel=$('#panel-'+button.dataset.previewTab);
  if(panel)panel.hidden=!active;
 });
}
function openPreview(tab){
 if(!modal)return;
 lastFocused=document.activeElement;
 setPreview(tab||'cash');
 modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');
 document.body.classList.add('modal-open');
 $('[data-preview-tab][aria-selected="true"]')?.focus();
 trackEvent('PreviewOpened',{spreadsheet:tab||'cash'});
}
function closePreview(){
 if(!modal)return;
 modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');
 document.body.classList.remove('modal-open');
 lastFocused?.focus();
}
$$('[data-preview]').forEach(button=>button.addEventListener('click',()=>openPreview(button.dataset.preview)));
previewTabs.forEach(button=>button.addEventListener('click',()=>setPreview(button.dataset.previewTab)));
$$('[data-close-preview]').forEach(button=>button.addEventListener('click',closePreview));
document.addEventListener('keydown',event=>{
 if(!modal?.classList.contains('is-open'))return;
 if(event.key==='Escape'){closePreview();return;}
 if(event.key==='Tab'){
  const focusable=$$('button:not([disabled]),a[href],input:not([disabled]),[tabindex="0"]',modal).filter(el=>el.offsetParent!==null);
  if(!focusable.length)return;
  const first=focusable[0],last=focusable[focusable.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 }
});

// CTA: navega direto quando a URL real estiver configurada; caso contrário, conduz à oferta sem simular checkout.
const destination=checkoutUrl();
$$('[data-buy]').forEach(button=>{
 if(destination){button.href=destination;button.target='_blank';button.rel='noopener noreferrer';}
 button.addEventListener('click',event=>{
  trackEvent('InitiateCheckout',{content_name:'Pacote Prumo de Planilhas',currency:'BRL',value:197});
  if(!destination){
   event.preventDefault();
   $('#oferta')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
   $('#checkout-status')?.focus?.();
  }
 });
});
if(destination){
 const note=$('#checkout-status');
 if(note)note.textContent='Você será direcionado ao checkout da Kiwify.';
}
})();