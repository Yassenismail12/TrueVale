// Button navigation
var shopbttn = document.getElementById('shopbttn');
shopbttn.onclick = function() {
  location.assign('/Products/products.html');
}

// Search form handling
document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `Products/products.html?search=${encodeURIComponent(query)}`;
      } else {
        window.location.href = "Products/products.html";
      }
    });
  }
});

// Category filter redirect
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-category]').forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const category = e.currentTarget.dataset.category;
      if (category) {
      window.location.href = `Products/products.html?search=${encodeURIComponent(query)}`;
      }
    });
  });
});


// Dark Mode Toggle Functionality
(function() {
  // Get theme from memory or default to light
  let currentTheme = 'light';
  
  // Initialize theme
  function initTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateToggleIcons();
  }

  // Update toggle button icons
  function updateToggleIcons() {
    const desktopToggle = document.getElementById('darkModeToggle');
    const mobileToggle = document.getElementById('darkModeToggleMobile');
    
    if (currentTheme === 'dark') {
      if (desktopToggle) {
        desktopToggle.innerHTML = '<i class="bi bi-sun-fill"></i><span>Light</span>';
      }
      if (mobileToggle) {
        mobileToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
      }
    } else {
      if (desktopToggle) {
        desktopToggle.innerHTML = '<i class="bi bi-moon-stars"></i><span>Dark</span>';
      }
      if (mobileToggle) {
        mobileToggle.innerHTML = '<i class="bi bi-moon-stars"></i>';
      }
    }
  }

  // Toggle theme
  function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateToggleIcons();
    
    // Add smooth transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    // Desktop toggle
    const desktopToggle = document.getElementById('darkModeToggle');
    if (desktopToggle) {
      desktopToggle.addEventListener('click', toggleTheme);
    }

    // Mobile toggle
    const mobileToggle = document.getElementById('darkModeToggleMobile');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', toggleTheme);
    }

    // Keyboard accessibility for toggles
    [desktopToggle, mobileToggle].forEach(toggle => {
      if (toggle) {
        toggle.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
          }
        });
      }
    });
  });
})();