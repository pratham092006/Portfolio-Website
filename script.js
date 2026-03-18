/* =============================================
   PRATHAM PINGLE — PORTFOLIO JAVASCRIPT
   ============================================= */

/* ------- CUSTOM CURSOR ------- */
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function lerpTrail() {
  trailX += (mouseX - trailX) * 0.1;
  trailY += (mouseY - trailY) * 0.1;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top = trailY + 'px';
  requestAnimationFrame(lerpTrail);
}
lerpTrail();

document.querySelectorAll('a, button, .skill-orb, .project-card, .fidget-card, .big-spinner, .bounce-ball, .click-btn, .color-range').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '36px'; cursor.style.height = '36px';
    cursor.style.background = 'var(--accent2)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '20px'; cursor.style.height = '20px';
    cursor.style.background = 'var(--accent)';
  });
});

/* ------- NAVBAR SCROLL ------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ------- HAMBURGER MENU ------- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));

/* ------- HERO CANVAS (PARTICLES) ------- */
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.6 + 0.1;
    const hue = Math.random() > 0.5 ? 260 : 190;
    this.color = `hsla(${hue}, 80%, 70%, ${this.opacity})`;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(124,58,237,${(1 - dist / 100) * 0.15})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ------- TYPEWRITER ------- */
const roles = [
  'build Web Apps 🌐',
  'develop Flutter Apps 📱',
  'love Problem Solving 🧠',
  'explore Data Analytics 📊',
  'volunteer at Malhar 🎉',
  'design clean UIs ✨',
];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typeEl = document.getElementById('typewriter');

function type() {
  const current = roles[roleIndex];
  if (isDeleting) {
    typeEl.textContent = current.substring(0, charIndex--);
    if (charIndex < 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; charIndex = 0; }
    setTimeout(type, 60);
  } else {
    typeEl.textContent = current.substring(0, charIndex++);
    if (charIndex > current.length) { isDeleting = true; setTimeout(type, 1400); }
    else setTimeout(type, 80);
  }
}
setTimeout(type, 800);

/* ------- COUNTER ANIMATION ------- */
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1500;
  const start = performance.now();
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target) + (target >= 10 ? '+' : '');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* ------- INTERSECTION OBSERVER ------- */
const observerOptions = { threshold: 0.2 };
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('tl-item-visible');
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateX(0)';
      // counters
      if (entry.target.classList.contains('stat-card')) {
        const counter = entry.target.querySelector('.counter');
        if (counter && !counter.dataset.animated) {
          counter.dataset.animated = 'true';
          animateCounter(counter);
        }
      }
      io.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.timeline-item, .skill-cat, .project-card, .cert-card, .stat-card, .fidget-card').forEach(el => {
  el.classList.add('tl-item-hidden');
  io.observe(el);
});

/* ------- MINI FIDGET SPINNER (ABOUT) ------- */
const spinnerBtn = document.getElementById('spinnerBtn');
let spinInterval = null, spinSpeed = 0, isHolding = false;

if (spinnerBtn) {
  spinnerBtn.addEventListener('mousedown', () => { isHolding = true; });
  spinnerBtn.addEventListener('click', () => {
    spinSpeed = Math.random() * 2 + 1;
    spinnerBtn.classList.remove('spinning-fast', 'spinning-medium', 'spinning-slow');
    if (spinSpeed > 2) spinnerBtn.classList.add('spinning-fast');
    else if (spinSpeed > 1.2) spinnerBtn.classList.add('spinning-medium');
    else spinnerBtn.classList.add('spinning-slow');
    setTimeout(() => {
      spinnerBtn.classList.remove('spinning-fast', 'spinning-medium', 'spinning-slow');
    }, 2500);
  });
}

/* ------- SKILL ORBS ------- */
const tooltip = document.getElementById('skillTooltip');
const tooltipName = document.getElementById('tooltipName');
const tooltipFill = document.getElementById('tooltipFill');
const tooltipLevel = document.getElementById('tooltipLevel');

document.querySelectorAll('.skill-orb').forEach(orb => {
  orb.addEventListener('mouseenter', () => {
    const skill = orb.dataset.skill;
    const level = orb.dataset.level;
    tooltipName.textContent = skill;
    tooltipFill.style.width = level + '%';
    tooltipLevel.textContent = level + '% Proficiency';
    tooltip.classList.add('active');
    orb.style.setProperty('--fill', level);
  });
  orb.addEventListener('mouseleave', () => {
    tooltip.classList.remove('active');
  });
});

