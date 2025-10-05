const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const filterButtons = document.querySelectorAll(".filter-btn");
const voiceSearchBtn = document.getElementById("voiceSearchBtn");

let products = [];
let filteredProducts = [];
let currentCategory = "all";

// Fetch from DummyJSON API
async function fetchProducts() {
  try {
    showLoading();

    // Fetch from DummyJSON API
    const apiRes = await fetch("https://dummyjson.com/products?limit=50");
    if (!apiRes.ok) throw new Error(`API error! status: ${apiRes.status}`);
    const apiData = await apiRes.json();
    const apiProducts = Array.isArray(apiData.products) ? apiData.products : [];

    // Fetch from local JSON file (e.g. /data/products.json)
    const fileRes = await fetch("Example.json");
    if (!fileRes.ok) throw new Error(`File error! status: ${fileRes.status}`);
    const fileData = await fileRes.json();
    const fileProducts = Array.isArray(fileData) ? fileData : [fileData];

    // Merge both sources
    products = [...apiProducts, ...fileProducts];
    filteredProducts = products;

    displayProducts(filteredProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    showError();
  }
}

// Loading state
function showLoading() {
  productsGrid.innerHTML = `
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Loading products...</p>
    </div>
  `;
}

// Error state
function showError() {
  productsGrid.innerHTML = `
    <div class="error-container">
      <i class="bi bi-exclamation-circle"></i>
      <p>Failed to load products. Please try again later.</p>
      <button onclick="fetchProducts()" class="retry-btn">Retry</button>
    </div>
  `;
}

// Empty state
function showEmptyState() {
  productsGrid.innerHTML = `
    <div class="empty-state">
      <i class="bi bi-search"></i>
      <p>No products found</p>
      <span>Try adjusting your search or filters</span>
    </div>
  `;
}

// Render products with fade-in animation
function displayProducts(items) {
  if (items.length === 0) {
    showEmptyState();
    return;
  }

  const placeholder = 'https://placehold.co/240x240?text=No+Image&font=roboto';
  productsGrid.innerHTML = items.map((p, index) => `
    <div class="product-card" style="animation-delay: ${index * 0.05}s">
      <div class="product-img-wrapper">
        <img src="${p.images && p.images[0] ? p.images[0] : placeholder}" alt="${p.title}" loading="lazy" onerror="this.src='${placeholder}'">
        <div class="product-icons">
          <button class="icon-btn favourite-btn" data-id="${p.id}" aria-label="Add to Favourites">
            <i class="bi bi-heart"></i>
          </button>
          <button class="icon-btn quick-view-btn" data-id="${p.id}" aria-label="Quick View">
            <i class="bi bi-eye"></i>
          </button>
          <button class="icon-btn compare-btn" data-id="${p.id}" aria-label="Compare">
            <i class="bi bi-sliders"></i>
          </button>
        </div>
        ${p.rating ? `
          <div class="product-rating">
            <i class="bi bi-star-fill"></i>
            <span>${p.rating.toFixed(1)}</span>
          </div>
        ` : ''}
      </div>
      <div class="product-info">
        <h4 title="${p.title}">${p.title}</h4>
        <p class="product-category">
          <i class="bi bi-tag"></i> ${p.category || 'Uncategorized'}
        </p>
        <div class="product-price">$${parseFloat(p.price || 0).toFixed(2)}</div>
      </div>
      <div class="product-actions">
        <button class="add-to-cart" data-id="${p.id}">
          <i class="bi bi-cart-plus"></i> Add to Cart
        </button>
        <button class="view-details" data-id="${p.id}">
          <i class="bi bi-info-circle"></i> Details
        </button>
      </div>
    </div>
  `).join("");

  attachEventListeners();
}

// Attach event listeners to product cards
function attachEventListeners() {
  // Add to Cart
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      addToCart(id);
      showToast("Product added to cart!", "success");
    });
  });

  // View Details
  document.querySelectorAll(".view-details").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      viewProductDetails(id);
    });
  });

  // Favourite (with persistence)
