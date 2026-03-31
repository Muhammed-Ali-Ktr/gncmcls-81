/**
 * gallery.js — Lightbox for images & video; optional prev/next within a set
 */

(function () {
  "use strict";

  /** @typedef {{ src: string, caption?: string, type?: string }} GalleryItem */

  let galleryState = {
    /** @type {GalleryItem[]} */
    items: [],
    index: 0,
  };

  function createLightbox() {
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Ön izleme");
    lb.innerHTML =
      '<button type="button" class="lightbox-nav lightbox-nav--prev" aria-label="Önceki görsel">‹</button>' +
      '<div class="lightbox-inner">' +
      '<button type="button" class="lightbox-close" aria-label="Kapat">×</button>' +
      '<div class="lightbox-stage"></div>' +
      '<p class="lightbox-caption"></p>' +
      "</div>" +
      '<button type="button" class="lightbox-nav lightbox-nav--next" aria-label="Sonraki görsel">›</button>';
    document.body.appendChild(lb);

    const inner = lb.querySelector(".lightbox-inner");
    const stage = lb.querySelector(".lightbox-stage");
    const cap = lb.querySelector(".lightbox-caption");
    const closeBtn = lb.querySelector(".lightbox-close");
    const prevBtn = lb.querySelector(".lightbox-nav--prev");
    const nextBtn = lb.querySelector(".lightbox-nav--next");

    function close() {
      lb.classList.remove("is-open");
      stage.innerHTML = "";
      cap.textContent = "";
      galleryState = { items: [], index: 0 };
      prevBtn.classList.remove("is-visible");
      nextBtn.classList.remove("is-visible");
      document.body.classList.remove("no-scroll");
    }

    function renderIndex() {
      const { items, index } = galleryState;
      if (!items.length) return;
      const item = items[index];
      const type = item.type || "image";
      stage.innerHTML = "";

      if (type === "video") {
        const v = document.createElement("video");
        v.setAttribute("controls", "");
        v.setAttribute("playsinline", "");
        v.setAttribute("autoplay", "");
        v.src = item.src;
        stage.appendChild(v);
      } else {
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.caption || "";
        stage.appendChild(img);
      }

      cap.textContent = item.caption || "";
      const showNav = items.length > 1;
      prevBtn.classList.toggle("is-visible", showNav);
      nextBtn.classList.toggle("is-visible", showNav);
      prevBtn.disabled = !showNav;
      nextBtn.disabled = !showNav;
    }

    function step(delta) {
      const n = galleryState.items.length;
      if (n <= 1) return;
      galleryState.index = (galleryState.index + delta + n) % n;
      renderIndex();
    }

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      step(-1);
    });
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      step(1);
    });
    lb.addEventListener("click", (e) => {
      if (e.target === lb) close();
    });

    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft" && galleryState.items.length > 1) {
        e.preventDefault();
        step(-1);
      } else if (e.key === "ArrowRight" && galleryState.items.length > 1) {
        e.preventDefault();
        step(1);
      }
    });

    return { lb, stage, cap, close, renderIndex, inner };
  }

  let lightboxSingleton = null;

  /**
   * @param {{ type?: string, src?: string, caption?: string, gallery?: { items: GalleryItem[], index: number } }} opts
   */
  function openLightbox(opts) {
    let box = lightboxSingleton;
    if (!box) {
      box = createLightbox();
      lightboxSingleton = box;
    }

    const { lb } = box;

    if (opts.gallery && opts.gallery.items && opts.gallery.items.length) {
      galleryState = {
        items: opts.gallery.items.slice(),
        index: Math.max(0, Math.min(opts.gallery.index || 0, opts.gallery.items.length - 1)),
      };
    } else {
      const src = opts.src;
      if (!src) return;
      galleryState = {
        items: [{ src, caption: opts.caption || "", type: opts.type || "image" }],
        index: 0,
      };
    }

    box.renderIndex();
    lb.classList.add("is-open");
    document.body.classList.add("no-scroll");
  }

  function initTriggers() {
    document.querySelectorAll("[data-lightbox]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const type = el.getAttribute("data-type") || "image";
        const src = el.getAttribute("data-src") || el.getAttribute("href");
        const caption = el.getAttribute("data-caption") || "";
        if (src) openLightbox({ type, src, caption });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTriggers);
  } else {
    initTriggers();
  }

  window.GencMeclisGallery = {
    open: openLightbox,
    /**
     * @param {GalleryItem[]} items
     * @param {number} index
     */
    openSet(items, index) {
      if (!items || !items.length) return;
      openLightbox({
        gallery: {
          items: items.map((it) => ({
            src: it.src,
            caption: it.caption || "",
            type: it.type || "image",
          })),
          index: index || 0,
        },
      });
    },
  };
})();
