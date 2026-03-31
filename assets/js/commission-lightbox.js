/**
 * commission-lightbox.js — Komisyon gorselleri buyutme modal'i
 */

(function () {
  "use strict";

  function createModal() {
    const modal = document.createElement("div");
    modal.className = "commission-image-lightbox";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = '<img src="" alt="" />';
    document.body.appendChild(modal);
    return modal;
  }

  function initCommissionLightbox() {
    const modal = createModal();
    const modalImage = modal.querySelector("img");

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
    }

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-commission-image]");
      if (trigger) {
        const src = trigger.getAttribute("data-commission-image");
        const title = trigger.getAttribute("data-commission-title") || "Komisyon";
        if (!src) return;

        modalImage.src = src;
        modalImage.alt = `${title} görseli`;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("no-scroll");
        return;
      }

      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });
  }

  function initCommissionExpanders() {
    const buttons = document.querySelectorAll("[data-commission-toggle]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest(".commission-card");
        const more = card ? card.querySelector("[data-commission-more]") : null;
        if (!more) return;

        const opening = more.hasAttribute("hidden");
        if (opening) {
          more.removeAttribute("hidden");
          button.setAttribute("aria-expanded", "true");
          button.textContent = "Daha az göster";
        } else {
          more.setAttribute("hidden", "");
          button.setAttribute("aria-expanded", "false");
          button.textContent = "Daha fazla göster";
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initCommissionLightbox();
      initCommissionExpanders();
    });
  } else {
    initCommissionLightbox();
    initCommissionExpanders();
  }
})();
