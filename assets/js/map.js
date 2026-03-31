/**
 * map.js — Harita iframe’ini görünür olunca yükle (performans)
 */

(function () {
  "use strict";

  function initLazyMap() {
    const holder = document.getElementById("map-lazy");
    if (!holder) return;

    const src = holder.getAttribute("data-map-src");
    if (!src) return;

    function mount() {
      if (holder.querySelector("iframe")) return;
      const iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.setAttribute("loading", "lazy");
      iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
      iframe.title = holder.getAttribute("data-title") || "Etkinlik konumu";
      iframe.allowFullscreen = true;
      holder.appendChild(iframe);
    }

    if (!("IntersectionObserver" in window)) {
      mount();
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          mount();
          obs.disconnect();
        });
      },
      { rootMargin: "80px" }
    );

    io.observe(holder);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLazyMap);
  } else {
    initLazyMap();
  }
})();
