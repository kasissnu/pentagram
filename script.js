const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");
const testimonialCarousel = document.querySelector("[data-testimonial-carousel]");

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open") ?? false;
  header?.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (event) => {
  if (!nav || !navToggle || !header) return;
  const target = event.target;
  if (!(target instanceof Node)) return;
  if (nav.contains(target) || navToggle.contains(target)) return;
  nav.classList.remove("is-open");
  header.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!formNote) return;
  formNote.textContent = "Thank you. Your enquiry is ready for the studio team to connect with you.";
  contactForm.reset();
});

if (testimonialCarousel) {
  const slides = [...testimonialCarousel.querySelectorAll("[data-testimonial-slide]")];
  const dots = [...testimonialCarousel.querySelectorAll("[data-testimonial-dot]")];
  const previousButton = testimonialCarousel.querySelector("[data-testimonial-prev]");
  const nextButton = testimonialCarousel.querySelector("[data-testimonial-next]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = 0;
  let autoplay;

  function showReview(index) {
    if (!slides.length) return;
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
  }

  function stopAutoplay() {
    window.clearInterval(autoplay);
  }

  function startAutoplay() {
    if (reduceMotion || slides.length < 2) return;
    stopAutoplay();
    autoplay = window.setInterval(() => showReview(activeIndex + 1), 5200);
  }

  previousButton?.addEventListener("click", () => {
    showReview(activeIndex - 1);
    startAutoplay();
  });

  nextButton?.addEventListener("click", () => {
    showReview(activeIndex + 1);
    startAutoplay();
  });

  testimonialCarousel.addEventListener("mouseenter", stopAutoplay);
  testimonialCarousel.addEventListener("mouseleave", startAutoplay);
  testimonialCarousel.addEventListener("focusin", stopAutoplay);
  testimonialCarousel.addEventListener("focusout", startAutoplay);

  showReview(0);
  startAutoplay();
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
