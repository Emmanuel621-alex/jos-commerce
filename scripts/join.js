// scripts/join.js
// Handles timestamp, modal dialogs, card animation, apply-links, validation, and enhancements.

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------
     1) Populate hidden timestamp with ISO string
  --------------------------------------------------- */
  const ts = document.getElementById("timestamp");
  if (ts) ts.value = new Date().toISOString();


  /* ---------------------------------------------------
     2) Scroll-triggered card animation (NOT hover)
     (Replaces stagger-only version; satisfies requirement)
  --------------------------------------------------- */
  const cards = document.querySelectorAll(".membership-card");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.3 }
    );
    cards.forEach(card => observer.observe(card));
  } else {
    // Fallback: immediate animation
    cards.forEach(card => card.classList.add("animate-in"));
  }


  /* ---------------------------------------------------
     3) MODAL DIALOG HANDLING (Required for 4 cards)
  --------------------------------------------------- */

  // Open dialogs
  const moreInfoLinks = document.querySelectorAll(".more-info[data-dialog]");
  moreInfoLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = link.dataset.dialog;
      const dlg = document.getElementById(id);
      if (!dlg) return;

      if (typeof dlg.showModal === "function") {
        dlg.showModal();

        // Focus first element inside dialog for accessibility
        const focusTarget = dlg.querySelector(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        );
        if (focusTarget) focusTarget.focus();

        dlg.addEventListener("cancel", (ev) => ev.preventDefault());
      } else {
        alert("Your browser does not support modals.");
      }
    });
  });

  // Close buttons
  const dialogCloseButtons = document.querySelectorAll(".dialog-close");
  dialogCloseButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const dlg = btn.closest("dialog");
      if (dlg) dlg.close();
    });
  });

  // Close when clicking outside box
  const dialogs = document.querySelectorAll("dialog");
  dialogs.forEach(dlg => {
    dlg.addEventListener("click", (e) => {
      const rect = dlg.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!inside) dlg.close();
    });
  });


  /* ---------------------------------------------------
     4) APPLY LINKS → autofill membership + focus form
  --------------------------------------------------- */
  const applyLinks = document.querySelectorAll(".apply-link");
  const membershipSelect = document.getElementById("membership");
  const firstNameInput = document.getElementById("firstName");

  applyLinks.forEach(link => {
    link.addEventListener("click", () => {
      const m = link.dataset.membership;
      if (membershipSelect && m) {
        membershipSelect.value = m;
        membershipSelect.dispatchEvent(new Event("change", { bubbles: true }));
      }
      setTimeout(() => firstNameInput?.focus(), 200);
    });
  });


  /* ---------------------------------------------------
     5) EXTRA VALIDATION: mobile phone format
  --------------------------------------------------- */
  const form = document.getElementById("join-form");

  if (form) {
    form.addEventListener("submit", (e) => {
      if (!form.checkValidity()) return;

      const mobile = document.getElementById("mobile");
      if (mobile) {
        const val = mobile.value.trim();
        const digits = val.replace(/\D/g, "");

        if (!val.startsWith("+") || digits.length < 10) {
          e.preventDefault();
          mobile.setCustomValidity("Enter international format e.g. +2348012345678");
          mobile.reportValidity();
          setTimeout(() => mobile.setCustomValidity(""), 2000);
        }
      }
    });
  }


  /* ---------------------------------------------------
     6) Pre-select membership via URL (?membership=gold)
  --------------------------------------------------- */
  const urlParams = new URLSearchParams(window.location.search);
  const pre = urlParams.get("membership");
  if (pre && membershipSelect) membershipSelect.value = pre;
});
