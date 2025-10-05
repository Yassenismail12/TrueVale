const orderItems = document.getElementById("orderItems");
const orderTotal = document.getElementById("orderTotal");
const form = document.getElementById("checkoutForm");
const successModal = document.getElementById("successModal");

function loadCartSummary() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (!cart.length) {
    orderItems.innerHTML = `<p>Your cart is empty.</p>`;
    orderTotal.textContent = "$0.00";
    return;
  }

  let total = 0;
  orderItems.innerHTML = cart
    .map((item) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      return `
        <div class="order-item">
          <span>${item.title} × ${item.quantity}</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>`;
    })
    .join("");

  orderTotal.textContent = `$${total.toFixed(2)}`;
}

function validateForm() {
  let isValid = true;

  document.querySelectorAll(".error-msg").forEach((el) => (el.style.display = "none"));

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const address = document.getElementById("address");

  if (name.value.trim() === "") {
    name.nextElementSibling.textContent = "Name is required";
    name.nextElementSibling.style.display = "block";
    isValid = false;
  }

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!emailPattern.test(email.value)) {
    email.nextElementSibling.textContent = "Enter a valid email";
    email.nextElementSibling.style.display = "block";
    isValid = false;
  }

  if (address.value.trim().length < 5) {
    address.nextElementSibling.textContent = "Address is too short";
    address.nextElementSibling.style.display = "block";
    isValid = false;
  }

  return isValid;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (validateForm()) {
    localStorage.removeItem("cart");
    successModal.classList.remove("hidden");

    setTimeout(() => {
      successModal.classList.add("hidden");
      window.location.href = "../Products/products.html";
    }, 3500);
  }
});

loadCartSummary();
