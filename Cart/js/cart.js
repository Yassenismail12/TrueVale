const cartGrid = document.getElementById("cartGrid");
const subtotalAmount = document.getElementById("subtotalAmount");
const totalAmount = document.getElementById("totalAmount");

// --- Load and Save ---
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// --- Display ---
function displayCart() {
  const cart = getCart();

  if (!cart.length) {
    cartGrid.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-cart"></i>
        <p>Your cart is empty</p>
        <span>Start adding products to your cart!</span>
      </div>
    `;
    subtotalAmount.textContent = "$0.00";
    totalAmount.textContent = "$0.00";
    return;
  }

  const placeholder = "https://placehold.co/240x240?text=No+Image&font=roboto";
  let subtotal = 0;

  cartGrid.innerHTML = `
    <div class="explore-gallery">
      ${cart
        .map(
          (item, i) => `
        <div class="product-card" style="animation-delay:${i * 0.05}s">
          <div class="product-img-wrapper">
            <img src="${item.images?.[0] || placeholder}" alt="${item.title}" loading="lazy" />
            <button class="remove-fav-btn remove-cart-item" data-id="${item.id}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <div class="product-info">
            <h4>${item.title}</h4>
            <p class="product-category"><i class="bi bi-tag"></i> ${item.category || "Uncategorized"}</p>
            <div class="product-price">$${item.price.toFixed(2)}</div>
          </div>
          <div class="product-actions">
            <div class="quantity-control">
              <button class="qty-btn minus" data-id="${item.id}">−</button>
              <input type="number" value="${item.quantity}" min="1" class="qty-input" data-id="${item.id}" />
              <button class="qty-btn plus" data-id="${item.id}">+</button>
            </div>
            <div class="line-total">$${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        </div>`
        )
        .join("")}
    </div>
  `;

  subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  subtotalAmount.textContent = `$${subtotal.toFixed(2)}`;
  totalAmount.textContent = `$${(subtotal * 1.0).toFixed(2)}`; // no shipping yet

  attachCartListeners();
}

// --- Event Listeners ---
function attachCartListeners() {
  document.querySelectorAll(".remove-cart-item").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.currentTarget.dataset.id);
      removeFromCart(id);
    })
  );

  document.querySelectorAll(".qty-btn.plus").forEach((btn) =>
    btn.addEventListener("click", () => updateQuantity(btn.dataset.id, 1))
  );

  document.querySelectorAll(".qty-btn.minus").forEach((btn) =>
    btn.addEventListener("click", () => updateQuantity(btn.dataset.id, -1))
  );

  document.querySelectorAll(".qty-input").forEach((input) =>
    input.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      const val = parseInt(e.target.value) || 1;
      setQuantity(id, val);
    })
  );
}

// --- Quantity Updates ---
function updateQuantity(id, delta) {
  const cart = getCart();
  const item = cart.find((p) => p.id == id);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  saveCart(cart);
  displayCart();
}
function setQuantity(id, qty) {
  const cart = getCart();
  const item = cart.find((p) => p.id == id);
  if (!item) return;
  item.quantity = Math.max(1, qty);
  saveCart(cart);
  displayCart();
}

// --- Remove Item ---
function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter((item) => item.id != id);
  saveCart(cart);
  displayCart();
  showToast("Item removed from cart", "info");
}

// --- Toast Notifications ---
function showToast(message, type = "info") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="bi bi-${type === "success" ? "check-circle" : type === "error" ? "x-circle" : "info-circle"}"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
var chkoutbutton = document.getElementById('checkoutBtn');
chkoutbutton.onclick = function() {
  location.assign('/Cart/checkout.html');
}
// --- Init ---
displayCart();
