// ============================================================
// 3D IMMERSIVE PORTFOLIO — CLEAN INTERACTIVE ENGINE
// ============================================================

// EmailJS Init
(function () {
  if (typeof emailjs !== 'undefined') {
    emailjs.init("BW-BZcyECGiOQe0zP");
  }
})();

// ============ PARTICLE BACKGROUND ============
// NOTE: Replaced by Three.js 3D background (threejs-bg.js)
// Keeping function stub to avoid errors if called elsewhere
function initParticles() {
  // No-op: Three.js canvas handles the particle/background layer
}

// ============ 3D TILT ON CARDS ============
function initTilt() {
  if ('ontouchstart' in window) return;
  
  document.querySelectorAll('.about-card, .tech-category').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
      el.style.transition = 'transform 0.1s ease-out';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });
}

// ============ AVATAR 3D TILT ENGINE ============
function initAvatarTilt() {
  // Disable heavy tilt on touch/mobile — not needed, saves perf
  if ('ontouchstart' in window) return;

  const avatar = document.getElementById('avatar3d');
  const scene  = avatar && avatar.closest('.avatar-scene');
  if (!avatar || !scene) return;

  // Lerp state — smooth interpolation, zero jitter
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let rafId = null;
  let isHovered = false;

  const MAX_TILT      = 12;  // max rotation in degrees
  const MAX_TRANSLATE = 8;   // max position shift in px

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    currentX = lerp(currentX, targetX, 0.08);
    currentY = lerp(currentY, targetY, 0.08);

    // Single composite transform — GPU compositor only, no reflow
    avatar.style.transform = [
      'perspective(1000px)',
      `rotateY(${currentX.toFixed(3)}deg)`,
      `rotateX(${currentY.toFixed(3)}deg)`,
      `translateX(${(currentX * MAX_TRANSLATE / MAX_TILT).toFixed(2)}px)`,
      `translateY(${(-currentY * MAX_TRANSLATE / MAX_TILT).toFixed(2)}px)`,
      `scale(${isHovered ? 1.03 : 1})`
    ].join(' ');

    const dist = Math.abs(currentX - targetX) + Math.abs(currentY - targetY);
    if (isHovered || dist > 0.01) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  function startTick() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  scene.addEventListener('mousemove', e => {
    const rect = scene.getBoundingClientRect();
    const nx = (e.clientX - rect.left)  / rect.width  - 0.5;
    const ny = (e.clientY - rect.top)   / rect.height - 0.5;
    targetX =  nx * MAX_TILT;
    targetY = -ny * MAX_TILT;
    startTick();
  }, { passive: true });

  scene.addEventListener('mouseenter', () => { isHovered = true;  startTick(); });
  scene.addEventListener('mouseleave', () => {
    isHovered = false;
    targetX = 0;
    targetY = 0;
    startTick();
  });
}

// ============ HERO PARALLAX (replaced by avatar tilt) ============
function initHeroParallax() { /* no-op: initAvatarTilt handles this */ }

// ============ ORBIT RINGS (replaced by CSS avatar-ring) ============
function initOrbitRings() { /* no-op: orbit rings are pure CSS now */ }
function initReveal() {
  const els = document.querySelectorAll(
    '.about-card, .timeline-item, .skill-card, .project-card, .contact-item, .contact-form, .section-title, .timeline-body, .eco-row'
  );

  els.forEach((el, i) => {
    el.setAttribute('data-reveal', '');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// ============ HEADER SCROLL STATE ============
function initHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ============ ACTIVE NAV ============
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) {
        current = s.getAttribute('id');
      }
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });
}

// ============ SMOOTH SCROLL ============
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ============ CONTACT FORM ============
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'SENDING...';
    btn.disabled = true;

    if (typeof emailjs !== 'undefined') {
      const SERVICE_ID  = 'service_il351vr';
      const CONTACT_TPL = 'template_t9o5rdq';   // Contact Us — goes to you
      const REPLY_TPL   = 'template_oyp16d8';   // Auto-Reply — goes to sender

      // Collect form data for auto-reply
      const formData = {
        from_name: form.querySelector('[name="from_name"]').value,
        reply_to:  form.querySelector('[name="reply_to"]').value,
        message:   form.querySelector('[name="message"]').value,
      };

      // Send Contact Us email first, then Auto-Reply
      emailjs.sendForm(SERVICE_ID, CONTACT_TPL, this)
        .then(() => emailjs.send(SERVICE_ID, REPLY_TPL, formData))
        .then(() => {
          btn.textContent = '✓ SENT SUCCESSFULLY';
          btn.style.background = '#059669';
          form.reset();
          setTimeout(() => {
            btn.textContent = orig;
            btn.style.background = '';
            btn.disabled = false;
          }, 3500);
        })
        .catch(() => {
          btn.textContent = '✗ FAILED TO SEND';
          btn.style.background = '#dc2626';
          setTimeout(() => {
            btn.textContent = orig;
            btn.style.background = '';
            btn.disabled = false;
          }, 3500);
        });
    }
  });
}

// ============ MAGNETIC BUTTONS ============
function initMagnetic() {
  if ('ontouchstart' in window) return;

  document.querySelectorAll('.btn, .social-link-hero, .social-link').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
      el.style.transition = 'transform 0.1s ease-out';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });
}

// ============ CIRCUIT LINES ============
function initCircuitLines() {
  const container = document.getElementById('circuitLines');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 0; i < 10; i++) {
    const line = document.createElement('div');
    line.className = 'circuit-line';
    const h = Math.random() > 0.5;
    Object.assign(line.style, {
      position: 'absolute',
      width: h ? `${60 + Math.random() * 120}px` : '1px',
      height: h ? '1px' : `${60 + Math.random() * 120}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      background: `rgba(124, 92, 252, ${0.08 + Math.random() * 0.1})`,
      animationDelay: `${Math.random() * 4}s`,
    });
    container.appendChild(line);
  }
}

// ============ INIT ALL ============
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCircuitLines();
  initOrbitRings();
  initReveal();
  initHeader();
  initActiveNav();
  initSmoothScroll();
  initContactForm();
  initTilt();
  initHeroParallax();
  initAvatarTilt();
  initMagnetic();
});