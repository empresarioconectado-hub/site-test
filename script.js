(()=>{
'use strict';
const KIRVANO_CHECKOUT_URL = '#oferta';
const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content'];
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const brl=n=>'R$ '+Math.round(n).toLocaleString('pt-BR');

function trackEvent(eventName, params={}) {
  try {
    if (typeof window.fbq === 'function') window.fbq('track', eventName, params);
    if (typeof window.gtag === 'function') window.gtag('event', eventName, params);
  } catch (error) { console.warn('Falha ao enviar evento de analytics:', error); }
}

function checkoutUrl() {
  if (KIRVANO_CHECKOUT_URL === '#oferta' || KIRVANO_CHECKOUT_URL.startsWith('#')) return KIRVANO_CHECKOUT_URL;
  try {
    const target = new URL(KIRVANO_CHECKOUT_URL, window.location.href);
    const current = new URL(window.location.href);
    UTM_KEYS.forEach(key => {
      const value = current.searchParams.get(key);
      if (value) target.searchParams.set(key, value);
    });
    return target.toString();
  } catch (error) {
    return KIRVANO_CHECKOUT_URL;
  }
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
 [inputIn,inputOut].forEach(el=>el.addEventListener('input',()=>{
  calc();
  trackEvent('CashSimulatorChange',{incoming:Number(inputIn.value)||0,outgoing:Number(inputOut.value)||0,balance:(Number(inputIn.value)||0)-(Number(inputOut.value)||0)});
 }));
 calc();
}
const roi=()=>{
 const ids=['r1','r2','r3'];
 const vals=ids.map((id,index)=>{
  const el=$('#'+id);if(!el)return 0;
  const out=$('#o'+(index+1));if(out)out.textContent=el.value;
  return Number(el.value)||0;
 });
 const [people,hours,cost]=vals,total=people*hours*cost*52,result=$('#roiv');
 if(result)result.textContent=brl(total);
};
$$('#roi input[type="range"]').forEach(el=>el.addEventListener('input',()=>{
 roi();
 trackEvent('ROICalculatorChange',{people:Number($('#r1')?.value)||0,hoursPerWeek:Number($('#r2')?.value)||0,hourlyCost:Number($('#r3')?.value)||0,annualTimeValue:(Number($('#r1')?.value)||0)*(Number($('#r2')?.value)||0)*(Number($('#r3')?.value)||0)*52});
}));
roi();
const year=$('#ano');if(year)year.textContent=new Date().getFullYear();

const modal=$('#preview-modal');
const previewTabs=$$('[data-preview-tab]');
function setPreview(tab){
 previewTabs.forEach(button=>{
  const active=button.dataset.previewTab===tab;
  button.setAttribute('aria-selected',String(active));
  const panel=$('#panel-'+button.dataset.previewTab);
  if(panel)panel.hidden=!active;
 });
}
function openPreview(tab){
 if(!modal)return;
 setPreview(tab||'cash');
 modal.classList.add('is-open');
 modal.setAttribute('aria-hidden','false');
 document.body.classList.add('modal-open');
 const selected=$('[data-preview-tab="'+(tab||'cash')+'"]');
 if(selected)selected.focus();
 trackEvent('PreviewOpened',{spreadsheet:tab||'cash'});
}
function closePreview(){
 if(!modal)return;
 modal.classList.remove('is-open');
 modal.setAttribute('aria-hidden','true');
 document.body.classList.remove('modal-open');
}
$$('[data-preview]').forEach(button=>button.addEventListener('click',()=>openPreview(button.dataset.preview)));
previewTabs.forEach(button=>button.addEventListener('click',()=>setPreview(button.dataset.previewTab)));
$$('[data-close-preview]').forEach(button=>button.addEventListener('click',closePreview));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&modal?.classList.contains('is-open'))closePreview();});

$$('[data-buy]').forEach(button=>button.addEventListener('click',event=>{
 const destination=checkoutUrl();
 trackEvent('InitiateCheckout',{content_name:'Pacote Prumo de Planilhas',currency:'BRL',value:197});
 if(destination==='#oferta'||destination.startsWith('#')){
  event.preventDefault();
  $('#oferta')?.scrollIntoView({behavior:'smooth',block:'center'});
  return;
 }
 button.href=destination;
}));
})();