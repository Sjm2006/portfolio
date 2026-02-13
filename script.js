// script.js

// Create orbit rings around photo
function createOrbitRings() {
  const photoContainer = document.getElementById('photoContainer');
  const sizes = [420, 360, 300];
  for (let i = 0; i < 3; i++) {
    const ring = document.createElement('div');
    ring.className = 'orbit-ring';
    ring.style.width = `${sizes[i]}px`;
    ring.style.height = `${sizes[i]}px`;
    ring.style.left = `${(420 - sizes[i]) / 2}px`;
    ring.style.top = `${(420 - sizes[i]) / 2}px`;
    ring.style.animationDelay = `-${i * 2}s`;
    photoContainer.appendChild(ring);
  }
}

// Create moving particles around photo
function createMovingParticles() {
  const photoContainer = document.getElementById('photoContainer');
  const particleCount = 12;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'moving-particle';
    const angle = (i / particleCount) * Math.PI * 2;
    const distance = 220 + Math.random() * 80;
    const startX = 210 + Math.cos(angle) * 150;
    const startY = 210 + Math.sin(angle) * 150;
    const endX = 210 + Math.cos(angle + Math.PI) * distance;
    const endY = 210 + Math.sin(angle + Math.PI) * distance;
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.setProperty('--tx', `${endX - startX}px`);
    particle.style.setProperty('--ty', `${endY - startY}px`);
    particle.style.animationDelay = `${Math.random() * 5}s`;
    particle.style.animationDuration = `${Math.random() * 8 + 10}s`;
    photoContainer.appendChild(particle);
  }
}

// Create circuit lines
function createCircuitLines() {
  const circuitContainer = document.getElementById('circuitLines');
  const lineCount = 15;
  for (let i = 0; i < lineCount; i++) {
    const line = document.createElement('div');
    line.className = 'circuit-line';
    const width = Math.random() * 200 + 50;
    const height = Math.random() * 200 + 50;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const rotation = Math.random() * 360;
    line.style.width = `${Math.random() > 0.5 ? width + 'px' : '3px'}`;
    line.style.height = `${Math.random() > 0.5 ? height + 'px' : '3px'}`;
    line.style.left = `${posX}%`;
    line.style.top = `${posY}%`;
    line.style.transform = `rotate(${rotation}deg)`;
    line.style.animationDelay = `${Math.random() * 5}s`;
    line.style.animationDuration = `${Math.random() * 6 + 4}s`;
    circuitContainer.appendChild(line);
  }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Form submission handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const name = formData.get('name');
    alert(`Thank you, ${name}! Your message has been sent successfully. I'll get back to you within 24 hours.`);
    contactForm.reset();
  });
}

// Initialize all animations on load
window.addEventListener('load', function() {
  createOrbitRings();
  createMovingParticles();
  createCircuitLines();
});