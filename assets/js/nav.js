// DOMContentLoaded Event Listener
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const basePath = body?.dataset?.basePath || ".";
  const normalizedBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  const productsPage = `${normalizedBase}/Products/products.html`;

  // Navbar & Hamburger Menu Variables
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const overlay = document.getElementById("overlay");
  const navbar = document.getElementById("navbar");

  if (hamburger && navLinks && overlay && navbar) {
    const toggleMenu = () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("open");
      overlay.classList.toggle("show");
      const isExpanded = hamburger.classList.contains("active");
      hamburger.setAttribute("aria-expanded", isExpanded);
    };

    hamburger.addEventListener("click", toggleMenu);
    hamburger.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    });

    overlay.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
      overlay.classList.remove("show");
      hamburger.setAttribute("aria-expanded", "false");
    });

    const dropdowns = document.querySelectorAll(".dropdown > a");
    dropdowns.forEach((dropdown) => {
      dropdown.addEventListener("click", (e) => {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          dropdown.parentElement.classList.toggle("active");
        }
      });
    });

    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("open")) {
        hamburger.classList.remove("active");
        navLinks.classList.remove("open");
        overlay.classList.remove("show");
      }
    });
  }

  const voiceBtn = document.getElementById("voiceSearchBtn");
  const searchInput = document.getElementById("searchInput");
  const searchForm = document.getElementById("searchForm");
  const searchMode = searchForm?.dataset?.searchMode || "redirect";
  const voiceMode = searchForm?.dataset?.voiceMode || "default";

  if (voiceBtn && searchInput && voiceMode !== "custom") {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      voiceBtn.addEventListener("click", () => {
        alert("Voice search is not supported in your browser.");
      });
    } else {
      voiceBtn.addEventListener("click", () => {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        voiceBtn.classList.add("listening");

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          searchInput.value = transcript;
          voiceBtn.classList.remove("listening");

          if (searchMode === "redirect" && searchForm) {
            searchForm.dispatchEvent(new Event("submit", { cancelable: true }));
          }
        };

        recognition.onerror = () => {
          voiceBtn.classList.remove("listening");
        };

        recognition.onend = () => {
          voiceBtn.classList.remove("listening");
        };

        recognition.start();
      });
    }
  }

  if (searchForm && searchInput && searchMode === "redirect") {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      const target = searchForm.dataset.searchTarget || productsPage;
      const destination = query
        ? `${target}?search=${encodeURIComponent(query)}`
        : target;
      window.location.href = destination;
    });
  }

  document
    .querySelectorAll(".dropdown-menu a[data-category]")
    .forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const category = e.currentTarget.getAttribute("data-category");
        if (!category) return;
        window.location.href = `${productsPage}?category=${encodeURIComponent(
          category
        )}`;
      });
    });
});
