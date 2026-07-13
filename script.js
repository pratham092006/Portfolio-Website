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
let mx = 0, my = 0;

document.addEventListener('mousemove', e => { 
  mx = e.clientX; 
  my = e.clientY; 
  if (cur) { 
    cur.style.left = mx + 'px'; 
    cur.style.top = my + 'px'; 
  }
});

function initCursorHoverEvents() {
  document.querySelectorAll('a, button, .project, .stack-pills span, .contact-link, .terminal-header, .terminal-btn, input, textarea').forEach(el => {
    el.removeEventListener('mouseenter', addCursorHover);
    el.removeEventListener('mouseleave', removeCursorHover);
    el.addEventListener('mouseenter', addCursorHover);
    el.addEventListener('mouseleave', removeCursorHover);
  });
}

function addCursorHover() { cur?.classList.add('hover'); }
function removeCursorHover() { cur?.classList.remove('hover'); }

initCursorHoverEvents();

/* ── CLIENT-SIDE SPA ROUTER ─────────────────────────────── */
const pages = document.querySelectorAll('.page-view');
const navLinks = document.querySelectorAll('.nav-links a');
const pageWipe = document.getElementById('pageWipe');

function handleRouting() {
  let rawHash = window.location.hash;
  let pageId = rawHash.replace('#/', '').replace('#', '');
  
  if (!pageId || pageId === 'hero') {
    pageId = 'home';
  }

  const targetPage = document.getElementById(pageId);
  if (!targetPage) return;

  if (pageWipe) {
    pageWipe.classList.add('animate');
    
    setTimeout(() => {
      pages.forEach(p => p.classList.remove('active'));
      targetPage.classList.add('active');

      navLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#/', '').replace('#', '');
        if (href === pageId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      window.scrollTo({ top: 0 });

      targetPage.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('visible');
      });

      if (pageId === 'home') {
        document.getElementById('terminalInput')?.focus();
      }

      pageWipe.classList.add('out');
      setTimeout(() => {
        pageWipe.classList.remove('animate', 'out');
      }, 500);

    }, 450);
  } else {
    pages.forEach(p => p.classList.remove('active'));
    targetPage.classList.add('active');
  }
}

window.addEventListener('hashchange', handleRouting);

window.addEventListener('DOMContentLoaded', () => {
  if (!window.location.hash || window.location.hash === '#') {
    window.location.hash = '#/home';
  } else {
    handleRouting();
  }
});

/* ── NAV TOGGLE ─────────────────────────────────────────── */
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


/* ── INTERACTIVE HERO (3D TILT, STICKERS & CONFETTI) ────── */
const homePage = document.getElementById('home');
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

