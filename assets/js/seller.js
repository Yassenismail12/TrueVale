// "Be a Seller"
const sellerBtn = document.querySelector('.seller-btn');
if (sellerBtn) {
  sellerBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
