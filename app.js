// AIM International Website JavaScript

// Application data
const appData = {
  company: {
    name: "AIM International",
    tagline: "the pentelligent choice",
    owner: "Vipin Pandey",
    ceo: "Tanmay Pandey",
    business_type: "Notebook and stationery manufacturing",
    distribution: "All India distribution"
  },
  products: [
    {
      category: "Notebooks",
      items: ["Exercise Notebooks", "Spiral Notebooks", "Composition Books", "Subject Notebooks", "Drawing Books"]
    },
    {
      category: "Stationery", 
      items: ["Pens", "Pencils", "Erasers", "Rulers", "Markers"]
    },
    {
      category: "Office Supplies",
      items: ["Files", "Folders", "Clipboards", "Staplers", "Paper Clips"]
    },
    {
      category: "Educational Materials",
      items: ["Workbooks", "Practice Sheets", "Chart Papers", "Project Files", "Lab Manuals"]
    }
  ],
  services: [
    {
      title: "Custom Manufacturing",
      description: "Tailored notebook production with your specifications"
    },
    {
      title: "Bulk Distribution", 
      description: "Nationwide supply chain and logistics support"
    },
    {
      title: "Quality Assurance",
      description: "Rigorous testing and quality control processes"
    },
    {
      title: "Design Services",
      description: "Custom covers and branding solutions"
    }
  ],
  contact: {
    phones: [
      {
        number: "7850837609",
        person: "Tanmay Pandey",
        role: "CEO"
      },
      {
        number: "9810892670", 
        person: "Vipin Pandey",
        role: "Owner"
      }
    ],
    email: "aiminternational72021@gmail.com",
    address: "Arazi no.232 8 block B luv kush Puram Bamba road Kalyanpur Kanpur, Uttar Pradesh",
    office_hours: "Monday - Saturday: 9:00 AM - 6:00 PM"
  },
  testimonials: [
    {
      name: "Rajesh Kumar",
      company: "ABC School", 
      text: "AIM International provides excellent quality notebooks at competitive prices. Our students love their products!"
    },
    {
      name: "Priya Sharma",
      company: "Office Solutions Ltd",
      text: "Their customer service is outstanding and delivery is always on time. Highly recommended!"
    }
  ]
};

// DOM Elements - Initialize after DOM is loaded
let navToggle, navMenu, navLinks, sections, contactForm, newsletterForm, productsGrid, filterBtns, faqItems, loading, successModal, modalClose, liveChatBtn;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  // Initialize DOM elements
  navToggle = document.getElementById('nav-toggle');
  navMenu = document.getElementById('nav-menu');
  navLinks = document.querySelectorAll('.nav__link');
  sections = document.querySelectorAll('.section');
  contactForm = document.getElementById('contact-form');
  newsletterForm = document.getElementById('newsletter-form');
  productsGrid = document.getElementById('products-grid');
  filterBtns = document.querySelectorAll('.filter-btn');
  faqItems = document.querySelectorAll('.faq__item');
  loading = document.getElementById('loading');
  successModal = document.getElementById('success-modal');
  modalClose = document.getElementById('modal-close');
  liveChatBtn = document.getElementById('live-chat-btn');

  initializeApp();
});

function initializeApp() {
  // Hide loading screen
  setTimeout(() => {
    if (loading) {
      loading.classList.add('hidden');
    }
  }, 1000);

  // Initialize components
  initializeNavigation();
  initializeForms();
  initializeProductFilter();
  initializeFAQ();
  initializeAnimations();
  populateProducts();
  
  // Set active section based on hash or default to home
  const hash = window.location.hash.substring(1) || 'home';
  showSection(hash);
}

// Navigation functionality
function initializeNavigation() {
  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }

  // Navigation link clicks
  if (navLinks) {
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const section = link.getAttribute('data-section');
        if (section) {
          showSection(section);
          
          // Close mobile menu
          if (navMenu) navMenu.classList.remove('active');
          if (navToggle) navToggle.classList.remove('active');
          
          // Update URL hash
          history.pushState(null, null, `#${section}`);
        }
      });
    });
  }

  // Handle button clicks with data-section attribute
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.hasAttribute('data-section')) {
      e.preventDefault();
      e.stopPropagation();
      const section = target.getAttribute('data-section');
      showSection(section);
      history.pushState(null, null, `#${section}`);
    }
  });

  // Handle footer navigation links
  document.querySelectorAll('a[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      if (section) {
        showSection(section);
        history.pushState(null, null, `#${section}`);
      }
    });
  });

  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1) || 'home';
    showSection(hash);
  });
}

function showSection(sectionId) {
  console.log('Showing section:', sectionId);
  
  // Hide all sections
  if (sections) {
    sections.forEach(section => {
      section.classList.remove('active');
    });
  }

  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    console.log('Activated section:', sectionId);
  } else {
    console.warn('Section not found:', sectionId);
    // Fallback to home section
    const homeSection = document.getElementById('home');
    if (homeSection) {
      homeSection.classList.add('active');
    }
  }

  // Update active nav link
  if (navLinks) {
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      }
    });
  }

  // Scroll to top of section
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Form handling
function initializeForms() {
  // Contact form
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }

  // Newsletter form
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterForm);
  }

  // Modal close
  if (modalClose) {
    modalClose.addEventListener('click', (e) => {
      e.preventDefault();
      successModal.classList.add('hidden');
    });
  }

  // Live chat button
  if (liveChatBtn) {
    liveChatBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert(`Live chat feature would be integrated with your customer support system. For now, please use our contact form or call us directly at:\n\n+91-${appData.contact.phones[0].number} (${appData.contact.phones[0].person} - ${appData.contact.phones[0].role})\n+91-${appData.contact.phones[1].number} (${appData.contact.phones[1].person} - ${appData.contact.phones[1].role})`);
    });
  }
}

