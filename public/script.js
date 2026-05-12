'use strict';

/* ── LOADER ──────────────────────────────────────────────── */
const loader = document.getElementById('loader');
const loaderCount = document.getElementById('loaderCount');
let count = 0;
const countUp = setInterval(() => {
  count += Math.floor(Math.random() * 8) + 2;
  if (count >= 100) { 
    count = 100; 
    clearInterval(countUp); 
    setTimeout(() => loader?.classList.add('done'), 400); 
  }
  if (loaderCount) loaderCount.textContent = count + '%';
}, 40);

/* ── CURSOR ─────────────────────────────────────────── */
const cur = document.getElementById('cursor');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => { 
  mx = e.clientX; 
  my = e.clientY; 
  if (cur) { 
    cur.style.left = mx + 'px'; 
    cur.style.top = my + 'px'; 
  }
});

document.querySelectorAll('a, button, .project, .stack-pills span, .contact-link').forEach(el => {
  el.addEventListener('mouseenter', () => { cur?.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cur?.classList.remove('hover'); });
});

/* ── NAV ─────────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navList = document.getElementById('navList');
hamburger?.addEventListener('click', () => navList?.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(l => l.addEventListener('click', () => navList?.classList.remove('open')));

/* ── SCROLL REVEAL ───────────────────────────────────────── */
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { 
      entry.target.classList.add('visible'); 
      io.unobserve(entry.target); 
    }
  });
}, { threshold: 0.15 });

reveals.forEach((el, i) => { 
  el.style.transitionDelay = `${(i % 5) * 0.1}s`; 
  io.observe(el); 
});

/* ── SMOOTH SCROLL ───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
