// DOM Reference
const favouritesGrid = document.getElementById("favouritesGrid");

// ===== Utilities =====

// Utilities — Storage Handling
function getFavourites() {
  return JSON.parse(localStorage.getItem("favouriteProducts") || "[]");
}

// Save favourites back to localStorage
function saveFavourites(favs) {
  localStorage.setItem("favouriteProducts", JSON.stringify(favs));
}

// ===== UI States =====
function showLoading() {
  favouritesGrid.innerHTML = `
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Loading favourites...</p>
    </div>
  `;
}

function showEmptyState() {
  favouritesGrid.innerHTML = `
    <div class="empty-state">
      <i class="bi bi-heart"></i>
      <p>No favourites yet</p>
      <span>Start adding products to your favourites!</span>
    </div>
  `;
}

// Rendering Favourite Products
function displayFavourites(favs) {
  if (!favs.length) {
    showEmptyState();
    return;
  }

  const placeholder = 'https://placehold.co/240x240?text=No+Image&font=roboto';

  favouritesGrid.innerHTML = favs.map((p, index) => `
    <div class="product-card" style="animation-delay: ${index * 0.05}s">
      <div class="product-img-wrapper">
        <img src="${p.images && p.images[0] ? p.images[0] : placeholder}" 
             alt="${p.title}" loading="lazy" 
             onerror="this.src='${placeholder}'">

        <button class="remove-fav-btn" data-id="${p.id}" aria-label="Remove from favourites">
          <i class="bi bi-x-lg"></i>
        </button>

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

  attachListeners();
}

// User Interaction Listeners
function attachListeners() {
  // Remove favourite
  document.querySelectorAll(".remove-fav-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.currentTarget.dataset.id);
      removeFavourite(id);
    });
  });

  // Add to cart
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      addToCart(id);
      showToast("Product added to cart!", "success");
    });
  });

  // View details placeholder
  document.querySelectorAll(".view-details").forEach(btn => {
    btn.addEventListener("click", () => {
      showToast("Product details feature coming soon!", "info");
    });
  });
}

// Favourites Management
function removeFavourite(id) {
  let favs = getFavourites();
  favs = favs.filter(p => p.id !== id);
  saveFavourites(favs);
  displayFavourites(favs);
  showToast("Removed from favourites", "info");
}

// Cart Management
function addToCart(productId) {
  const favs = getFavourites();
  const product = favs.find(p => p.id === parseInt(productId));
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}
// Update Cart Badge
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  let badge = document.querySelector(".cart-badge");
  if (!badge) {
    badge = document.createElement("span");
    badge.className = "cart-badge";
    document.querySelector('.nav-action[aria-label="Shopping Cart"]').appendChild(badge);
  }

  badge.textContent = total;
  badge.style.display = total > 0 ? "flex" : "none";
}

// Toast Notifications
function showToast(message, type = "info") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

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

// ===== Init =====
function initFavourites() {
  showLoading();
  setTimeout(() => {
    const favs = getFavourites();
    displayFavourites(favs);
    updateCartBadge();
  }, 400);
}

initFavourites();
