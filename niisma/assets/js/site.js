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

  
  gsap.utils.toArray('.fade-up').forEach(function(el){
    gsap.from(el,{y:20,opacity:0,duration:.9,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 90%'}});
  });
  document.querySelectorAll('[data-count]').forEach(function(el){
    var o={v:+(el.dataset.from||0)},to=+el.dataset.count;el.textContent=o.v;
    gsap.to(o,{v:to,duration:1.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%'},onUpdate:function(){el.textContent=Math.round(o.v)}});
  });
  if(document.querySelector('.f-line i'))
    gsap.fromTo('.f-line i',{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:'.f-steps',start:'top 70%',end:'bottom 60%',scrub:.6}});
})();
if(window.gsap)gsap.config({nullTargetWarn:false});
(function(){var f=document.getElementById('ctForm');if(f)f.addEventListener('submit',function(e){e.preventDefault();f.querySelector('.ct-msg').textContent='※これはデザイン提案用のサンプルです（送信はされません）';});})();
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
})();
