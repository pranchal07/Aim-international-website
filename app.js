// AIM International Website JavaScript

const API_BASE_URL = 'https://aim-international-website.onrender.com';

// Application data (only static parts not loaded from backend)
const appData = {
  company: {
    name: "AIM International",
    tagline: "the pentelligent choice",
    owner: "Vipin Pandey",
    ceo: "Tanmay Pandey",
    business_type: "Notebook and stationery manufacturing",
    distribution: "All India distribution"
  },
  contact: {
    phones: [
      { number: "7850837609", person: "Tanmay Pandey", role: "CEO" },
      { number: "9810892670", person: "Vipin Pandey", role: "Owner" }
    ],
    email: "aiminternational72021@gmail.com",
    address: "Arazi no.232 8 block B luv kush Puram Bamba road Kalyanpur Kanpur, Uttar Pradesh",
    office_hours: "Monday - Saturday: 9:00 AM - 6:00 PM"
  }
};

// DOM Elements - Initialize after DOM is loaded
let navToggle, navMenu, navLinks, sections, contactForm, newsletterForm, productsGrid, filterBtns, faqItems, loading, successModal, modalClose, liveChatBtn;

document.addEventListener('DOMContentLoaded', function() {
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
  if (loading) {
    setTimeout(() => loading.classList.add('hidden'), 1000);
  }

  initializeNavigation();
  initializeForms();
  initializeProductFilter();
  initializeFAQ();
  initializeAnimations();
  populateProducts();

  const hash = window.location.hash.substring(1) || 'home';
  showSection(hash);
}

function initializeNavigation() {
  if (navToggle) {
    navToggle.addEventListener('click', e => {
      e.preventDefault();
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }

  if (navLinks) {
    navLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        if (section) {
          showSection(section);
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          history.pushState(null, null, `#${section}`);
        }
      });
    });
  }

  document.addEventListener('click', e => {
    const target = e.target;
    if (target.hasAttribute('data-section')) {
      e.preventDefault();
      const section = target.getAttribute('data-section');
      showSection(section);
      history.pushState(null, null, `#${section}`);
    }
  });

  window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1) || 'home';
    showSection(hash);
  });
}

function showSection(sectionId) {
  if (sections) {
    sections.forEach(section => section.classList.remove('active'));
  }
  const targetSection = document.getElementById(sectionId);
  if (targetSection) targetSection.classList.add('active');
  if (navLinks) {
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      }
    });
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initializeForms() {
  if (contactForm) contactForm.addEventListener('submit', handleContactForm);
  if (newsletterForm) newsletterForm.addEventListener('submit', handleNewsletterForm);
  if (modalClose) {
    modalClose.addEventListener('click', e => {
      e.preventDefault();
      if (successModal) successModal.classList.add('hidden');
    });
  }
  if (liveChatBtn) {
    liveChatBtn.addEventListener('click', e => {
      e.preventDefault();
      alert(`Live chat feature is coming soon. Meanwhile, please contact us at:\n\n+91-${appData.contact.phones[0].number} (${appData.contact.phones[0].person})\n+91-${appData.contact.phones[1].number} (${appData.contact.phones[1].person})`);
    });
  }
}

function handleContactForm(e) {
  e.preventDefault();
  clearFormErrors();
  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);

  if (!validateContactForm(data)) return;

  submitContactForm(data);
}

function validateContactForm(data) {
  let isValid = true;
  
  if (!data.name || data.name.trim().length < 2) {
    showFieldError('name', 'Please enter a valid name (at least 2 characters)');
    isValid = false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    showFieldError('email', 'Please enter a valid email address');
    isValid = false;
  }
  
  if (data.phone && data.phone.length > 0) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(data.phone)) {
      showFieldError('phone', 'Please enter a valid phone number');
      isValid = false;
    }
  }
  
  if (!data.subject) {
    showFieldError('subject', 'Please select a subject');
    isValid = false;
  }
  
  if (!data.message || data.message.trim().length < 10) {
    showFieldError('message', 'Please enter a message (at least 10 characters)');
    isValid = false;
  }
  
  return isValid;
}

