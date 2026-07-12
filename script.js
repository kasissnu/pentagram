const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");
const testimonialCarousel = document.querySelector("[data-testimonial-carousel]");

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}

function setNavOpen(isOpen) {
  nav?.classList.toggle("is-open", isOpen);
  header?.classList.toggle("nav-open", isOpen);
  navToggle?.classList.toggle("is-open", isOpen);
  navToggle?.setAttribute("aria-expanded", String(isOpen));
}

navToggle?.addEventListener("click", () => {
  const isOpen = !nav?.classList.contains("is-open");
  setNavOpen(isOpen);
});

document.addEventListener("click", (event) => {
  if (!nav || !navToggle || !header) return;
  const target = event.target;
  if (!(target instanceof Node)) return;
  if (nav.contains(target) || navToggle.contains(target)) return;
  setNavOpen(false);
});

nav?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest("a")) setNavOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  setNavOpen(false);
});

contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!formNote) return;

    const formData = new FormData(contactForm);

    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      city: formData.get("city"),
      location: formData.get("location"),
      projectType: formData.get("project-type"),
      budget: formData.get("budget"),
      projectDetails: formData.get("message")
  };

    formNote.textContent = "Submitting...";

    try {
        const response = await fetch("submit-lead.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.response || "Something went wrong.");
        }

        if (typeof window.fbq === "function") {
            window.fbq("track", "Lead");
        }

        formNote.textContent = "Thank you! Our team will contact you shortly.";

        contactForm.reset();

    } catch (error) {
        formNote.textContent =
            error.message || "Unable to submit enquiry. Please try again.";
    }
});

if (testimonialCarousel) {
  const slides = [...testimonialCarousel.querySelectorAll("[data-testimonial-slide]")];
  const dots = [...testimonialCarousel.querySelectorAll("[data-testimonial-dot]")];
  const previousButton = testimonialCarousel.querySelector("[data-testimonial-prev]");
  const nextButton = testimonialCarousel.querySelector("[data-testimonial-next]");
  const track = testimonialCarousel.querySelector(".testimonial-track");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = 0;
  let autoplay;

  function resizeTrack() {
    if (!track || !slides.length) return;
    const activeSlide = slides[activeIndex];
    if (!activeSlide) return;
    track.style.height = `${Math.ceil(activeSlide.scrollHeight)}px`;
  }

  function showReview(index) {
    if (!slides.length) return;
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
    window.requestAnimationFrame(resizeTrack);
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
  window.addEventListener("resize", resizeTrack, { passive: true });
  window.addEventListener("load", resizeTrack);
  document.fonts?.ready.then(resizeTrack);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
