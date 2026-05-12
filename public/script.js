'use strict';

/* ── CURSOR ──────────────────────────────────────────────── */
const cursorDot = document.getElementById('cursorDot');
document.addEventListener('mousemove', e => {
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top = e.clientY + 'px';
});
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
  // Hide nav on scroll down, show on scroll up
  if (y > lastScroll && y > 200) nav.classList.add('hidden');
  else nav.classList.remove('hidden');
  lastScroll = y;
  // Active nav link
  let current = '';
  allSections.forEach(sec => {
    if (y >= sec.offsetTop - 200) current = sec.id;
  });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
}, { passive: true });

/* ── HAMBURGER ───────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navList = document.getElementById('navList');
hamburger?.addEventListener('click', () => navList.classList.toggle('open'));
navLinks.forEach(l => l.addEventListener('click', () => navList.classList.remove('open')));

/* ── SCROLL-DRIVEN BMW VIDEO ─────────────────────────────── */
const heroVideo = document.getElementById('heroVideo');
const heroSection = document.getElementById('hero');

if (heroVideo && heroSection) {
  // Load video metadata
  heroVideo.addEventListener('loadedmetadata', () => {
    updateVideoScroll();
  });
  // Try to play and pause immediately so the video is ready
  heroVideo.play().then(() => heroVideo.pause()).catch(() => {});

  function updateVideoScroll() {
    if (!heroVideo.duration) return;
    const rect = heroSection.getBoundingClientRect();
    const sectionH = heroSection.offsetHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, -rect.top / sectionH));
    heroVideo.currentTime = progress * heroVideo.duration;
  }

  window.addEventListener('scroll', updateVideoScroll, { passive: true });
}

/* ── SOUND TOGGLE (BMW ENGINE) ───────────────────────────── */
const soundToggle = document.getElementById('soundToggle');
const engineSound = document.getElementById('engineSound');
let soundOn = false;

if (soundToggle && engineSound) {
  engineSound.volume = 0.3;
  soundToggle.addEventListener('click', () => {
    soundOn = !soundOn;
    if (soundOn) {
      engineSound.play().catch(() => {});
      soundToggle.textContent = '🔊';
    } else {
      engineSound.pause();
      soundToggle.textContent = '🔇';
    }
  });
}

/* ── INTERSECTION OBSERVER (fade-up + skill bars) ────────── */
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
    }, idx * 80);
    io.unobserve(el);
  });
}, { threshold: 0.15 });

document.querySelectorAll(
  '.about-single, .skill-group, .project-card, .tl-item, .cert-item, .contact-link-item, .contact-form, .tech-category, .contact-links'
).forEach(el => {
  el.classList.add('fade-up');
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
  formNote.className = 'form-note';
  try {
    const res = await fetch('https://formsubmit.co/ajax/Pinglepratham618@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });
    const data = await res.json();
    if (res.ok) {
      formNote.textContent = '✓ Message sent! I\'ll reply within 24 hours.';
      formNote.className = 'form-note success';
      form.reset();
    } else {
      throw new Error(data.message || 'Something went wrong.');
    }
  } catch (err) {
    formNote.textContent = `✗ ${err.message}`;
    formNote.className = 'form-note error';
  } finally {
    submitBtn.disabled = false;
    submitText.textContent = 'Send message';
    submitIcon.style.display = '';
  }
});

/* ── CONSOLE ─────────────────────────────────────────────── */
console.log('%c Pratham Pingle — Portfolio ', 'background:#1e88e5;color:#fff;padding:8px 16px;font-size:1rem;font-weight:700;border-radius:6px;');
