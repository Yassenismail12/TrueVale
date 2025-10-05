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