/* ------- TERMINAL ANIMATION ------- */
const termCmds = [
  { cmd: 'whoami', output: ['→ pratham-pingle', '→ IT Student | Flutter Dev | Web Dev'] },
  { cmd: 'cat skills.txt', output: ['HTML CSS JS Python Flutter Node.js SQL Git', 'REST API | UI Design | Problem Solving ✓'] },
  { cmd: 'ls projects/', output: ['mypins-pinterest-clone/', 'classroom-management-app/'] },
  { cmd: 'cat contact.json', output: ['{ "email": "Pinglepratham618@gmail.com",', '  "phone": "+91 8928849217",', '  "location": "Mumbai, India" }'] },
  { cmd: 'git log --oneline', output: ['🚀 feat: built MYpins full-stack app', '📱 feat: classroom mgmt Flutter app', '🎓 chore: St. Xaviers IT degree (pursuing)', '🏆 event: Malhar 2024 & 2025'] },
];
let termIdx = 0;
const termCmd = document.getElementById('termCmd');
const termOutput = document.getElementById('termOutput');

function runTerminal() {
  if (!termCmd) return;
  const item = termCmds[termIdx % termCmds.length];
  termIdx++;
  let i = 0;
  termCmd.textContent = '';
  termOutput.innerHTML = '';

  const typeCmd = () => {
    if (i < item.cmd.length) {
      termCmd.textContent += item.cmd[i++];
      setTimeout(typeCmd, 60);
    } else {
      setTimeout(() => {
        item.output.forEach((line, idx) => {
          setTimeout(() => {
            const div = document.createElement('div');
            div.className = 'out-line';
            div.style.color = line.startsWith('→') ? 'var(--accent2)' : 'var(--text-muted)';
            div.textContent = line;
            termOutput.appendChild(div);
          }, idx * 150);
        });
        setTimeout(runTerminal, 3500);
      }, 400);
    }
  };
  typeCmd();
}
setTimeout(runTerminal, 1000);

/* ------- BIG FIDGET SPINNER ------- */
const bigSpinner = document.getElementById('bigSpinner');
const rpmDisplay = document.getElementById('rpmDisplay');
let spinAngle = 0, spinVelocity = 0;
let isSpinnerHeld = false, lastClickTime = 0;

if (bigSpinner) {
  bigSpinner.addEventListener('mousedown', () => { isSpinnerHeld = true; });
  bigSpinner.addEventListener('mouseup', () => { isSpinnerHeld = false; });
  bigSpinner.addEventListener('mouseleave', () => { isSpinnerHeld = false; });
  bigSpinner.addEventListener('click', () => {
    const now = Date.now();
    const timeDiff = now - lastClickTime;
    if (timeDiff < 500) spinVelocity += 12;
    else spinVelocity += 6;
    lastClickTime = now;
  });
  bigSpinner.addEventListener('touchstart', e => { e.preventDefault(); spinVelocity += 8; }, { passive: false });

  function animateSpinner() {
    if (isSpinnerHeld) spinVelocity += 0.8;
    spinVelocity *= 0.985;
    spinAngle += spinVelocity;
    bigSpinner.style.transform = `rotate(${spinAngle}deg)`;
    const rpm = Math.round(Math.abs(spinVelocity) * 60 / 6);
    rpmDisplay.textContent = rpm;
    // glow based on speed
    if (spinVelocity > 20) bigSpinner.style.filter = 'drop-shadow(0 0 20px var(--accent)) brightness(1.3)';
    else if (spinVelocity > 10) bigSpinner.style.filter = 'drop-shadow(0 0 10px var(--accent2)) brightness(1.1)';
    else bigSpinner.style.filter = '';
    requestAnimationFrame(animateSpinner);
  }
  animateSpinner();
}

/* ------- BOUNCING BALL ------- */
const bounceArena = document.getElementById('bounceArena');
const bounceBall = document.getElementById('bounceBall');
let ballY = 0, ballVelY = 0, ballVelX = 2, ballX = 50;
let isBallRunning = false;

function launchBall() {
  if (!isBallRunning) {
    isBallRunning = true;
    ballY = 10;
    ballVelY = -5;
    ballVelX = (Math.random() - 0.5) * 6;
    animateBall();
  } else {
    ballVelY -= 6;
    ballVelX = (Math.random() - 0.5) * 6;
  }
}

function animateBall() {
  if (!isBallRunning) return;
  const arenaH = bounceArena.offsetHeight;
  const arenaW = bounceArena.offsetWidth;
  ballVelY += 0.4;
  ballY += ballVelY;
  ballX += ballVelX;
  // floor bounce
  if (ballY >= arenaH - 50) { ballY = arenaH - 50; ballVelY *= -0.75; if (Math.abs(ballVelY) < 1) isBallRunning = false; }
  // walls
  if (ballX <= 20 || ballX >= arenaW - 20) { ballVelX *= -1; ballX = Math.max(20, Math.min(arenaW - 20, ballX)); }
  bounceBall.style.bottom = (arenaH - ballY - 40) + 'px';
  bounceBall.style.left = ballX + 'px';
  if (isBallRunning) requestAnimationFrame(animateBall);
}

if (bounceArena) bounceArena.addEventListener('click', launchBall);