if (homePage && kText) {
  let isTouching = false;

  function handleMove(clientX, clientY) {
    const { width, height, left, top } = homePage.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    
    const xWalk = ((x / width) - 0.5) * 30;
    const yWalk = ((y / height) - 0.5) * -30;
    
    kText.style.transform = `rotateY(${xWalk}deg) rotateX(${yWalk}deg)`;
    
    floatEls.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-speed')) || 10;
      const baseRot = parseFloat(el.getAttribute('data-rot')) || 0;
      const xOffset = ((x / width) - 0.5) * speed;
      const yOffset = ((y / height) - 0.5) * speed;
      
      el.style.transform = `translate(${xOffset}px, ${yOffset}px) rotate(${baseRot}deg)`;
    });
  }

  function handleReset() {
    kText.style.transform = `rotateY(0deg) rotateX(0deg)`;
    floatEls.forEach((el) => {
      const baseRot = parseFloat(el.getAttribute('data-rot')) || 0;
      el.style.transform = `translate(0px, 0px) rotate(${baseRot}deg)`;
    });
  }

  homePage.addEventListener('mousemove', (e) => {
    handleMove(e.clientX, e.clientY);
  });
  
  homePage.addEventListener('mouseleave', handleReset);

  // Mobile Touch Support for 3D Tilt
  homePage.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  homePage.addEventListener('touchstart', (e) => {
    isTouching = true;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  homePage.addEventListener('touchend', () => {
    isTouching = false;
    handleReset();
  });

  // Mobile touch support for name hover pop-out effect
  kText.addEventListener('touchstart', () => {
    kText.classList.add('hover-active');
  }, { passive: true });

  kText.addEventListener('touchend', () => {
    kText.classList.remove('hover-active');
  });

  kText.addEventListener('touchcancel', () => {
    kText.classList.remove('hover-active');
  });

  // Gyroscope / Device Orientation Support
  function handleOrientation(e) {
    if (isTouching) return; // Prevent fighting with manual touch drags
    
    const gamma = e.gamma; // tilt left/right [-90, 90]
    const beta = e.beta;   // tilt front/back [-180, 180]
    
    if (gamma === null || beta === null) return;
    
    // Normalize phone tilt based on standard holding angle (~55deg)
    const targetBeta = beta - 55;
    
    // Constrain ranges to map to tilt max walks
    const constrainedGamma = Math.max(-25, Math.min(25, gamma));
    const constrainedBeta = Math.max(-25, Math.min(25, targetBeta));
    
    // Map to degrees
    const xWalk = constrainedGamma;
    const yWalk = -constrainedBeta;
    
    kText.style.transform = `rotateY(${xWalk}deg) rotateX(${yWalk}deg)`;
    
    floatEls.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-speed')) || 10;
      const baseRot = parseFloat(el.getAttribute('data-rot')) || 0;
      const xOffset = (constrainedGamma / 25) * speed;
      const yOffset = (constrainedBeta / 25) * speed;
      
      el.style.transform = `translate(${xOffset}px, ${yOffset}px) rotate(${baseRot}deg)`;
    });
  }

  function initGyroscope() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ requires user gesture to grant sensor permission
      const requestGyroPermission = () => {
        DeviceOrientationEvent.requestPermission()
          .then((permissionState) => {
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
            }
          })
          .catch(console.error);
        
        // Cleanup interaction listeners once requested
        document.removeEventListener('click', requestGyroPermission);
        document.removeEventListener('touchstart', requestGyroPermission);
      };
      
      document.addEventListener('click', requestGyroPermission);
      document.addEventListener('touchstart', requestGyroPermission);
    } else {
      // Android / other browsers
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }

  initGyroscope();

  function spawnConfetti(x, y) {
    const colors = ['var(--lime)', 'var(--cyan)', 'var(--pink)', 'var(--yellow)', '#fff', '#000'];
    const particleCount = 14;
    
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.classList.add('stamp-particle');
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.floor(Math.random() * 6) + 6;
      
      p.style.background = color;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.floor(Math.random() * 80) + 40;
      const tx = Math.cos(angle) * radius;
      const ty = Math.sin(angle) * radius;
      const rot = Math.floor(Math.random() * 360);
      
      p.style.setProperty('--tx', tx + 'px');
      p.style.setProperty('--ty', ty + 'px');
      p.style.setProperty('--rot', rot + 'deg');
      
      stickerCanvas.appendChild(p);
      
      setTimeout(() => p.remove(), 600);
    }
  }

  homePage.addEventListener('click', (e) => {
    if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.nav-toggle') || e.target.closest('.terminal-window')) return;

    const { left, top } = homePage.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
    const randomRot = Math.floor(Math.random() * 40) - 20;

    const stickerEl = document.createElement('div');
    stickerEl.classList.add('stamped-sticker');
    stickerEl.innerText = randomSticker.text;
    stickerEl.style.background = randomSticker.bg;
    stickerEl.style.left = `${x}px`;
    stickerEl.style.top = `${y}px`;
    stickerEl.style.setProperty('--rot', `${randomRot}deg`);

    stickerCanvas.appendChild(stickerEl);
    
    spawnConfetti(x, y);

    if (stickerCanvas.children.length > 20) {
      const oldSticker = stickerCanvas.querySelector('.stamped-sticker');
      if (oldSticker) oldSticker.remove();
    }
  });
}


/* ── DRAGGABLE TERMINAL WIDGET ──────────────────────────── */
const termWindow = document.getElementById('terminalWindow');
const termHeader = document.getElementById('terminalHeader');
const termMin = document.getElementById('terminalMin');
const termMax = document.getElementById('terminalMax');
const termInput = document.getElementById('terminalInput');
const termOutput = document.getElementById('terminalOutput');
const termBody = document.getElementById('terminalBody');

