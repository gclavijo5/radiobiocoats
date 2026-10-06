(function(){
  var html=document.documentElement, btn=document.getElementById('langBtn');
  var LANGS={en:{code:'EN',flag:'us',label:'Language'},de:{code:'DE',flag:'de',label:'Sprache'},sk:{code:'SK',flag:'sk',label:'Jazyk'},fr:{code:'FR',flag:'fr',label:'Langue'},es:{code:'ES',flag:'es',label:'Idioma'}};
  var menu=document.querySelector('.langmenu');
  function setLang(l){
    if(!LANGS[l]) l='en';
    html.lang=l;
    if(btn){ btn.querySelector('.code').textContent=LANGS[l].code; btn.querySelector('img').src='assets/img/flags/'+LANGS[l].flag+'.svg'; btn.setAttribute('aria-label',LANGS[l].label+': '+LANGS[l].code); }
    if(menu) menu.querySelectorAll('button[data-lang]').forEach(function(b){ b.setAttribute('aria-checked', b.getAttribute('data-lang')===l ? 'true':'false'); });
    try{ localStorage.setItem('rbLang',l); }catch(e){}
  }
  function openMenu(o){ if(!menu||!btn) return; menu.hidden=!o; btn.setAttribute('aria-expanded',o?'true':'false'); if(o){ var cur=menu.querySelector('button[aria-checked="true"]'); (cur||menu.querySelector('button')).focus(); } }
  var saved=null; try{ saved=localStorage.getItem('rbLang'); }catch(e){}
  var nav=(navigator.language||'en').slice(0,2).toLowerCase(); if(nav==='cs') nav='sk';
  setLang(saved||(LANGS[nav]?nav:'en'));
  if(btn) btn.addEventListener('click',function(e){ e.stopPropagation(); openMenu(menu.hidden); });
  if(menu) menu.addEventListener('click',function(e){ var b=e.target.closest('button[data-lang]'); if(!b) return; setLang(b.getAttribute('data-lang')); openMenu(false); btn.focus(); });
  document.addEventListener('click',function(e){ if(menu && !menu.hidden && !e.target.closest('.langsel')) openMenu(false); });
  document.addEventListener('keydown',function(e){
    if(!menu||menu.hidden) return;
    var items=[].slice.call(menu.querySelectorAll('button[data-lang]')), i=items.indexOf(document.activeElement);
    if(e.key==='Escape'){ openMenu(false); btn.focus(); }
    else if(e.key==='ArrowDown'){ e.preventDefault(); items[(i+1)%items.length].focus(); }
    else if(e.key==='ArrowUp'){ e.preventDefault(); items[(i-1+items.length)%items.length].focus(); }
  });
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
    var lg=html.lang||'en', img=a.querySelector('img'), cap='';
    var fig=a.closest('figure');
    if(fig){ var s=fig.querySelector('figcaption > .'+lg)||fig.querySelector('figcaption .'+lg); cap=s?s.textContent:(img?img.alt:''); }
    else if(a.closest('article.card')){ var h=a.closest('article.card').querySelector('h3 .'+lg); cap=h?h.textContent:(img?img.alt:''); }
    else { var li=a.closest('li'); var w=li&&li.querySelector('.when'); cap=w?w.textContent:(img?img.alt:''); }
    lb=document.createElement('div'); lb.className='lb'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true');
    var b=document.createElement('button'); b.type='button'; b.textContent='✕ '+({en:'Close',de:'Schließen',sk:'Zavrieť',fr:'Fermer',es:'Cerrar'}[lg]||'Close');
    var im=document.createElement('img'); im.src=a.getAttribute('href'); im.alt=img?img.alt:'';
    var p=document.createElement('p'); p.textContent=cap;
    lb.appendChild(b); lb.appendChild(im); if(cap) lb.appendChild(p);
    lb.addEventListener('click',function(e){ if(e.target!==p) closeLb(); });
    document.body.appendChild(lb); document.body.classList.add('lb-on');
    requestAnimationFrame(function(){ lb.classList.add('open'); });
    document.addEventListener('keydown',onKey); b.focus();
  }
  links.forEach(function(a){ a.addEventListener('click',function(e){ if(e.metaKey||e.ctrlKey||e.shiftKey) return; e.preventDefault(); openLb(a); }); });
  // Mobile menu
  var nb=document.getElementById('navBtn'), hdr=document.querySelector('header.top');
  if(nb&&hdr){
    nb.addEventListener('click',function(){ var o=hdr.classList.toggle('open'); nb.setAttribute('aria-expanded',o?'true':'false'); });
    document.querySelectorAll('#mainNav a').forEach(function(a){ a.addEventListener('click',function(){ hdr.classList.remove('open'); nb.setAttribute('aria-expanded','false'); }); });
  }
  // Centre a figure that is alone in the last row of a grid
  function centreOrphans(){
    document.querySelectorAll('.figs').forEach(function(g){
      var items=[].filter.call(g.children,function(e){return e.tagName==='FIGURE';});
      items.forEach(function(i){ i.style.gridColumn=''; i.style.justifySelf=''; i.style.width=''; });
      if(items.length<2) return;
      var cols=getComputedStyle(g).gridTemplateColumns.split(' ').filter(Boolean).length;
      if(cols<2) return;
      var last=items[items.length-1], prev=items[items.length-2];
      if(Math.abs(last.offsetTop-prev.offsetTop)>2){
        var w=prev.getBoundingClientRect().width;
        last.style.gridColumn='1 / -1'; last.style.justifySelf='center'; last.style.width=w+'px';
      }
    });
  }
  centreOrphans();
  window.addEventListener('load',centreOrphans);
  var rt; window.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(centreOrphans,120); });
})();
