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

/* ── HERO CANVAS (subtle dot grid + mouse parallax) ──────── */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let W, H, dots = [];

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initDots(); });

function initDots() {
  dots = [];
  const cols = Math.floor(W / 44), rows = Math.floor(H / 44);
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      dots.push({
        bx: c * 44 + 22, by: r * 44 + 22,
        x: 0, y: 0, opacity: Math.random() * 0.4 + 0.05
      });
    }
  }
}
initDots();

let heroMouseX = W / 2, heroMouseY = H / 2;
document.querySelector('.hero')?.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  heroMouseX = e.clientX - rect.left;
  heroMouseY = e.clientY - rect.top;
});

function drawCanvas() {
  ctx.clearRect(0, 0, W, H);
  const strength = 18;
  dots.forEach(d => {
    const dx = d.bx - heroMouseX, dy = d.by - heroMouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const factor = Math.max(0, 1 - dist / 220);
    d.x = d.bx + (dx / Math.max(dist, 1)) * factor * -strength;
    d.y = d.by + (dy / Math.max(dist, 1)) * factor * -strength;

    ctx.beginPath();
    ctx.arc(d.x, d.y, 1.5, 0, Math.PI * 2);
    const highlight = factor > 0.3 ? 1 : d.opacity;
    ctx.fillStyle = `rgba(37,99,235,${highlight * (factor > 0.3 ? 0.6 : 0.2)})`;
    ctx.fill();
  });
  requestAnimationFrame(drawCanvas);
}
drawCanvas();

/* ── TYPEWRITER ──────────────────────────────────────────── */
const roles = [
  'build Web Apps.',
  'develop Flutter Apps.',
  'love problem solving.',
  'explore data analytics.',
  'design clean UIs.',
  'volunteer at Malhar.',
];
let ri = 0, ci = 0, deleting = false;
const twEl = document.getElementById('typewriter');

function type() {
  if (!twEl) return;
  const cur = roles[ri];
  if (deleting) {
    twEl.textContent = cur.slice(0, --ci);
    if (ci <= 0) { deleting = false; ri = (ri + 1) % roles.length; }
    setTimeout(type, 55);
  } else {
    twEl.textContent = cur.slice(0, ++ci);
    if (ci >= cur.length) { deleting = true; setTimeout(type, 1600); }
    else setTimeout(type, 85);
  }
}
setTimeout(type, 600);

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
  '.about-text, .about-stats, .stat, .skill-group, .project-card, .tl-item, .cert-item, .contact-link-item, .contact-form'
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