let isDragging = false;
let startX, startY;
let translateX = 0, translateY = 0;
let initialTranslateX = 0, initialTranslateY = 0;

if (termHeader && termWindow) {
  termHeader.addEventListener('mousedown', (e) => {
    if (e.target.closest('.terminal-btn')) return; 
    if (termWindow.classList.contains('maximized')) return; 
    
    isDragging = true;
    termWindow.style.transition = 'none'; 
    
    startX = e.clientX;
    startY = e.clientY;
    
    initialTranslateX = translateX;
    initialTranslateY = translateY;
    
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
  });
  
  function dragMove(e) {
    if (!isDragging) return;
    
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    translateX = initialTranslateX + dx;
    translateY = initialTranslateY + dy;
    
    termWindow.style.transform = `translate(${translateX}px, ${translateY}px)`;
  }
  
  function dragEnd() {
    isDragging = false;
    termWindow.style.transition = '';
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
  }
  
  termMin?.addEventListener('click', () => {
    termWindow.classList.toggle('minimized');
    if (termWindow.classList.contains('minimized')) {
      termWindow.classList.remove('maximized');
      termMin.textContent = '+';
    } else {
      termMin.textContent = '−';
    }
  });
  
  termMax?.addEventListener('click', () => {
    termWindow.classList.toggle('maximized');
    if (termWindow.classList.contains('maximized')) {
      termWindow.classList.remove('minimized');
      termMin.textContent = '−';
      termWindow.style.transform = '';
      translateX = 0;
      translateY = 0;
    } else {
      termWindow.style.transform = `translate(${translateX}px, ${translateY}px)`;
    }
  });
}

/* ── TERMINAL LOGIC & CMDS ───────────────────────────────── */
const commandHistory = [];
let historyIndex = -1;

const bioDescription = 
`Pratham Uday Pingle — Flutter & Web Dev
Pursuing B.Sc. IT at St. Xavier's, Mumbai.

Type:
  'skills'   - tech stack status
  'projects' - list of main works
  'contact'  - get in touch details`;

const skillsData = [
  { name: "Flutter/Dart", level: 90, bar: "█████████░" },
  { name: "JavaScript/ES6", level: 85, bar: "████████░░" },
  { name: "Node.js/Express", level: 80, bar: "████████░░" },
  { name: "React.js", level: 75, bar: "███████░░░" },
  { name: "SQL/MongoDB", level: 80, bar: "████████░░" },
  { name: "Python", level: 70, bar: "███████░░░" }
];

const projectsData = [
  { name: "MYPINS", desc: "Pinterest masonry visual bookmarks", link: "https://my-pins-final-main.vercel.app" },
  { name: "LOCKIN", desc: "Full-stack habit & fitness dashboard", link: "https://lockin-app-ten.vercel.app" },
  { name: "CLASSMGR", desc: "Flutter room booking client", link: "https://github.com/pratham092006/Classmrgr" },
  { name: "PREDICTIVE API", desc: "Predictive maintenance checking API", link: "https://predictive-maintenance-api.vercel.app" }
];

const contactEndpoint = 'https://formsubmit.co/ajax/Pinglepratham618@gmail.com';

const themesList = ['matrix', 'cyberpunk', 'sunset', 'default'];
let activeThemeIndex = 3; 

function printLine(text, type = '') {
  if (!termOutput) return;
  const line = document.createElement('div');
  line.classList.add('line');
  if (type) line.classList.add(type);
  line.innerHTML = text;
  termOutput.appendChild(line);
  termBody.scrollTop = termBody.scrollHeight;
}

function bootTerminal() {
  if (!termOutput) return;
  termOutput.innerHTML = ''; 
  printLine("PrathamOS v1.0.2 booted successfully", "system");
  printLine("Type 'help' for command options.", "success");
  printLine("------------------------------------", "system");
}

bootTerminal();

