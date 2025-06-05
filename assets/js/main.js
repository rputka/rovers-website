// Template Loading
async function loadTemplate(elementId, templatePath) {
  try {
    const response = await fetch(templatePath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  } catch (error) {
    console.error(`Error loading template ${templatePath}:`, error);
  }
}

// Load templates when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  // Load navbar and footer templates
  await loadTemplate('navbar-template', '/templates/navbar.html');
  await loadTemplate('footer-template', '/templates/footer.html');

  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenuButton && navMenu) {
    mobileMenuButton.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileMenuButton.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu?.contains(e.target) && !mobileMenuButton?.contains(e.target)) {
      navMenu?.classList.remove('active');
      mobileMenuButton?.classList.remove('active');
    }
  });

  // Capital Fund Carousel and Modal
  const capdevCarousel = document.getElementById('capdev-carousel');
  if (capdevCarousel) {
    const total = 11;
    let current = 1;
    const img = document.getElementById('capdev-img');
    const prev = document.getElementById('capdev-prev');
    const next = document.getElementById('capdev-next');
    const indicator = document.getElementById('capdev-indicator');
    
    // Modal elements
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');
    const closeBtn = document.querySelector('.modal-close');

    function update() {
      const newSrc = `../assets/images/capdev${current}.png`;
      img.src = newSrc;
      img.alt = `Capital Fund Photo ${current}`;
      indicator.textContent = `Photo ${current} of ${total}`;
    }

    function updateModal() {
      modalImg.src = `../assets/images/capdev${current}.png`;
      modalImg.alt = `Enlarged Capital Fund Photo ${current}`;
    }

    // Carousel navigation
    prev.onclick = function() {
      current = current === 1 ? total : current - 1;
      update();
    };
    next.onclick = function() {
      current = current === total ? 1 : current + 1;
      update();
    };

    // Modal navigation
    modalPrev.onclick = function(e) {
      e.stopPropagation();
      current = current === 1 ? total : current - 1;
      updateModal();
    };
    modalNext.onclick = function(e) {
      e.stopPropagation();
      current = current === total ? 1 : current + 1;
      updateModal();
    };

    // Open modal when clicking carousel image
    img.onclick = function() {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
      updateModal();
    };

    // Close modal
    closeBtn.onclick = function() {
      modal.style.display = "none";
      document.body.style.overflow = ""; // Restore scrolling
    };

    // Close modal when clicking outside the image
    modal.onclick = function(e) {
      if (e.target === modal) {
        modal.style.display = "none";
        document.body.style.overflow = ""; // Restore scrolling
      }
    };

    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === "Escape" && modal.style.display === "flex") {
        modal.style.display = "none";
        document.body.style.overflow = ""; // Restore scrolling
      }
    });

    update();
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Contact Form Handling
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://formspree.io/f/mnnvnydz', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          alert('Message sent successfully!');
          contactForm.reset();
        } else {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        alert('Error sending message. Please try again.');
        console.error('Form submission error:', error);
      } finally {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      }
    });
  }

  // Intersection Observer for animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with animation classes
  document.querySelectorAll('.animate-on-scroll').forEach(element => {
    observer.observe(element);
  });

  // Handle image lazy loading
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }

  // Dropdown logic for navigation
  const navDropdown = document.querySelector('.nav-dropdown');
  const navDropdownToggle = document.querySelector('.nav-dropdown-toggle');
  const navDropdownMenu = document.querySelector('.nav-dropdown-menu');

  if (navDropdown && navDropdownToggle && navDropdownMenu) {
    navDropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navDropdown.classList.toggle('open');
      navDropdownToggle.setAttribute('aria-expanded', navDropdown.classList.contains('open'));
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!navDropdown.contains(e.target)) {
        navDropdown.classList.remove('open');
        navDropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Highlight active nav link
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath || (link.getAttribute('href') === '/' && currentPath === '/')) {
      link.classList.add('active');
    }
  });

  // Footer dropdown functionality
  const footerDropdowns = document.querySelectorAll('.footer-dropdown');
  
  footerDropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.footer-dropdown-toggle');
    
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // If this is a nested dropdown, don't close siblings
      const isNested = dropdown.closest('.footer-dropdown-menu') !== null;
      
      if (!isNested) {
        // Close all other top-level dropdowns
        const siblings = Array.from(dropdown.parentElement.children).filter(
          child => child !== dropdown && child.classList.contains('footer-dropdown')
        );
        siblings.forEach(sibling => {
          sibling.classList.remove('active');
          const nestedDropdowns = sibling.querySelectorAll('.footer-dropdown');
          nestedDropdowns.forEach(nested => nested.classList.remove('active'));
        });
      }
      
      // Toggle current dropdown
      dropdown.classList.toggle('active');
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.footer-dropdown')) {
      footerDropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });
}); 