/* ------- COLOR MIXER ------- */
const rSlider = document.getElementById('rSlider');
const gSlider = document.getElementById('gSlider');
const bSlider = document.getElementById('bSlider');
const colorDisplay = document.getElementById('colorDisplay');
const colorHex = document.getElementById('colorHex');

function toHex(n) { return (+n).toString(16).padStart(2, '0'); }
function updateColor() {
  const r = rSlider.value, g = gSlider.value, b = bSlider.value;
  const col = `rgb(${r},${g},${b})`;
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  colorDisplay.style.background = col;
  colorDisplay.style.boxShadow = `0 0 30px rgba(${r},${g},${b},0.5)`;
  colorHex.textContent = hex.toUpperCase();
  colorHex.style.color = col;
}
[rSlider, gSlider, bSlider].forEach(s => { if (s) s.addEventListener('input', updateColor); });
updateColor();

/* ------- CODE CLICKER ------- */
const clickBtn = document.getElementById('clickBtn');
const clickCountEl = document.getElementById('clickCount');
const clickStreak = document.getElementById('clickStreak');
let clickCount = 0, lastClick = 0, streakCount = 0;

if (clickBtn) {
  clickBtn.addEventListener('click', () => {
    clickCount++;
    clickCountEl.textContent = clickCount;
    // animate
    clickBtn.style.transform = 'scale(0.88)';
    setTimeout(() => clickBtn.style.transform = '', 100);
    // floating number
    const fly = document.createElement('div');
    fly.textContent = '+1';
    fly.style.cssText = `position:fixed;left:${mouseX}px;top:${mouseY}px;color:var(--accent2);font-family:var(--mono);font-weight:900;font-size:1.1rem;pointer-events:none;z-index:9999;animation:flyUp 0.8s ease forwards;`;
    document.body.appendChild(fly);
    setTimeout(() => fly.remove(), 800);
    // streak
    const now = Date.now();
    if (now - lastClick < 300) { streakCount++; if (streakCount > 3) clickStreak.textContent = `🔥 x${streakCount} STREAK!`; }
    else { streakCount = 0; clickStreak.textContent = ''; }
    lastClick = now;
    // milestones
    const milestones = [10, 25, 50, 100, 200];
    if (milestones.includes(clickCount)) {
      clickStreak.textContent = `🎉 ${clickCount} lines! Legend!`;
    }
  });
}

/* fly-up animation */
const flyUpStyle = document.createElement('style');
flyUpStyle.textContent = `@keyframes flyUp { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(-60px); } }`;
document.head.appendChild(flyUpStyle);

/* ------- CONTACT FORM ------- */
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    submitBtn.querySelector('span').textContent = 'Sending...';
    submitBtn.disabled = true;
    setTimeout(() => {
      submitBtn.querySelector('span').textContent = 'Send Message';
      submitBtn.disabled = false;
      formSuccess.classList.add('visible');
      form.reset();
      setTimeout(() => formSuccess.classList.remove('visible'), 4000);
    }, 1200);
  });
}

/* ------- SCROLL REVEAL for sections ------- */
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.tl-item-hidden');
      cards.forEach((c, i) => {
        setTimeout(() => {
          c.style.opacity = '1';
          c.style.transform = 'translateX(0)';
          c.classList.add('tl-item-visible');
          // trigger counter
          const counter = c.querySelector('.counter');
          if (counter && !counter.dataset.animated) {
            counter.dataset.animated = 'true';
            animateCounter(counter);
          }
        }, i * 100);
      });
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section').forEach(s => sectionObserver.observe(s));

/* ------- ACTIVE NAV LINKS ------- */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 150) current = s.id;
  });
  navLinkEls.forEach(l => {
    l.style.color = l.getAttribute('href') === `#${current}` ? 'var(--text)' : '';
  });
});

/* ------- GLITCH EFFECT ON HERO BADGE ------- */
const badge = document.querySelector('.glitch-badge');
if (badge) {
  setInterval(() => {
    badge.style.textShadow = `${Math.random() * 4 - 2}px 0 var(--accent2)`;
    setTimeout(() => badge.style.textShadow = '', 100);
  }, 3000);
}

/* ------- PARALLAX on hero ------- */
document.addEventListener('mousemove', e => {
  const { clientX: x, clientY: y } = e;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (x - cx) / cx;
  const dy = (y - cy) / cy;
  document.querySelectorAll('.float-card').forEach((card, i) => {
    const depth = (i + 1) * 6;
    card.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
  });
});

console.log('%c PRATHAM PINGLE PORTFOLIO', 'background: linear-gradient(135deg, #7c3aed, #06b6d4); color: white; padding: 12px 24px; font-size: 1.2rem; font-weight: 900; border-radius: 8px;');
console.log('%c Hey there! Thanks for checking out the code 😊', 'color: #06b6d4; font-size: 1rem;');