const contactForm = document.getElementById('ajaxContactForm');
const formSubmitBtn = document.getElementById('formSubmitBtn');
const formStatus = document.getElementById('formStatus');

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!formSubmitBtn || !formStatus) return;

  const btnTextEl = formSubmitBtn.querySelector('span');
  const formData = new FormData(contactForm);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();

  formSubmitBtn.disabled = true;
  if (btnTextEl) btnTextEl.textContent = 'SENDING...';
  formStatus.textContent = '';
  formStatus.className = 'form-status';

  try {
    const payload = new FormData();
    payload.append('name', name);
    payload.append('email', email);
    payload.append('message', message);
    payload.append('_subject', `New portfolio message from ${name}`);
    payload.append('_template', 'table');
    payload.append('_captcha', 'false');

    const response = await fetch(contactEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: payload,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(result?.message || 'Unable to send message right now.');
    }

    contactForm.reset();
    formStatus.textContent = 'Success! Message sent. I will get back to you soon.';
    formStatus.classList.add('success');
  } catch (error) {
    formStatus.textContent = 'Could not send the message right now. Please email me directly at Pinglepratham618@gmail.com.';
    formStatus.classList.add('error');
    console.error('Contact form error:', error);
  } finally {
    formSubmitBtn.disabled = false;
    if (btnTextEl) btnTextEl.textContent = 'SEND MESSAGE';
  }
});

termInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const inputVal = termInput.value.trim();
    if (!inputVal) return;
    
    printLine(`<span class="prompt">pratham:~$</span> ${inputVal}`);
    
    const cmd = inputVal.toLowerCase();
    
    if (cmd === 'clear') {
      termOutput.innerHTML = '';
    } else if (cmd === 'help') {
      printLine("Available commands:", "success");
      printLine("  about     - Brief bio information");
      printLine("  skills    - Visual tech stack breakdown");
      printLine("  projects  - List of featured projects");
      printLine("  contact   - Get links & ways to talk to me");
      printLine("  theme     - Cycle console color layout");
      printLine("  clear     - Clean the screen log");
    } else if (cmd === 'about') {
      printLine(bioDescription);
    } else if (cmd === 'skills') {
      printLine("TECHNICAL SKILLS PROFILE:", "success");
      skillsData.forEach(s => {
        printLine(`  ${s.name.padEnd(16)}: [${s.bar}] ${s.level}%`);
      });
    } else if (cmd === 'projects') {
      printLine("FEATURED SELECTED WORKS:", "success");
      projectsData.forEach((p, idx) => {
        printLine(`  0${idx+1}. <a href="${p.link}" target="_blank" style="color:var(--lime); text-decoration:underline;">${p.name}</a> - ${p.desc}`);
      });
    } else if (cmd === 'contact') {
      printLine("LET'S CONNECT!", "success");
      printLine("  Email    : Pinglepratham618@gmail.com");
      printLine("  LinkedIn : <a href='https://www.linkedin.com/in/pratham-pingle-71a977318/' target='_blank' style='color:var(--cyan);'>pratham-pingle</a>");
      printLine("  GitHub   : <a href='https://github.com/pratham092006' target='_blank' style='color:var(--cyan);'>pratham092006</a>");
      printLine("  Or navigate to #/contact to submit a live message!");
    } else if (cmd === 'theme') {
      termWindow.classList.remove('theme-matrix', 'theme-cyberpunk', 'theme-sunset');
      
      activeThemeIndex = (activeThemeIndex + 1) % themesList.length;
      const newTheme = themesList[activeThemeIndex];
      
      if (newTheme !== 'default') {
        termWindow.classList.add(`theme-${newTheme}`);
      }
      printLine(`Active theme switched to: ${newTheme.toUpperCase()}`, "success");
    } else {
      printLine(`bash: command not found: ${inputVal}. Type 'help' for command listings.`, "error");
    }
    
    commandHistory.push(inputVal);
    historyIndex = commandHistory.length;
    
    termInput.value = '';
    termBody.scrollTop = termBody.scrollHeight;
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      termInput.value = commandHistory[historyIndex];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      termInput.value = commandHistory[historyIndex];
    } else {
      historyIndex = commandHistory.length;
      termInput.value = '';
    }
  }
});

termBody?.addEventListener('click', () => termInput?.focus());
