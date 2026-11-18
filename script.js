(()=> {
'use strict';
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const brl=n=>'R$ '+Math.round(n).toLocaleString('pt-BR');
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
addEventListener('scroll',()=>{
 if(ticking)return;ticking=true;
 requestAnimationFrame(()=>{
  const doc=document.documentElement;
  const max=doc.scrollHeight-doc.clientHeight;
  if(progress)progress.style.width=(max>0?doc.scrollTop/max*100:0)+'%';
  ticking=false;
 });
},{passive:true});
const inputIn=$('#in'),inputOut=$('#out'),saldo=$('#saldo'),status=$('#status');
const calc=()=>{
 if(!inputIn||!inputOut||!saldo)return;
 const incoming=Math.max(0,Number(inputIn.value)||0);
 const outgoing=Math.max(0,Number(inputOut.value)||0);
 const result=incoming-outgoing;
 saldo.textContent=brl(result);
 if(status)status.textContent=result>0?'Resultado positivo neste exemplo':result<0?'Atenção: saídas maiores que entradas':'Entradas e saídas estão iguais';
};
if(inputIn&&inputOut){inputIn.addEventListener('input',calc);inputOut.addEventListener('input',calc);calc();}
const roi=()=>{
 const ids=['r1','r2','r3'];
 const vals=ids.map((id,index)=>{
  const el=$('#'+id);if(!el)return 0;
  const out=$('#o'+(index+1));if(out)out.textContent=el.value;
  return Number(el.value)||0;
 });
 const [people,hours,cost]=vals;
 const total=people*hours*cost*52;
 const result=$('#roiv');if(result)result.textContent=brl(total);
};
$$('#roi input[type="range"]').forEach(el=>el.addEventListener('input',roi));roi();
const year=$('#ano');if(year)year.textContent=new Date().getFullYear();
const buy=$('#buy-button');
if(buy){
 buy.addEventListener('click',event=>{
  event.preventDefault();
  alert('O checkout ainda não foi conectado. Envie o link oficial da Hotmart para ativar a compra.');
 });
}
const wa=$('#wa-link');
if(wa){
 wa.addEventListener('click',event=>{
  event.preventDefault();
  alert('O contato comercial ainda não foi configurado.');
 });
}
})();