window.HERO=function(c){if(!document.querySelector('.h1'))return;var g=c.gsap,cu=document.querySelector('.h1 .curtain');
var tl=g.timeline({defaults:{ease:'power3.out'},delay:.15});
tl.set(cu,{transformOrigin:'left center'})
 .to(cu,{scaleX:1,duration:.5,ease:'power2.in'})
 .set('.h1 .hero-photo',{opacity:1})
 .set(cu,{transformOrigin:'right center'})
 .to(cu,{scaleX:0,duration:.75,ease:'power2.out'})
 .fromTo('.h1 .hero-photo img',{scale:1.08},{scale:1,duration:2.8,ease:'power2.out'},'<')
 .fromTo('.h1 .sub',{opacity:0,y:14},{opacity:1,y:0,duration:.9},'-=2.1')
 .fromTo(c.chars,{yPercent:110},{yPercent:0,duration:.9,stagger:.06},'-=1.9')
 .fromTo('.h1 .gold-line',{scaleX:0},{scaleX:1,duration:1,ease:'power2.inOut'},'-=.35')
 .fromTo('.h1 .h-fade:not(.sub)',{opacity:0,y:16},{opacity:1,y:0,duration:1,stagger:.12},'-=.6');
};
(function(){
  var root=document.documentElement;
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MOB=matchMedia('(max-width: 767px)').matches;
  var FINE=matchMedia('(hover: hover) and (pointer: fine)').matches;
  if(!window.gsap){root.classList.remove('anim');RM=true}

  /* header / fixed UI */
  var hd=document.querySelector('.hd'),pt=document.querySelector('.pagetop');
  function onScroll(){var y=window.scrollY;hd.classList.toggle('is-scrolled',y>10);pt.classList.toggle('show',y>600)}
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  var bg=document.querySelector('.burger');
  if(bg)bg.addEventListener('click',function(){var o=hd.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
  document.querySelectorAll('.gnav a').forEach(function(a){a.addEventListener('click',function(){hd.classList.remove('open')})});

  /* split chars */
  function split(el){
    var nodes=Array.prototype.slice.call(el.childNodes);el.innerHTML='';
    nodes.forEach(function(n){
      if(n.nodeType===3){
        Array.from(n.textContent).forEach(function(c){
          if(/\s/.test(c)&&c!=='　'){el.appendChild(document.createTextNode(c));return}
          var o=document.createElement('span');o.className='ch';
          var i=document.createElement('span');i.textContent=c;o.appendChild(i);el.appendChild(o);
        });
      }else{ if(n.nodeName!=='BR')split(n); el.appendChild(n); }
    });
  }
  var catches=document.querySelectorAll('.hero .catch');
  catches.forEach(function(c){c.setAttribute('aria-label',c.textContent.replace(/\s+/g,''));split(c)});
  document.querySelectorAll('.vphrase-sec').forEach(split);

  if(RM){
    document.querySelectorAll('[data-count]').forEach(function(el){el.textContent=el.dataset.count});
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  var ctx={gsap:gsap,MOB:MOB,FINE:FINE,
    chars:document.querySelectorAll('.hero .catch .ch>span')};

  /* ---------- HERO (variant specific) ---------- */
  catches.forEach(function(c){c.style.visibility='visible'});
  if(window.HERO)window.HERO(ctx);

  /* loops */
  document.querySelectorAll('.mq-track').forEach(function(t){
    if(MOB)return;
    var r=t.dataset.dir==='rev';gsap.fromTo(t,{xPercent:r?-50:0},{xPercent:r?0:-50,duration:+(t.dataset.speed||40),ease:'none',repeat:-1});
  });
  document.querySelectorAll('.wave svg').forEach(function(w,i){
    if(MOB)return;
    gsap.to(w.parentNode,{xPercent:-50,duration:16+i*3,ease:'none',repeat:-1});
    gsap.to(w,{scaleY:1.35,transformOrigin:'50% 100%',duration:3.2,ease:'sine.inOut',yoyo:true,repeat:-1});
  });

  /* mouse parallax (PC only) */
  if(FINE&&!MOB){
    var px=document.querySelectorAll('[data-px]');
    var setters=Array.prototype.map.call(px,function(el){
      return{x:gsap.quickTo(el,'x',{duration:1.2,ease:'power3.out'}),y:gsap.quickTo(el,'y',{duration:1.2,ease:'power3.out'}),f:+el.dataset.px}});
    addEventListener('mousemove',function(e){
      var dx=e.clientX/innerWidth-.5,dy=e.clientY/innerHeight-.5;
      setters.forEach(function(s){s.x(dx*s.f);s.y(dy*s.f*.6)});
    });
  }
  /* scroll parallax (time-lagged) */
  if(!MOB){
    document.querySelectorAll('[data-sp]').forEach(function(el){
      gsap.to(el,{yPercent:+el.dataset.sp,ease:'none',scrollTrigger:{trigger:el.closest('.hero'),start:'top top',end:'bottom top',scrub:+(el.dataset.lag||.6)}});
    });
  }

  /* ---------- sections ---------- */
  gsap.utils.toArray('.sec-en').forEach(function(el){
    var c=el.closest('.center');
    gsap.from(el,{x:c?0:-140,y:c?40:0,opacity:0,duration:1.4,ease:'power2.out',scrollTrigger:{trigger:el.parentNode,start:'top 85%'}});
  });
  gsap.utils.toArray('.fade-up').forEach(function(el){
    gsap.from(el,{y:36,opacity:0,duration:1.1,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%'}});
  });
  gsap.utils.toArray('.sec-line').forEach(function(el){
    gsap.from(el,{scaleX:0,duration:1,ease:'power2.inOut',scrollTrigger:{trigger:el,start:'top 90%'}});
  });
  gsap.utils.toArray('.mask').forEach(function(el){
    var d=el.dataset.dir||'l';
    var from=d==='b'?'inset(100% 0 0 0)':d==='r'?'inset(0 0 0 100%)':'inset(0 100% 0 0)';
    gsap.fromTo(el,{clipPath:from},{clipPath:'inset(0% 0% 0% 0%)',duration:1.3,ease:'power3.inOut',scrollTrigger:{trigger:el,start:'top 85%'}});
    var im=el.querySelector('img');if(im)gsap.from(im,{scale:1.15,duration:1.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 85%'}});
  });
  if(document.querySelector('.r-cards'))
    gsap.from('.r-card',{y:80,opacity:0,duration:1.1,stagger:.2,ease:'power3.out',scrollTrigger:{trigger:'.r-cards',start:'top 82%'}});
  gsap.utils.toArray('.num-list li').forEach(function(el,i){
    gsap.from(el,{y:24,opacity:0,duration:.9,delay:i*.08,ease:'power2.out',scrollTrigger:{trigger:'.num-list',start:'top 85%'}});
  });
  document.querySelectorAll('[data-count]').forEach(function(el){
    var o={v:+(el.dataset.from||0)},to=+el.dataset.count;
    el.textContent=o.v;
    gsap.to(o,{v:to,duration:1.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%'},onUpdate:function(){el.textContent=Math.round(o.v)}});
  });
  if(document.querySelector('.vphrase-sec'))
    gsap.from('.vphrase-sec .ch>span',{yPercent:110,duration:.8,stagger:.04,ease:'power3.out',scrollTrigger:{trigger:'.vphrase-sec',start:'top 80%'}});
})();

if(window.gsap)gsap.config({nullTargetWarn:false});
(function(){
var f=document.getElementById('ctForm');
if(f)f.addEventListener('submit',function(e){e.preventDefault();f.querySelector('.ct-msg').textContent='※これはデザイン提案用のサンプルです（送信はされません）';});
if(!window.gsap||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
gsap.utils.toArray('.s-cards,.c-cards').forEach(function(g){gsap.from(g.children,{y:60,opacity:0,duration:1,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:g,start:'top 82%'}})});
gsap.utils.toArray('.p-tbl').forEach(function(t){gsap.from(t.querySelectorAll('tbody tr'),{opacity:0,y:12,duration:.6,stagger:.08,ease:'power2.out',scrollTrigger:{trigger:t,start:'top 80%'}})});
gsap.from('.p-flow li',{opacity:0,x:-20,duration:.7,stagger:.15,scrollTrigger:{trigger:'.p-flow',start:'top 85%'}});
gsap.fromTo('.f-line i',{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:'.f-steps',start:'top 70%',end:'bottom 60%',scrub:.6}});
gsap.utils.toArray('.f-step').forEach(function(s){gsap.from(s,{opacity:0,y:30,duration:1,ease:'power2.out',scrollTrigger:{trigger:s,start:'top 80%'}})});
gsap.from('.f-deal li',{opacity:0,y:20,duration:.7,stagger:.1,scrollTrigger:{trigger:'.f-deal',start:'top 80%'}});
gsap.from('.f-vert',{opacity:0,y:30,duration:1.4,ease:'power2.out',scrollTrigger:{trigger:'.f-vert',start:'top 80%'}});
gsap.from('.m-vert',{opacity:0,y:40,duration:1.4,ease:'power2.out',scrollTrigger:{trigger:'.m-ph',start:'top 75%'}});
gsap.from('.m-rinen li',{opacity:0,y:24,duration:.8,stagger:.12,scrollTrigger:{trigger:'.m-rinen',start:'top 82%'}});
})();
(function(){
  document.querySelectorAll('.chips-filter').forEach(function(g){
    var box=g.parentElement,list=box.querySelector('#caseList,#newsList');if(!list)return;
    var empty=box.querySelector('.nl-empty');
    function apply(f){var n=0;[].forEach.call(list.children,function(it){var ok=f==='all'||it.dataset.cat===f;it.hidden=!ok;if(ok)n++});
      if(empty)empty.hidden=n>0;
      g.querySelectorAll('button').forEach(function(b){var on=b.dataset.f===f;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)})}
    g.addEventListener('click',function(e){var b=e.target.closest('button');if(b)apply(b.dataset.f)});
    var q=new URLSearchParams(location.search).get('cat');apply(q&&g.querySelector('[data-f="'+q+'"]')?q:'all');
  });
  if(!window.gsap||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  if(document.querySelector('.ph')){
    gsap.from('.ph-en',{x:140,opacity:0,duration:1.4,ease:'power3.out'});
    gsap.from('.ph-ttl',{y:30,opacity:0,duration:1,delay:.15,ease:'power3.out'});
    gsap.from('.ph .gold-line',{scaleX:0,duration:1,delay:.5,ease:'power2.inOut'});
  }
})();
