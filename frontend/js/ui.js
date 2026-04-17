/**
 * KYRACE - UI Utilities
 */

// Menu hamburger mobile
const navHamburger = document.getElementById("nav-hamburger");
const mainNav = document.getElementById("main-nav");

if (navHamburger) {
  navHamburger.addEventListener("click", () => {
    console.log("Menu toggle clicked");
  });
}

// Fermer les dropdowns au scroll
document.addEventListener("scroll", () => {
  const dropdowns = document.querySelectorAll(".nav__dropdown");
  dropdowns.forEach((dd) => {
    if (dd.parentElement.classList.contains("nav__item")) {
      // Keep dropdown behavior on hover
    }
  });
});

// Animations on scroll (fade-up)
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
