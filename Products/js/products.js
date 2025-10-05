// ====== ELEMENTS ======
const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const filterButtons = document.querySelectorAll(".filter-btn");
const voiceSearchBtn = document.getElementById("voiceSearchBtn");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const applyPriceFilterBtn = document.getElementById("applyPriceFilter");
applyPriceFilterBtn.addEventListener("click", () => {
  applyFilters();
});

let products = [];
let filteredProducts = [];
let currentCategory = "all";


// ====== INIT ======
document.addEventListener("DOMContentLoaded", () => {
  initFilters();
  loadCategoryFromURL();
  fetchProducts();
  updateCartBadge();
  updateFooterYear();
});

// ====== FETCH PRODUCTS ======
async function fetchProducts() {
  try {
    showLoading();

    const [apiRes, fileRes] = await Promise.all([
      fetch("https://dummyjson.com/products?limit=200"),
      fetch("Example.json")
    ]);

    if (!apiRes.ok || !fileRes.ok)
      throw new Error(`Error fetching data`);

    const apiData = await apiRes.json();
    const fileData = await fileRes.json();

    const apiProducts = Array.isArray(apiData.products) ? apiData.products : [];
    const fileProducts = Array.isArray(fileData) ? fileData : [fileData];

    products = [...apiProducts, ...fileProducts];
    filteredProducts = products;

    applyFilters();
  } catch (err) {
    console.error(err);
    showError();
  }
}

// ====== UI STATES ======
function showLoading() {
  productsGrid.innerHTML = `
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Loading products...</p>
    </div>`;
}

function showError() {
  productsGrid.innerHTML = `
    <div class="error-container">
      <i class="bi bi-exclamation-circle"></i>
      <p>Failed to load products. Please try again.</p>
      <button onclick="fetchProducts()" class="retry-btn">Retry</button>
    </div>`;
}

function showEmptyState() {
  productsGrid.innerHTML = `
    <div class="empty-state">
      <i class="bi bi-search"></i>
      <p>No products found</p>
      <span>Try adjusting your search or filters</span>
    </div>`;
}

// ====== DISPLAY PRODUCTS ======
function displayProducts(items) {
  if (!items.length) return showEmptyState();

  const placeholder = 'https://placehold.co/240x240?text=No+Image&font=roboto';

  productsGrid.innerHTML = items.map((p, i) => `
    <div class="product-card" style="animation-delay:${i * 0.05}s">
      <div class="product-img-wrapper">
        <img src="${p.images?.[0] || placeholder}" 
            alt="${p.title}" 
            onerror="this.src='${placeholder}'">
        <div class="product-icons">
          <button class="icon-btn favourite-btn" data-id="${p.id}" aria-label="Add to Favourites"><i class="bi bi-heart"></i></button>
          <button class="icon-btn quick-view-btn" data-id="${p.id}" aria-label="Quick View"><i class="bi bi-eye"></i></button>
          <button class="icon-btn compare-btn" data-id="${p.id}" aria-label="Compare"><i class="bi bi-sliders"></i></button>
        </div>
        ${p.rating ? `<div class="product-rating"><i class="bi bi-star-fill"></i><span>${p.rating.toFixed(1)}</span></div>` : ""}
      </div>

      <div class="product-info">
        <h4>${p.title}</h4>
        <p class="product-category"><i class="bi bi-tag"></i> ${p.category || "Uncategorized"}</p>
        <div class="product-price">$${parseFloat(p.price || 0).toFixed(2)}</div>
      </div>

      <div class="product-actions">
        <button class="add-to-cart" data-id="${p.id}"><i class="bi bi-cart-plus"></i> Add to Cart</button>
        <button class="view-details" data-id="${p.id}"><i class="bi bi-info-circle"></i> Details</button>
      </div>
    </div>
  `).join("");

  attachProductEvents();
}

// ====== EVENT HANDLERS ======
function attachProductEvents() {
  document.querySelectorAll(".add-to-cart").forEach(btn =>
    btn.addEventListener("click", e => {
      addToCart(e.currentTarget.dataset.id);
      showToast("Product added to cart!", "success");
    })
  );

  document.querySelectorAll(".view-details").forEach(btn =>
    btn.addEventListener("click", e => {
      viewProductDetails(e.currentTarget.dataset.id);
    })
  );

  document.querySelectorAll(".favourite-btn").forEach(btn =>
    handleFavouriteButton(btn)
  );

  document.querySelectorAll(".quick-view-btn").forEach(btn =>
    btn.addEventListener("click", e => {
      quickViewProduct(e.currentTarget.dataset.id);
    })
  );
}

