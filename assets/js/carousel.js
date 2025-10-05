// Exclusives Carousel
const track = document.querySelector('.carousel-track');
const nextBtn = document.querySelector('.carousel-btn.next');
const prevBtn = document.querySelector('.carousel-btn.prev');
const items = document.querySelectorAll('.exclusive-item');

let currentIndex = 0;

function updateCarousel() {
  const itemWidth = items[0].offsetWidth + 30;
  const visibleCount = Math.floor(document.querySelector('.carousel-window').offsetWidth / itemWidth) + 1;
  const maxIndex = items.length - visibleCount;

  track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex >= maxIndex;
}

nextBtn.addEventListener('click', () => {
  currentIndex++;
  updateCarousel();
});

prevBtn.addEventListener('click', () => {
  currentIndex--;
  updateCarousel();
});

window.addEventListener('resize', updateCarousel);
window.addEventListener('load', updateCarousel);
