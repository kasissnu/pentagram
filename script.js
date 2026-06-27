const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");

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

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
