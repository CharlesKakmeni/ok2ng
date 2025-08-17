// script.js — slider, menu toggle, countdown, audio control, FAQ toggles

document.addEventListener('DOMContentLoaded', ()=>{

  /* ===== MENU MOBILE ===== */
  function setupMenu(toggleId, navId){
    const toggle = document.querySelector(toggleId);
    const nav = document.querySelector(navId);
    if(!toggle || !nav) return;
    toggle.addEventListener('click', ()=>{
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('show');
    });
  }
  setupMenu('#menuToggle','#navList');
  setupMenu('#menuToggle2','#navList2');
  setupMenu('#menuToggle3','#navList3');
  setupMenu('#menuToggle4','#navList4');
  setupMenu('#menuToggle5','#navList5');

  /* ===== SLIDER HERO ===== */
  const slides = Array.from(document.querySelectorAll('.slide'));
  if(slides.length){
    let idx = 0;
    const nextSlide = ()=>{
      slides.forEach((s,i)=> s.classList.toggle('active', i===idx));
      idx = (idx + 1) % slides.length;
    };
    // show first frame immediately
    nextSlide();
    // auto rotate
    setInterval(nextSlide, 4500);
  }

  /* ===== COUNTDOWN ===== */
  // Date & heure locale de l'événement (remplace si besoin). Format ISO avec offset (+01:00 pour Cameroun)
  const EVENT_ISO = "2025-12-27T12:00:00+01:00";
  const target = new Date(EVENT_ISO).getTime();
  const elDays = document.getElementById('cdDays');
  const elHours = document.getElementById('cdHours');
  const elMinutes = document.getElementById('cdMinutes');
  const elSeconds = document.getElementById('cdSeconds');

  function tick(){
    const now = Date.now();
    let diff = Math.max(0, target - now);
    const sec = Math.floor(diff/1000);
    const days = Math.floor(sec/86400);
    const hours = Math.floor((sec%86400)/3600);
    const minutes = Math.floor((sec%3600)/60);
    const seconds = sec%60;
    if(elDays) elDays.textContent = days;
    if(elHours) elHours.textContent = String(hours).padStart(2,'0');
    if(elMinutes) elMinutes.textContent = String(minutes).padStart(2,'0');
    if(elSeconds) elSeconds.textContent = String(seconds).padStart(2,'0');
    if(diff === 0){
      // event started
      const cdRoot = document.getElementById('countdownRoot');
      if(cdRoot) cdRoot.innerHTML = '<strong>Le mariage a commencé 🎉</strong>';
    }
  }
  tick();
  setInterval(tick, 1000);

  /* ===== AUDIO PLAY/PAUSE ===== */
  const audio = document.getElementById('bgAudio');
  const playBtn = document.getElementById('playBtn');
  if(playBtn && audio){
    playBtn.addEventListener('click', async ()=>{
      try{
        if(audio.paused){
          await audio.play();
          playBtn.setAttribute('aria-pressed','true');
          playBtn.textContent = '⏸︎ Pause';
        } else {
          audio.pause();
          playBtn.setAttribute('aria-pressed','false');
          playBtn.textContent = '▶︎ Lancer la musique';
        }
      } catch(e){
        alert("Impossible de lancer la musique automatiquement — vérifie le fichier ou les permissions du navigateur.");
      }
    });
  }

  /* ===== RSVP : feedback après soumission (Formspree) ===== */
  const rsvpForm = document.getElementById('rsvpForm');
  if(rsvpForm){
    rsvpForm.addEventListener('submit', async (ev)=>{
      ev.preventDefault();
      const formData = new FormData(rsvpForm);
      const action = rsvpForm.action;
      const notice = document.getElementById('formNotice');
      notice.textContent = 'Envoi en cours…';
      try{
        const resp = await fetch(action, {method:'POST', body: formData, headers: {'Accept':'application/json'}});
        if(resp.ok){
          notice.textContent = 'Merci — votre réponse a bien été enregistrée ❤️';
          rsvpForm.reset();
        } else {
          const json = await resp.json();
          notice.textContent = json?.error || 'Erreur lors de l\'envoi — réessaie plus tard.';
        }
      } catch(err){
        notice.textContent = 'Impossible de contacter le serveur. Vérifie ta connexion.';
      }
    });
  }

  /* ===== FAQ toggles ===== */
  const qBtns = Array.from(document.querySelectorAll('.qa-q'));
  qBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      const a = btn.nextElementSibling;
      if(a) a.style.display = expanded ? 'none' : 'block';
    });
  });

});
