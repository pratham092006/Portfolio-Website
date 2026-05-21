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
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navList?.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(l => l.addEventListener('click', () => {
  hamburger?.classList.remove('open');
  navList?.classList.remove('open');
}));

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
  if (window.innerWidth > 768) {
    el.style.transitionDelay = `${(i % 5) * 0.1}s`; 
  } else {
    el.style.transitionDelay = '0s';
  }
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

/* ── INTERACTIVE HERO (3D TILT & STICKERS) ──────────────── */
const hero = document.getElementById('hero');
const kText = document.getElementById('kText');
const floatEls = document.querySelectorAll('.float-el');
const stickerCanvas = document.getElementById('stickerCanvas');

const stickers = [
  { text: "WOW!", bg: "var(--lime)" },
  { text: "COOL", bg: "var(--cyan)" },
  { text: "★", bg: "var(--pink)" },
  { text: "DEV", bg: "var(--yellow)" },
  { text: "CODE", bg: "#fff" },
  { text: "POP!", bg: "var(--lime)" },
  { text: "✦", bg: "var(--cyan)" }
];

if (hero && kText) {
  // 3D Tilt & Parallax
  hero.addEventListener('mousemove', (e) => {
    const { width, height, left, top } = hero.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    // Calculate rotation (-15deg to 15deg max)
    const xWalk = ((x / width) - 0.5) * 30;
    const yWalk = ((y / height) - 0.5) * -30;
    
    kText.style.transform = `rotateY(${xWalk}deg) rotateX(${yWalk}deg)`;
    
    // Parallax floating elements
    floatEls.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-speed')) || 10;
      const baseRot = parseFloat(el.getAttribute('data-rot')) || 0;
      const xOffset = ((x / width) - 0.5) * speed;
      const yOffset = ((y / height) - 0.5) * speed;
      
      el.style.transform = `translate(${xOffset}px, ${yOffset}px) rotate(${baseRot}deg)`;
    });
  });
  
  hero.addEventListener('mouseleave', () => {
    kText.style.transform = `rotateY(0deg) rotateX(0deg)`;
    floatEls.forEach((el) => {
      const baseRot = parseFloat(el.getAttribute('data-rot')) || 0;
      el.style.transform = `translate(0px, 0px) rotate(${baseRot}deg)`;
    });
  });

  // Click to Stamp Stickers
  hero.addEventListener('click', (e) => {
    // Only stamp if clicked directly on hero background
    if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.nav-toggle')) return;

    const { left, top } = hero.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
    const randomRot = Math.floor(Math.random() * 40) - 20; // -20 to 20 deg

    const stickerEl = document.createElement('div');
    stickerEl.classList.add('stamped-sticker');
    stickerEl.innerText = randomSticker.text;
    stickerEl.style.background = randomSticker.bg;
    stickerEl.style.left = `${x}px`;
    stickerEl.style.top = `${y}px`;
    stickerEl.style.setProperty('--rot', `${randomRot}deg`);

    stickerCanvas.appendChild(stickerEl);

    // Limit to 20 stickers max to prevent lag
    if (stickerCanvas.children.length > 20) {
      stickerCanvas.removeChild(stickerCanvas.firstChild);
    }
  });
}
