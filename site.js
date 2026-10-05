(function(){
  var html=document.documentElement, btn=document.getElementById('langBtn');
  function setLang(l){html.lang=l; if(btn) btn.textContent=(l==='en')?'ES':'EN'; try{sessionStorage.setItem('rbLang',l);}catch(e){}}
  var saved=null; try{saved=sessionStorage.getItem('rbLang');}catch(e){}
  setLang(saved||((navigator.language||'en').toLowerCase().indexOf('es')===0?'es':'en'));
  if(btn) btn.addEventListener('click',function(){setLang(html.lang==='en'?'es':'en');});
  var yt=document.getElementById('ytBtn');
  if(yt) yt.addEventListener('click',function(){
    var f=document.createElement('iframe');
    f.src='https://www.youtube-nocookie.com/embed/KsIb7VJvtnM?autoplay=1';
    f.title='RADIOBIOCOATS project video'; f.allow='autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen=true;
    var box=document.getElementById('ytBox'); box.innerHTML=''; box.appendChild(f);
  });
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.querySelectorAll('video[data-autoplay]').forEach(function(v){v.muted=true; var p=v.play(); if(p&&p.catch)p.catch(function(){});});
  }
  // Lightbox for figure and thumbnail links
  var links=document.querySelectorAll('a.img, a.tthumb');
  var lb=null, lastFocus=null;
  function closeLb(){ if(!lb) return; lb.classList.remove('open'); document.body.classList.remove('lb-on');
    var el=lb; lb=null; setTimeout(function(){el.remove();},200); document.removeEventListener('keydown',onKey); if(lastFocus) lastFocus.focus(); }
  function onKey(e){ if(e.key==='Escape') closeLb(); }
  function openLb(a){
    lastFocus=a;
    var es=html.lang==='es', img=a.querySelector('img'), cap='';
    var fig=a.closest('figure');
    if(fig){ var s=fig.querySelector('figcaption .'+(es?'es':'en')); cap=s?s.textContent:(img?img.alt:''); }
    else { var li=a.closest('li'); var w=li&&li.querySelector('.when'); cap=w?w.textContent:(img?img.alt:''); }
    lb=document.createElement('div'); lb.className='lb'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true');
    var b=document.createElement('button'); b.type='button'; b.textContent=es?'✕ Cerrar':'✕ Close';
    var im=document.createElement('img'); im.src=a.getAttribute('href'); im.alt=img?img.alt:'';
    var p=document.createElement('p'); p.textContent=cap;
    lb.appendChild(b); lb.appendChild(im); if(cap) lb.appendChild(p);
    lb.addEventListener('click',function(e){ if(e.target!==p) closeLb(); });
    document.body.appendChild(lb); document.body.classList.add('lb-on');
    requestAnimationFrame(function(){ lb.classList.add('open'); });
    document.addEventListener('keydown',onKey); b.focus();
  }
  links.forEach(function(a){ a.addEventListener('click',function(e){ if(e.metaKey||e.ctrlKey||e.shiftKey) return; e.preventDefault(); openLb(a); }); });
})();