function handleContactForm(e) {
  e.preventDefault();
  
  // Clear previous errors
  clearFormErrors();
  
  // Get form data
  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);
  
  // Validate form
  if (!validateContactForm(data)) {
    return;
  }
  
  // Simulate form submission
  submitContactForm(data);
}

function validateContactForm(data) {
  let isValid = true;
  
  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    showFieldError('name', 'Please enter a valid name (at least 2 characters)');
    isValid = false;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    showFieldError('email', 'Please enter a valid email address');
    isValid = false;
  }
  
  // Phone validation (optional but if provided, should be valid)
  if (data.phone && data.phone.length > 0) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(data.phone)) {
      showFieldError('phone', 'Please enter a valid phone number');
      isValid = false;
    }
  }
  
  // Subject validation
  if (!data.subject) {
    showFieldError('subject', 'Please select a subject');
    isValid = false;
  }
  
  // Message validation
  if (!data.message || data.message.trim().length < 10) {
    showFieldError('message', 'Please enter a message (at least 10 characters)');
    isValid = false;
  }
  
  return isValid;
}

function showFieldError(fieldName, message) {
  const errorElement = document.getElementById(`${fieldName}-error`);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearFormErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(element => {
    element.textContent = '';
  });
}

function submitContactForm(data) {
  // Show loading state
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  
  // Simulate API call - in real implementation, this would send to the actual email
  setTimeout(() => {
    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    // Clear form
    contactForm.reset();
    
    // Show success modal
    if (successModal) {
      successModal.classList.remove('hidden');
    }
    
    // Log the form data with real contact info
    console.log('Contact form submitted:', {
      ...data,
      destinationEmail: appData.contact.email,
      contactNumbers: appData.contact.phones
    });
  }, 2000);
}

function handleNewsletterForm(e) {
  e.preventDefault();
  
  const formData = new FormData(newsletterForm);
  const email = formData.get('email');
  
  if (!email) {
    alert('Please enter your email address');
    return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address');
    return;
  }
  
  // Show loading state
  const submitBtn = newsletterForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Subscribing...';
  submitBtn.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    // Clear form
    newsletterForm.reset();
    
    // Show success message
    alert('Thank you for subscribing to our newsletter!');
    
    console.log('Newsletter subscription:', { 
      email,
      destinationEmail: appData.contact.email
    });
  }, 1500);
}

// Product filtering
function initializeProductFilter() {
  if (!filterBtns || !filterBtns.length || !productsGrid) return;
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = btn.getAttribute('data-filter');
      
      // Update active filter button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter products
      filterProducts(filter);
    });
  });
}

function populateProducts() {
  if (!productsGrid) return;
  
  const productIcons = {
    'Notebooks': '📓',
    'Stationery': '✏️',
    'Office Supplies': '📁',
    'Educational Materials': '📚'
  };
  
  let productsHTML = '';
  
  appData.products.forEach(category => {
    category.items.forEach(item => {
      const categoryKey = category.category.toLowerCase().replace(/\s+/g, '');
      const icon = productIcons[category.category] || '📝';
      
      productsHTML += `
        <div class="product-card" data-category="${categoryKey}">
          <div class="product-card__image">
            ${icon}
          </div>
          <div class="product-card__content">
            <h3 class="product-card__title">${item}</h3>
            <p class="product-card__category">${category.category}</p>
          </div>
        </div>
      `;
    });
  });
  
  productsGrid.innerHTML = productsHTML;
}

function filterProducts(filter) {
  if (!productsGrid) return;
  
  const productCards = productsGrid.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    if (filter === 'all') {
      card.style.display = 'block';
    } else {
      const category = card.getAttribute('data-category');
      if (category === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    }
  });
}

// FAQ functionality
function initializeFAQ() {
  if (!faqItems || !faqItems.length) return;
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    if (question) {
      question.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Close other FAQ items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current item
        item.classList.toggle('active');
      });
    }
  });
}

// Animation and scroll effects
function initializeAnimations() {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  const animatedElements = document.querySelectorAll('.fade-in, .card, .feature, .stat');
  animatedElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
  
  // Smooth scrolling for anchor links
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
  
  // Header scroll effect
  let lastScrollTop = 0;
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      if (header) header.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      if (header) header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
  });
}

// Error handling
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
});

// Accessibility enhancements
document.addEventListener('keydown', (e) => {
  // ESC key closes modals
  if (e.key === 'Escape') {
    const visibleModal = document.querySelector('.modal:not(.hidden)');
    if (visibleModal) {
      visibleModal.classList.add('hidden');
    }
    
    // Close mobile menu
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      if (navToggle) navToggle.classList.remove('active');
    }
  }
});

// Enhanced form field validation
function enhanceFormFields() {
  const formInputs = document.querySelectorAll('.form-control');
  
  formInputs.forEach(input => {
    // Real-time validation
    input.addEventListener('input', () => {
      validateField(input);
    });
  });
}

function validateField(field) {
  const fieldName = field.name;
  const value = field.value;
  
  // Clear previous errors
  const errorElement = document.getElementById(`${fieldName}-error`);
  if (errorElement) {
    errorElement.textContent = '';
  }
  
  // Field-specific validation
  switch (fieldName) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        showFieldError(fieldName, 'Please enter a valid email address');
      }
      break;
      
    case 'phone':
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (value && !phoneRegex.test(value)) {
        showFieldError(fieldName, 'Please enter a valid phone number');
      }
      break;
  }
}

// Initialize enhanced features after DOM is ready
setTimeout(() => {
  enhanceFormFields();
}, 100);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showSection,
    validateContactForm,
    filterProducts,
    appData
  };
}