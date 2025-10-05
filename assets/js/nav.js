document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const overlay = document.getElementById('overlay');
  const navbar = document.getElementById('navbar');

  if (hamburger && navLinks && overlay && navbar) {
    function toggleMenu() {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      overlay.classList.toggle('show');
      const isExpanded = hamburger.classList.contains('active');
      hamburger.setAttribute('aria-expanded', isExpanded);
    }

    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });

    overlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      overlay.classList.remove('show');
      hamburger.setAttribute('aria-expanded', 'false');
    });

    // Mobile Dropdown Toggle
    const dropdowns = document.querySelectorAll('.dropdown > a');
    dropdowns.forEach(dropdown => {
      dropdown.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          dropdown.parentElement.classList.toggle('active');
        }
      });
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        overlay.classList.remove('show');
      }
    });
  }

  // Voice Search (Mock) – safe check
  const voiceBtn = document.getElementById('voiceSearchBtn');
  const searchInput = document.getElementById('searchInput');
  if (voiceBtn && searchInput) {
    voiceBtn.addEventListener('click', () => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;

        voiceBtn.classList.add('listening');

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          searchInput.value = transcript;
          voiceBtn.classList.remove('listening');
        };

        recognition.onerror = () => {
          voiceBtn.classList.remove('listening');
        };

        recognition.onend = () => {
          voiceBtn.classList.remove('listening');
        };

        recognition.start();
      } else {
        alert('Voice search is not supported in your browser.');
      }
    });

    // Search Form Handler
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          console.log('Searching for:', query);
        }
      });
    }
  }
});