// ====== FAVOURITES ======
function handleFavouriteButton(btn) {
  const id = parseInt(btn.dataset.id);
  const favIDs = JSON.parse(localStorage.getItem("favorites") || "[]");
  const favProducts = JSON.parse(localStorage.getItem("favouriteProducts") || "[]");

  if (favIDs.includes(id)) {
    btn.classList.add("active");
    btn.querySelector("i").classList.replace("bi-heart", "bi-heart-fill");
  }

  btn.addEventListener("click", () => {
    const icon = btn.querySelector("i");
    const active = icon.classList.contains("bi-heart-fill");
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (active) {
      // Remove
      icon.classList.replace("bi-heart-fill", "bi-heart");
      favIDs.splice(favIDs.indexOf(id), 1);
      const index = favProducts.findIndex(p => p.id === id);
      if (index !== -1) favProducts.splice(index, 1);
      showToast("Removed from favourites", "info");
    } else {
      // Add
      icon.classList.replace("bi-heart", "bi-heart-fill");
      favIDs.push(id);
      favProducts.push(product);
      showToast("Added to favourites", "success");
    }

    btn.classList.toggle("active");
    localStorage.setItem("favorites", JSON.stringify(favIDs));
    localStorage.setItem("favouriteProducts", JSON.stringify(favProducts));
  });
}

// ====== FILTER SYSTEM ======
function initFilters() {
  filterButtons.forEach(btn =>
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      applyFilters();
    })
  );

  // Search
  let searchTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(applyFilters, 300);
  });

  // Form submit
  searchForm.addEventListener("submit", e => {
    e.preventDefault();
    applyFilters();
  });

  // Voice Search
  voiceSearchBtn.addEventListener("click", startVoiceSearch);
}

function applyFilters() {
  let results = [...products];

  // Category filtering
  if (currentCategory !== "all") {
    results = results.filter(p =>
      (p.category || "").toLowerCase() === currentCategory.toLowerCase()
    );
  }

  // Search filtering
  const query = (searchInput.value || "").toLowerCase().trim();
  if (query) {
    results = results.filter(p =>
      (p.title || "").toLowerCase().includes(query) ||
      (p.category || "").toLowerCase().includes(query)
    );
  }

  // Price filtering
const minPrice = parseFloat(minPriceInput.value) || 0;
const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

results = results.filter(p => {
  const price = parseFloat(p.price) || 0;
  return price >= minPrice && price <= maxPrice;
});


  filteredProducts = results;
  currentPage = 1;
  updateDisplayedProducts();

}

// ===== PAGINATION =====
let currentPage = 1;
const productsPerPage = 12; // adjust per your layout

function renderPagination(totalItems) {
  const pagination = document.getElementById("pagination");
  const totalPages = Math.ceil(totalItems / productsPerPage);
  pagination.innerHTML = "";

  if (totalPages <= 1) {
    pagination.style.display = "none";
    return;
  }

  pagination.style.display = "flex";

  // Prev button
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => changePage(currentPage - 1);
  pagination.appendChild(prevBtn);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => changePage(i);
    pagination.appendChild(btn);
  }

  // Next button
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => changePage(currentPage + 1);
  pagination.appendChild(nextBtn);
}

function changePage(pageNum) {
  currentPage = pageNum;
  updateDisplayedProducts();
}

function updateDisplayedProducts() {
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const itemsToShow = filteredProducts.slice(start, end);
  displayProducts(itemsToShow);
  renderPagination(filteredProducts.length);
}


// ====== VOICE SEARCH ======
function startVoiceSearch() {
  if (!("webkitSpeechRecognition" in window))
    return showToast("Voice search not supported", "error");

  const recognition = new webkitSpeechRecognition();
  recognition.onresult = e => {
    searchInput.value = e.results[0][0].transcript;
    applyFilters();
  };
  recognition.onerror = () => showToast("Voice search failed", "error");
  recognition.start();
}

// ====== UTILITIES ======
function addToCart(id) {
  const product = products.find(p => p.id == id);
  if (!product) return;

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const item = cart.find(i => i.id == id);
  if (item) item.quantity++;
  else cart.push({ ...product, quantity: 1 });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const total = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);

  let badge = document.querySelector(".cart-badge");
  if (!badge) {
    badge = document.createElement("span");
    badge.className = "cart-badge";
    document.querySelector('.nav-action[aria-label="Shopping Cart"]').appendChild(badge);
  }

  badge.textContent = total;
  badge.style.display = total > 0 ? "flex" : "none";
}

function viewProductDetails(id) {
  showToast("Product details feature coming soon!", "info");
}

function quickViewProduct(id) {
  showToast("Quick view feature coming soon!", "info");
}

function showToast(msg, type = "info") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="bi bi-${type === "success" ? "check-circle" : type === "error" ? "x-circle" : "info-circle"}"></i>
    <span>${msg}</span>
  `;

  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => toast.classList.remove("show"), 3000);
  setTimeout(() => toast.remove(), 3300);
}

function updateFooterYear() {
  const footerP = document.querySelector(".footer-bottom p");
  if (footerP) footerP.innerHTML = `&copy; ${new Date().getFullYear()} TrueVal. All rights reserved.`;
}

// ====== READ CATEGORY FROM URL ======
function loadCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  const selected = params.get("category");
  const search = params.get("search");

  if (selected) {
    currentCategory = selected.toLowerCase();
    filterButtons.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.category === currentCategory);
    });
  }

  if (search) {
    searchInput.value = search;
  }
}

