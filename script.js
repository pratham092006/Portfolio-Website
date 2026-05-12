'use strict';

/* ── LOADER ──────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader')?.classList.add('done');
    initSplitText();
  }, 2000);
});

/* ── SPLIT TEXT ANIMATION ────────────────────────────────── */
function initSplitText() {
  const el = document.getElementById('heroSplit');
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    span.style.animationDelay = `${1.8 + i * 0.05}s`;
    el.appendChild(span);
  });
}

/* ── CURSOR ──────────────────────────────────────────────── */
const cursorDot = document.getElementById('cursorDot');
let cx = 0, cy = 0, tx = 0, ty = 0;
document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
function animateCursor() {
  cx += (tx - cx) * 0.15;
  cy += (ty - cy) * 0.15;
  cursorDot.style.left = cx + 'px';
  cursorDot.style.top = cy + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, input, textarea, .pill-list span, .project-card, .cert-item, .tech-badge').forEach(el => {
  el.addEventListener('mouseenter', () => cursorDot.classList.add('enlarged'));
  el.addEventListener('mouseleave', () => cursorDot.classList.remove('enlarged'));
});

/* ── NAV SCROLL / HIDE / ACTIVE ─────────────────────────── */
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-list a');
const allSections = document.querySelectorAll('section[id]');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 20);
  if (y > lastScroll && y > 200) nav.classList.add('hidden');
  else nav.classList.remove('hidden');
  lastScroll = y;
  let current = '';
  allSections.forEach(sec => { if (y >= sec.offsetTop - 200) current = sec.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
}, { passive: true });

/* ── HAMBURGER ───────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navList = document.getElementById('navList');
hamburger?.addEventListener('click', () => navList.classList.toggle('open'));
navLinks.forEach(l => l.addEventListener('click', () => navList.classList.remove('open')));

/* ── SCROLL-DRIVEN BMW VIDEO + ZOOM + SOUND ──────────────── */
const heroVideo = document.getElementById('heroVideo');
const heroSection = document.getElementById('hero');
const heroName = document.querySelector('.hero-name');
const heroTagline = document.querySelector('.hero-tagline');
const scrollHint = document.querySelector('.hero-scroll-hint');
let lastScrollTime = 0, scrollVelocity = 0, prevScrollY = 0;

if (heroVideo && heroSection) {
  heroVideo.addEventListener('loadedmetadata', () => updateHeroScroll());
  heroVideo.play().then(() => heroVideo.pause()).catch(() => {});

  function updateHeroScroll() {
    if (!heroVideo.duration) return;
    const rect = heroSection.getBoundingClientRect();
    const sectionH = heroSection.offsetHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, -rect.top / sectionH));

    // Video playback synced to scroll
    heroVideo.currentTime = progress * heroVideo.duration;

    // Dramatic zoom: 1x → 1.4x as you scroll
    const zoom = 1 + progress * 0.4;
    heroVideo.style.transform = `scale(${zoom})`;

    // Text parallax: moves up + fades + scales
    if (heroName) {
      const textY = progress * -150;
      const textScale = 1 - progress * 0.2;
      const textOpacity = 1 - progress * 1.5;
      heroName.style.transform = `translateY(${textY}px) scale(${textScale})`;
      heroName.style.opacity = Math.max(0, textOpacity);
    }
    if (heroTagline) {
      heroTagline.style.transform = `translateY(${progress * -80}px)`;
      heroTagline.style.opacity = Math.max(0, 1 - progress * 2);
    }
    if (scrollHint) {
      scrollHint.style.opacity = Math.max(0, 1 - progress * 5);
    }

    // Engine sound volume tied to scroll speed
    if (engineSound && soundOn) {
      const now = performance.now();
      const dt = now - lastScrollTime;
      const dy = Math.abs(window.scrollY - prevScrollY);
      scrollVelocity = dy / Math.max(dt, 1) * 16;
      const vol = Math.min(1, scrollVelocity * 0.08);
      engineSound.volume = Math.max(0.05, vol);
      lastScrollTime = now;
      prevScrollY = window.scrollY;
    }
  }

  window.addEventListener('scroll', updateHeroScroll, { passive: true });
}

/* ── MAGNETIC BUTTONS ────────────────────────────────────── */
document.querySelectorAll('.btn-hire, .btn-submit, .sound-toggle').forEach(btn => {
  btn.classList.add('magnetic');
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── GLOW FOLLOW ON PROJECT CARDS ────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  const glow = document.createElement('div');
  glow.className = 'glow';
  card.appendChild(glow);
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    glow.style.left = (e.clientX - rect.left) + 'px';
    glow.style.top = (e.clientY - rect.top) + 'px';
  });
});

/* ── SOUND TOGGLE ────────────────────────────────────────── */
const soundToggle = document.getElementById('soundToggle');
const engineSound = document.getElementById('engineSound');
let soundOn = false;
if (soundToggle && engineSound) {
  engineSound.volume = 0.3;
  soundToggle.addEventListener('click', () => {
    soundOn = !soundOn;
    if (soundOn) { engineSound.play().catch(() => {}); soundToggle.textContent = '🔊'; }
    else { engineSound.pause(); soundToggle.textContent = '🔇'; }
  });
}

/* ── INTERSECTION OBSERVER (reveal + skill bars + stagger) ── */
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = el.parentElement?.children;
    let idx = siblings ? [...siblings].indexOf(el) : 0;
    setTimeout(() => {
      el.classList.add('visible');
      el.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      // Word reveal for headings
      el.querySelectorAll('.word').forEach((w, i) => {
        w.style.transitionDelay = `${i * 0.1}s`;
      });
    }, idx * 100);
    io.unobserve(el);
  });
}, { threshold: 0.12 });

// Wrap heading words
document.querySelectorAll('.section-heading').forEach(h => {
  const words = h.innerHTML.split(/(\s+)/);
  h.innerHTML = words.map(w => w.trim() ? `<span class="word">${w}</span>` : ' ').join('');
  h.classList.add('fade-up');
  io.observe(h);
});

document.querySelectorAll(
  '.about-single, .skill-group, .project-card, .tl-item, .cert-item, .contact-link-item, .contact-form, .tech-category, .contact-links, .about-chips'
).forEach((el, i) => {
  el.classList.add('fade-up');
  if (i % 2 === 0) el.classList.add(`stagger-${(i % 6) + 1}`);
  io.observe(el);
});

/* ── CONTACT FORM ────────────────────────────────────────── */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const submitIcon = document.getElementById('submitIcon');
const formNote = document.getElementById('formNote');
form?.addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmessage').value.trim();
  if (!name || !email || !message) {
    formNote.textContent = 'Please fill in all fields.';
    formNote.className = 'form-note error';
    return;
  }
  submitBtn.disabled = true;
  submitText.textContent = 'Sending…';
  submitIcon.style.display = 'none';
  formNote.textContent = '';
  try {
    const res = await fetch('https://formsubmit.co/ajax/Pinglepratham618@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });
    if (res.ok) {
      formNote.textContent = '✓ Message sent!';
      formNote.className = 'form-note success';
      form.reset();
    } else throw new Error('Failed');
  } catch (err) {
    formNote.textContent = `✗ ${err.message}`;
    formNote.className = 'form-note error';
  } finally {
    submitBtn.disabled = false;
    submitText.textContent = 'Send message';
    submitIcon.style.display = '';
  }
});

console.log('%c Pratham Pingle — Portfolio ', 'background:#1e88e5;color:#fff;padding:8px 16px;font-size:1rem;font-weight:700;border-radius:6px;');