function showFieldError(fieldName, message) {
  const errorElement = document.getElementById(`${fieldName}-error`);
  if (errorElement) errorElement.textContent = message;
}

function clearFormErrors() {
  document.querySelectorAll('.error-message').forEach(el => { el.textContent = ''; });
}

function submitContactForm(data) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(result => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    if (result.success) {
      contactForm.reset();
      if (successModal) successModal.classList.remove('hidden');
      console.log('Contact form submitted:', data);
    } else {
      alert('Failed to send message: ' + (result.error || 'Unknown error'));
    }
  })
  .catch(err => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    alert('Failed to send message: Network error');
    console.error(err);
  });
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

  const submitBtn = newsletterForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Subscribing...';
  submitBtn.disabled = true;

  fetch(`${API_BASE_URL}/api/newsletter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  .then(res => res.json())
  .then(result => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    if (result.success) {
      newsletterForm.reset();
      alert('Thank you for subscribing!');
      console.log('Newsletter subscription:', email);
    } else {
      alert('Subscription failed: ' + (result.error || 'Unknown error'));
    }
  })
  .catch(err => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    alert('Network error subscribing');
    console.error(err);
  });
}

function initializeProductFilter() {
  if (!filterBtns || !filterBtns.length || !productsGrid) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const filter = btn.getAttribute('data-filter');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProducts(filter);
    });
  });
}

function populateProducts() {
  if (!productsGrid) return;

  fetch(`${API_BASE_URL}/api/products`)
    .then(res => res.json())
    .then(data => {
      let productsHTML = '';
      data.categories.forEach(category => {
        category.products.forEach(item => {
          productsHTML += `
            <div class="product-card" data-category="${category.name.toLowerCase()}">
              <div class="product-card__image">📝</div>
              <div class="product-card__content">
                <h3 class="product-card__title">${item.name}</h3>
                <p class="product-card__category">${category.name}</p>
              </div>
            </div>`;
        });
      });
      productsGrid.innerHTML = productsHTML;
    })
    .catch(err => {
      console.error('Failed to load products:', err);
      productsGrid.innerHTML = '<p>Failed to load products.</p>';
    });
}

function filterProducts(filter) {
  if (!productsGrid) return;

  const productCards = productsGrid.querySelectorAll('.product-card');
  productCards.forEach(card => {
    if (filter === 'all') {
      card.style.display = 'block';
    } else {
      const category = card.getAttribute('data-category');
      card.style.display = (category === filter) ? 'block' : 'none';
    }
  });
}

function initializeFAQ() {
  if (!faqItems || !faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    if (question) {
      question.addEventListener('click', e => {
        e.preventDefault();

        faqItems.forEach(otherItem => {
          if (otherItem !== item) otherItem.classList.remove('active');
        });

        item.classList.toggle('active');
      });
    }
  });
}

function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.fade-in, .card, .feature, .stat');
  animatedElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  let lastScrollTop = 0;
  const header = document.querySelector('.header');

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      if (header) header.style.transform = 'translateY(-100%)';
    } else {
      if (header) header.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop;
  });
}

window.addEventListener('error', e => {
  console.error('JavaScript error:', e.error);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const visibleModal = document.querySelector('.modal:not(.hidden)');
    if (visibleModal) visibleModal.classList.add('hidden');

    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      if (navToggle) navToggle.classList.remove('active');
    }
  }
});

function enhanceFormFields() {
  const formInputs = document.querySelectorAll('.form-control');

  formInputs.forEach(input => {
    input.addEventListener('input', () => {
      validateField(input);
    });
  });
}

function validateField(field) {
  const fieldName = field.name;
  const value = field.value;

  const errorElement = document.getElementById(`${fieldName}-error`);
  if (errorElement) errorElement.textContent = '';

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

setTimeout(() => {
  enhanceFormFields();
}, 100);

function showFieldError(fieldName, message) {
  const errorElement = document.getElementById(`${fieldName}-error`);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

// Export functions for testing (optional)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showSection,
    validateContactForm,
    filterProducts,
    appData
  };
}
