/* ============================================================
   PRATHAM PINGLE — PORTFOLIO SCRIPT
   Cursor · Particles · Typewriter · Scroll Animations · Form
   ============================================================ */

'use strict';

/* ── CURSOR ──────────────────────────────────────────────── */
const cursorDot = document.getElementById('cursorDot');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top  = my + 'px';
});

document.querySelectorAll('a, button, input, textarea, .pill-list span, .project-card, .cert-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursorDot.classList.add('enlarged'));
  el.addEventListener('mouseleave', () => cursorDot.classList.remove('enlarged'));
});

/* ── NAVBAR SCROLL / ACTIVE ──────────────────────────────── */
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-list a');
const allSections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);

  // Active nav link
  let current = '';
  allSections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
}, { passive: true });

/* ── HAMBURGER ───────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navList = document.getElementById('navList');
hamburger?.addEventListener('click', () => navList.classList.toggle('open'));
navLinks.forEach(l => l.addEventListener('click', () => navList.classList.remove('open')));

/* Canvas removed in new design */

/* ── ROLE CAROUSEL ───────────────────────────────────────── */
const roleCarousel = document.getElementById('roleCarousel');
const roles = [
  'build Web Apps',
  'develop Mobile Apps',
  'solve problems',
  'learn & grow',
  'create experiences',
  'volunteer & help',
];
let currentRoleIndex = 0;

function rotateRole() {
  if (!roleCarousel) return;
  currentRoleIndex = (currentRoleIndex + 1) % roles.length;
  roleCarousel.style.opacity = '0';
  roleCarousel.style.transform = 'translateY(-10px)';
  
  setTimeout(() => {
    roleCarousel.textContent = roles[currentRoleIndex];
    roleCarousel.style.opacity = '1';
    roleCarousel.style.transform = 'translateY(0)';
  }, 300);
}

if (roleCarousel) {
  roleCarousel.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
  setInterval(rotateRole, 2500);
}

/* ── COUNTER ANIMATION ───────────────────────────────────── */
function animateCount(el) {
  if (el._counted) return;
  el._counted = true;
  const target = +el.dataset.target;
  const dur = 1200, start = performance.now();
  const tick = t => {
    const p = Math.min((t - start) / dur, 1);
    const ease = 1 - (1 - p) ** 3;
    el.textContent = Math.round(ease * target) + '+';
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ── INTERSECTION OBSERVER (fade-up + skill bars + counters) */
const io = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;

    // Stagger index if sibling
    const siblings = el.parentElement?.children;
    let idx = 0;
    if (siblings) idx = [...siblings].indexOf(el);

    setTimeout(() => {
      el.classList.add('visible');

      // Animate skill bars inside
      el.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });

      // Counters
      el.querySelectorAll('.counter').forEach(animateCount);
    }, idx * 80);

    io.unobserve(el);
  });
}, { threshold: 0.15 });

// Register elements
document.querySelectorAll(
  '.about-text, .about-stats, .stat, .skill-group, .project-card, .tl-item, .cert-item, .contact-link-item, .contact-form, .tech-category'
).forEach(el => {
  el.classList.add('fade-up');
  io.observe(el);
});

/* ── CONTACT FORM (AJAX → /api/contact) ──────────────────── */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const submitIcon = document.getElementById('submitIcon');
const formNote   = document.getElementById('formNote');

form?.addEventListener('submit', async e => {
  e.preventDefault();
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmessage').value.trim();

  if (!name || !email || !message) {
    formNote.textContent = 'Please fill in all fields.';
    formNote.className = 'form-note error';
    return;
  }

  // Loading state
  submitBtn.disabled = true;
  submitText.textContent = 'Sending…';
  submitIcon.style.display = 'none';
  formNote.textContent = '';
  formNote.className = 'form-note';

  try {
    const res  = await fetch('https://formsubmit.co/ajax/Pinglepratham618@gmail.com', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, email, message }),
    });
    const data = await res.json();

    if (res.ok) {
      formNote.textContent = '✓ Message sent! I\'ll reply within 24 hours.';
      formNote.className = 'form-note success';
      form.reset();
    } else {
      throw new Error(data.message || data.error || 'Something went wrong.');
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

/* ── CONSOLE GREETING ────────────────────────────────────── */
console.log('%c Pratham Pingle — Portfolio ', 'background:#5b5ef8;color:#fff;padding:8px 16px;font-size:1rem;font-weight:700;border-radius:6px;');
console.log('%c Open to internships & collaborations!', 'color:#818cf8;font-size:0.9rem;padding:4px 0;');
