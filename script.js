// script.js

// Get container size dynamically
function getContainerSize() {
  const photoContainer = document.getElementById('photoContainer');
  if (!photoContainer) return 420;
  return Math.min(photoContainer.offsetWidth, 420);
}

// Create orbit rings around photo - mobile responsive
function createOrbitRings() {
  const photoContainer = document.getElementById('photoContainer');
  if (!photoContainer) return;
  
  const containerSize = getContainerSize();
  const sizes = [
    containerSize,
    containerSize * 0.857, // 360/420
    containerSize * 0.714  // 300/420
  ];
  
  for (let i = 0; i < 3; i++) {
    const ring = document.createElement('div');
    ring.className = 'orbit-ring';
    ring.style.width = `${sizes[i]}px`;
    ring.style.height = `${sizes[i]}px`;
    ring.style.left = `${(containerSize - sizes[i]) / 2}px`;
    ring.style.top = `${(containerSize - sizes[i]) / 2}px`;
    ring.style.animationDelay = `-${i * 2}s`;
    photoContainer.appendChild(ring);
  }
}

// Create moving particles around photo - mobile responsive
function createMovingParticles() {
  const photoContainer = document.getElementById('photoContainer');
  if (!photoContainer) return;
  
  const containerSize = getContainerSize();
  const center = containerSize / 2;
  
  // Reduce particle count on smaller screens
  const particleCount = window.innerWidth < 768 ? 8 : 12;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'moving-particle';
    const angle = (i / particleCount) * Math.PI * 2;
    const distance = (containerSize * 0.52) + Math.random() * (containerSize * 0.19);
    const startRadius = containerSize * 0.36;
    
    const startX = center + Math.cos(angle) * startRadius;
    const startY = center + Math.sin(angle) * startRadius;
    const endX = center + Math.cos(angle + Math.PI) * distance;
    const endY = center + Math.sin(angle + Math.PI) * distance;
    
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.setProperty('--tx', `${endX - startX}px`);
    particle.style.setProperty('--ty', `${endY - startY}px`);
    particle.style.animationDelay = `${Math.random() * 5}s`;
    particle.style.animationDuration = `${Math.random() * 8 + 10}s`;
    photoContainer.appendChild(particle);
  }
}

// Create circuit lines - reduce on mobile
function createCircuitLines() {
  const circuitContainer = document.getElementById('circuitLines');
  if (!circuitContainer) return;
  
  // Reduce line count on mobile for better performance
  const lineCount = window.innerWidth < 768 ? 8 : 15;
  
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

// Clear and recreate animations on resize
function reinitializeAnimations() {
  const photoContainer = document.getElementById('photoContainer');
  if (!photoContainer) return;
  
  // Remove existing orbit rings and particles
  const existingRings = photoContainer.querySelectorAll('.orbit-ring, .moving-particle');
  existingRings.forEach(el => el.remove());
  
  // Recreate with new sizes
  createOrbitRings();
  createMovingParticles();
}

// Debounce function to limit resize event calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Handle window resize for responsive animations
const debouncedResize = debounce(() => {
  reinitializeAnimations();
}, 250);

window.addEventListener('resize', debouncedResize);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Initialize EmailJS with your Public Key
(function() {
  try {
    emailjs.init("BW-BZcyECGiOQe0zP");
    console.log('✅ EmailJS initialized successfully');
  } catch (error) {
    console.error('❌ EmailJS initialization failed:', error);
  }
})();

// Form submission handling with EmailJS - Mobile Optimized + Auto Reply
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('📝 Form submitted');
    
    // Get form values directly
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    
    console.log('📋 Form data:', { name, email, message });
    
    // Validate inputs
    if (!name || !email || !message) {
      alert('Please fill in all fields');
      return;
    }
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'SENDING...';
    submitBtn.disabled = true;
    
    // Prepare template parameters
    const templateParams = {
      from_name: name,
      reply_to: email,
      message: message,
      to_name: 'Soumyajeet'
    };
    
    console.log('📧 Sending emails with params:', templateParams);
    
    // Send email to YOU (notification)
    console.log('📤 Sending notification email to you...');
    const sendToMe = emailjs.send('service_il351vr', 'template_t9o5rdq', templateParams)
      .then(response => {
        console.log('✅ Notification email sent successfully!', response);
        return response;
      })
      .catch(error => {
        console.error('❌ Notification email failed:', error);
        throw error;
      });
    
    // Send auto-reply to SENDER
    console.log('📤 Sending auto-reply email to sender...');
    const sendToSender = emailjs.send('service_il351vr', 'template_oyp16d8', templateParams)
      .then(response => {
        console.log('✅ Auto-reply email sent successfully!', response);
        return response;
      })
      .catch(error => {
        console.error('❌ Auto-reply email failed:', error);
        throw error;
      });
    
    // Wait for both emails to send
    Promise.all([sendToMe, sendToSender])
      .then(function(responses) {
        console.log('🎉 Both emails sent successfully!', responses);
        alert('Thank you, ' + name + '! Your message has been sent successfully. You\'ll receive a confirmation email shortly. I\'ll get back to you within 24 hours.');
        
        // Reset form
        nameInput.value = '';
        emailInput.value = '';
        messageInput.value = '';
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      })
      .catch(function(error) {
        console.error('💥 Failed to send emails:', error);
        console.error('Error details:', {
          text: error.text,
          status: error.status,
          message: error.message
        });
        
        // Check which email failed
        if (error.text && error.text.includes('template_t9o5rdq')) {
          alert('Failed to send notification email. Please try again.');
        } else if (error.text && error.text.includes('template_oyp16d8')) {
          alert('Your message was sent, but the auto-reply failed. I\'ll still respond within 24 hours!');
        } else {
          alert('Oops! Something went wrong. Please try again or contact me directly at soumyajeet2006mondal@gmail.com\n\nError: ' + (error.text || error.message || 'Unknown error'));
        }
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
  });
}

// Initialize all animations on load
window.addEventListener('load', function() {
  createOrbitRings();
  createMovingParticles();
  createCircuitLines();
});

// Handle orientation change on mobile devices
window.addEventListener('orientationchange', function() {
  setTimeout(reinitializeAnimations, 200);
});