document.querySelectorAll(".favourite-btn").forEach(btn => {
  const id = parseInt(btn.dataset.id);

  // Load both arrays
  const favIDs = JSON.parse(localStorage.getItem('favorites') || '[]');
  const favProducts = JSON.parse(localStorage.getItem('favouriteProducts') || '[]');

  // Mark already-favorited
  if (favIDs.includes(id)) {
    btn.classList.add('active');
    btn.querySelector('i').classList.replace('bi-heart', 'bi-heart-fill');
  }

  btn.addEventListener("click", (e) => {
    const icon = e.currentTarget.querySelector("i");
    const isActive = icon.classList.contains("bi-heart-fill");
    icon.classList.toggle("bi-heart");
    icon.classList.toggle("bi-heart-fill");
    e.currentTarget.classList.toggle("active");

    // Load products array to find full object
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (isActive) {
      // REMOVE from both arrays
      const idIndex = favIDs.indexOf(id);
      if (idIndex !== -1) favIDs.splice(idIndex, 1);

      const prodIndex = favProducts.findIndex(p => p.id === id);
      if (prodIndex !== -1) favProducts.splice(prodIndex, 1);

      showToast(`Product removed from favourites`, "info");
    } else {
      // ADD to both arrays
      if (!favIDs.includes(id)) favIDs.push(id);
      if (!favProducts.some(p => p.id === id)) favProducts.push(product);

      showToast(`Product added to favourites`, "success");
    }

    // Save both
    localStorage.setItem('favorites', JSON.stringify(favIDs));
    localStorage.setItem('favouriteProducts', JSON.stringify(favProducts));
  });
});


  // Quick View
  document.querySelectorAll(".quick-view-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      quickViewProduct(id);
    });
  });
}

// Category filter with smooth transition
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const activeBtn = document.querySelector(".filter-btn.active");
    if (activeBtn) activeBtn.classList.remove("active");
    btn.classList.add("active");

    currentCategory = btn.dataset.category;
    applyFilters();
  });
});

// Search filter with debounce
let searchTimeout;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 300);
});

// Handle search form submit
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  applyFilters();
});

// Voice search (basic Web Speech API)
voiceSearchBtn.addEventListener('click', () => {
  if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.onresult = (e) => { 
      searchInput.value = e.results[0][0].transcript; 
      applyFilters(); 
    };
    recognition.onerror = () => showToast('Voice search failed', 'error');
    recognition.start();
  } else {
    showToast('Voice search not supported in this browser', 'error');
  }
});

// Apply both category and search filters
function applyFilters() {
  let results = products;

  // Apply category filter
  if (currentCategory !== "all") {
    results = results.filter(p => 
      p.category && p.category.toLowerCase() === currentCategory.toLowerCase()
    );
  }

  // Apply search filter
  const query = searchInput.value.toLowerCase().trim();
  if (query) {
    results = results.filter(p =>
      p.title.toLowerCase().includes(query) ||
      (p.category && p.category.toLowerCase().includes(query))
    );
  }

  filteredProducts = results;
  displayProducts(results);
}

// Toast notification system
function showToast(message, type = "info") {
  const existingToast = document.querySelector(".toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add to cart functionality
function addToCart(productId) {
  const product = products.find(p => p.id == productId);
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existingItem = cart.find(item => item.id == productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

// Update cart badge count
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  
  let badge = document.querySelector(".cart-badge");
  if (!badge) {
    badge = document.createElement("span");
    badge.className = "cart-badge";
    document.querySelector('.nav-action[aria-label="Shopping Cart"]').appendChild(badge);
  }
  
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? "flex" : "none";
}

// View product details
function viewProductDetails(productId) {
  const product = products.find(p => p.id == productId);
  if (!product) return;
  
  showToast("Product details feature coming soon!", "info");
}

// Quick view product
function quickViewProduct(productId) {
  const product = products.find(p => p.id == productId);
  if (!product) return;
  
  showToast("Quick view feature coming soon!", "info");
}

// Dynamic footer year
function updateFooterYear() {
  const footerP = document.querySelector('.footer-bottom p');
  if (footerP) {
    footerP.innerHTML = `&copy; ${new Date().getFullYear()} TrueVal. All rights reserved.`;
  }
}

// Initialize
fetchProducts();
updateCartBadge();
updateFooterYear();