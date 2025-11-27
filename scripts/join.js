// scripts/join.js
// Handles timestamp, modal dialogs, card animation, apply-links, and small validation enhancements.

document.addEventListener("DOMContentLoaded", () => {
  // 1) Populate hidden timestamp with ISO string date/time
  const ts = document.getElementById("timestamp");
  if (ts) {
    // Use client local time in ISO format (user's local)
    ts.value = new Date().toISOString();
  }

  // 2) Animate membership cards on page load (staggered)
  const cards = Array.from(document.querySelectorAll(".membership-card"));
  if (cards.length) {
    // Staggered entrance
    cards.forEach((card, i) => {
      // Respect reduced motion
      const delay = (i * 80) + 60; // ms
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        card.classList.add("animate-in");
      } else {
        setTimeout(() => card.classList.add("animate-in"), delay);
      }
    });
  }

  // 3) Dialog handling (accessible)
  const moreInfoLinks = document.querySelectorAll(".more-info[data-dialog]");
  moreInfoLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = link.dataset.dialog;
      const dlg = document.getElementById(id);
      if (!dlg) return;
      // If browser supports <dialog>
      if (typeof dlg.showModal === "function") {
        dlg.showModal();
        // Focus first focusable inside dialog
        const focusable = dlg.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
        if (focusable) focusable.focus();
        // trap focus (basic)
        dlg.addEventListener("cancel", (ev) => ev.preventDefault());
      } else {
        // fallback: simple alert
        alert(dlg.textContent || "Benefits");
      }
    });
  });

  // Close buttons inside dialogs
  const dialogCloseButtons = document.querySelectorAll(".dialog-close");
  dialogCloseButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const dlg = btn.closest("dialog");
      if (!dlg) return;
      if (typeof dlg.close === "function") dlg.close();
      // Return focus to last focused element (best-effort)
      const trigger = document.querySelector(`.more-info[data-dialog="${dlg.id}"]`);
      if (trigger) trigger.focus();
    });
  });

  // Close dialog on click outside (when supported)
  const dialogs = document.querySelectorAll("dialog");
  dialogs.forEach(dlg => {
    if (typeof dlg.addEventListener === "function") {
      dlg.addEventListener("click", (e) => {
        const rect = dlg.getBoundingClientRect();
        const isInDialog = (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom);
        if (!isInDialog) {
          if (typeof dlg.close === "function") dlg.close();
        }
      });
    }
  });

  // 4) "Apply" links pre-fill membership select and focus form
  const applyLinks = document.querySelectorAll(".apply-link");
  const membershipSelect = document.getElementById("membership");
  const firstNameInput = document.getElementById("firstName");
  applyLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      // default anchor points to #join-form; let browser scroll
      const m = link.dataset.membership;
      if (membershipSelect && m) {
        membershipSelect.value = m;
        // Dispatch change for any listeners
        membershipSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
      // Move focus to first form field for accessibility
      setTimeout(() => {
        if (firstNameInput) firstNameInput.focus();
      }, 200);
    });
  });

  // 5) Lightweight additional validation: phone starts with + and at least 10 digits (visual)
  const form = document.getElementById("join-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      // Use browser's constraint validation first
      if (!form.checkValidity()) {
        // Let browser show native messages
        return;
      }

      // extra mobile validation
      const mobile = document.getElementById("mobile");
      if (mobile) {
        const phoneVal = mobile.value.trim();
        // Simple check: starts with + and has at least 10 digits after removing non-digits
        const digits = phoneVal.replace(/\D/g, '');
        if (!phoneVal.startsWith('+') || digits.length < 10) {
          e.preventDefault();
          mobile.focus();
          mobile.setCustomValidity("Enter international number like +2348012345678 (at least 10 digits).");
          mobile.reportValidity();
          // Clear the custom validity after a short time so user can re-submit
          setTimeout(() => mobile.setCustomValidity(''), 2000);
          return;
        }
      }

      // When valid, allow the form to submit (GET -> thankyou.html)
      // No preventDefault here; the action will run and thankyou.html will read the GET params.
    });
  }

  // 6) Small progressive enhancement: if URL contains ?membership=... pre-select
  const urlParams = new URLSearchParams(window.location.search);
  const preMembership = urlParams.get('membership');
  if (preMembership && membershipSelect) {
    membershipSelect.value = preMembership;
  }
});
