document.addEventListener("DOMContentLoaded", () => {
  const shopbttn = document.getElementById("shopbttn");
  if (shopbttn) {
    shopbttn.addEventListener("click", () => {
      window.location.href = "Products/products.html";
    });
  }
});
