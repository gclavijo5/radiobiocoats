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
})();
