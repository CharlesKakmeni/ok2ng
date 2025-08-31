// Menu burger
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('show');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
}

// Countdown
(function countdown(){
  const t = new Date('2025-12-27T13:00:00Z'); // UTC
  const d = document.getElementById('d');
  const h = document.getElementById('h');
  const m = document.getElementById('m');
  const s = document.getElementById('s');
  if(!(d&&h&&m&&s)) return;

  function tick(){
    const now = new Date();
    let ms = t - now;
    if(ms < 0) ms = 0;
    const sec = Math.floor(ms/1000)%60;
    const min = Math.floor(ms/1000/60)%60;
    const hr  = Math.floor(ms/1000/60/60)%24;
    const day = Math.floor(ms/1000/60/60/24);
    d.textContent = day;
    h.textContent = String(hr).padStart(2,'0');
    m.textContent = String(min).padStart(2,'0');
    s.textContent = String(sec).padStart(2,'0');
  }
  tick(); setInterval(tick, 1000);
})();

// Lecteur musique
(function music(){
  const audio = document.getElementById('bgMusic');
  const toggle = document.getElementById('musicToggle');
  const progress = document.getElementById('audioProgress');
  const bar = document.getElementById('audioBar');
  const timeEl = document.getElementById('audioTime');
  if(!(audio && toggle && progress && bar && timeEl)) return;

  const fmt = t => !isFinite(t) ? '0:00' : `${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;

  function setPlaying(isPlaying){
    toggle.textContent = isPlaying ? '⏸' : '▶︎';
    toggle.setAttribute('aria-pressed', String(isPlaying));
  }

  toggle.addEventListener('click', async ()=>{
    try{
      if(audio.paused){ await audio.play(); setPlaying(true); }
      else { audio.pause(); setPlaying(false); }
    }catch(e){ console.warn('Lecture audio bloquée par le navigateur.'); }
  });

  audio.addEventListener('timeupdate', ()=>{
    const ratio = (audio.currentTime / (audio.duration||1))*100;
    bar.style.width = `${ratio}%`;
    progress.setAttribute('aria-valuenow', String(Math.round(ratio)));
    timeEl.textContent = fmt(audio.currentTime);
  });

  function seekAt(clientX){
    const rect = progress.getBoundingClientRect();
    const ratio = Math.min(Math.max(0,(clientX - rect.left)/rect.width),1);
    audio.currentTime = ratio * (audio.duration||0);
  }
  progress.addEventListener('click', e => seekAt(e.clientX));
  progress.addEventListener('keydown', e=>{
    if(e.key==='ArrowRight') audio.currentTime = Math.min((audio.currentTime||0)+5, audio.duration||audio.currentTime);
    if(e.key==='ArrowLeft')  audio.currentTime = Math.max((audio.currentTime||0)-5, 0);
  });

  timeEl.textContent = fmt(0);
})();

/* === Hero background slider (plus rapide) === */
(function bgSlider(){
  const slides = Array.from(document.querySelectorAll('.bg-slide'));
  if (slides.length <= 1) return;
  let i = 0;
  const SLIDE_MS = 4000; // 4 secondes (au lieu de 6)
  setInterval(() => {
    slides[i].classList.remove('active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('active');
  }, SLIDE_MS);
})();

// Galerie auto-scroll + drag/swipe
(function stripScroller(){
  const scroller = document.getElementById('galleryStrip');
  if(!scroller) return;
  const track = scroller.querySelector('.strip-track');

  let dragging = false, startX = 0, scrollStart = 0;

  let timer = setInterval(()=>{
    if(!dragging){
      scroller.scrollLeft += 0.5;
      const max = track.scrollWidth - scroller.clientWidth - 1;
      if(scroller.scrollLeft >= max) scroller.scrollLeft = 0;
    }
  },16);

  scroller.addEventListener('mousedown', e=>{
    dragging = true; startX = e.clientX; scrollStart = scroller.scrollLeft;
    scroller.classList.add('dragging'); clearInterval(timer);
  });
  window.addEventListener('mouseup', ()=>{
    if(dragging){ dragging=false; scroller.classList.remove('dragging');
      timer = setInterval(()=>{ if(!dragging){ scroller.scrollLeft += 0.5; } },16);
    }
  });
  scroller.addEventListener('mousemove', e=>{
    if(!dragging) return;
    scroller.scrollLeft = scrollStart - (e.clientX - startX);
  });

  scroller.addEventListener('touchstart', e=>{
    dragging = true; startX = e.touches[0].clientX; scrollStart = scroller.scrollLeft;
    scroller.classList.add('dragging'); clearInterval(timer);
  },{passive:true});
  scroller.addEventListener('touchmove', e=>{
    if(!dragging) return;
    scroller.scrollLeft = scrollStart - (e.touches[0].clientX - startX);
  },{passive:true});
  scroller.addEventListener('touchend', ()=>{
    dragging=false; scroller.classList.remove('dragging');
    timer = setInterval(()=>{ if(!dragging){ scroller.scrollLeft += 0.5; } },16);
  });
})();

// FAQ accordéon
document.querySelectorAll('.qa-q').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    const answer = btn.nextElementSibling;
    if(answer){ answer.style.display = open ? 'none' : 'block'; }
  });
});

// RSVP feedback
const rsvpForm = document.getElementById('rsvpForm');
if (rsvpForm){
  rsvpForm.addEventListener('submit', ()=> {
    const msg = document.getElementById('formMsg');
    if (msg) msg.textContent = "Envoi en cours…";
  });
}
