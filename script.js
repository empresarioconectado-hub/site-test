(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const brl=n=>'R$ '+Math.round(n).toLocaleString('pt-BR');
// menu mobile
const b=$('#burger'),nav=$('#nav');
b.onclick=()=>b.setAttribute('aria-expanded',nav.classList.toggle('open'));
$$('a',nav).forEach(a=>a.onclick=()=>{nav.classList.remove('open');b.setAttribute('aria-expanded',false)});
// progresso de rolagem
addEventListener('scroll',()=>{const h=document.documentElement;$('#progress').style.width=h.scrollTop/(h.scrollHeight-h.clientHeight)*100+'%'},{passive:true});
// contagem regressiva (reinicia em 24h, salva localmente)
let end=+localStorage.getItem('end');if(!end||end<Date.now()){end=Date.now()+864e5;localStorage.setItem('end',end)}
const p=n=>String(n).padStart(2,'0');
setInterval(()=>{const s=Math.max(0,(end-Date.now())/1e3|0);$('#countdown').textContent=`${p(s/3600|0)}:${p(s%3600/60|0)}:${p(s%60)}`},1e3);
// planilha demo
const calc=()=>{const i=+$('#in').value||0,o=+$('#out').value||0;$('#saldo').textContent=brl(i-o);$('#margem').textContent=(i?Math.round((i-o)/i*100):0)+'%'};
$('#in').oninput=$('#out').oninput=calc;calc();
// contadores animados
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);const el=e.target;
 if(el.dataset.count){const T=+el.dataset.count,d=+el.dataset.dec||0,t0=performance.now();
 const f=t=>{const k=Math.min(1,(t-t0)/1200);el.textContent=(T*k).toFixed(d).replace('.',',');k<1&&requestAnimationFrame(f)};requestAnimationFrame(f)}
 else el.classList.add('in')}),{threshold:.3});
$$('[data-count]').forEach(e=>io.observe(e));
$$('.sec .card,.sec h2').forEach(e=>{e.classList.add('reveal');io.observe(e)});
// calculadora de economia
const roi=()=>{const[a,h,c]=['r1','r2','r3'].map(i=>{const e=$('#'+i);$('#o'+i[1]).textContent=e.value;return+e.value});
 $('#roiv').textContent=brl(a*h*c*52*.6)};
$$('#roi input').forEach(i=>i.oninput=roi);roi();
// cookies, ano
$('#ano').textContent=new Date().getFullYear();
if(localStorage.getItem('ck'))$('#cookie').classList.add('gone');else document.body.classList.add('ck-open');
$('#ok').onclick=()=>{try{localStorage.setItem('ck',1)}catch(e){}$('#cookie').classList.add('gone');document.body.classList.remove('ck-open')};
// barra fixa some quando os preços estão na tela
new IntersectionObserver(es=>document.body.classList.toggle('at-price',es[0].isIntersecting)).observe($('#precos'));
})();
