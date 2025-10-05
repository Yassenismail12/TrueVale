//Element References
const track = document.querySelector('.carousel-track');
const nextBtn = document.querySelector('.carousel-btn.next');
const prevBtn = document.querySelector('.carousel-btn.prev');
const items = document.querySelectorAll('.exclusive-item');

//Track Position Tracker
let currentIndex = 0;

//Core Function
function updateCarousel() {
  //Item width calculation
  const itemWidth = items[0].offsetWidth + 30;
  //Visible items count
  const visibleCount = Math.floor(document.querySelector('.carousel-window').offsetWidth / itemWidth) + 1;
  //Max scroll index
  const maxIndex = items.length - visibleCount;
  //Apply the translation
  track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  //Disable navigation buttons appropriately
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex >= maxIndex;
}
//Event Listeners for Navigation
nextBtn.addEventListener('click', () => {
  currentIndex++;
  updateCarousel();
});

prevBtn.addEventListener('click', () => {
  currentIndex--;
  updateCarousel();
});
//Responsiveness  
window.addEventListener('resize', updateCarousel);
window.addEventListener('load', updateCarousel);
