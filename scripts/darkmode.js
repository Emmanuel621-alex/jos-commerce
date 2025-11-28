document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  const lastModifiedEl = document.getElementById("last-modified");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (lastModifiedEl) lastModifiedEl.textContent = document.lastModified;

  const navLinks = document.querySelector(".nav-links");
  const hamburger = document.getElementById("hamburger");
  const darkToggle = document.getElementById("dark-toggle");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  if (darkToggle) {
    const saved = localStorage.getItem("dark-mode");
    if (saved === "enabled" || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.classList.add("dark");
      darkToggle.setAttribute("aria-pressed", "true");
    }

    darkToggle.addEventListener("click", () => {
      const isActive = document.body.classList.toggle("dark");
      darkToggle.setAttribute("aria-pressed", isActive ? "true" : "false");
      localStorage.setItem("dark-mode", isActive ? "enabled" : "disabled");
    });
  }
});
