/**
 * countdown.js — Etkinlik geri sayımı (program.html)
 * Hedef tarih: data-target ISO 8601 veya varsayılan
 */

(function () {
  "use strict";

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function render(root, diff) {
    if (diff <= 0) {
      root.querySelectorAll("[data-unit]").forEach((el) => {
        const u = el.getAttribute("data-unit");
        const slot = el.querySelector(".countdown-value");
        if (slot) slot.textContent = u === "sn" ? "00" : "0";
      });
      const label = document.getElementById("countdown-done");
      if (label) label.style.display = "block";
      return;
    }

    const sec = Math.floor(diff / 1000);
    const days = Math.floor(sec / 86400);
    const hrs = Math.floor((sec % 86400) / 3600);
    const min = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    const map = { gn: days, ss: pad(hrs), dk: pad(min), sn: pad(s) };
    root.querySelectorAll("[data-unit]").forEach((el) => {
      const u = el.getAttribute("data-unit");
      const slot = el.querySelector(".countdown-value");
      if (slot && map[u] !== undefined) slot.textContent = map[u];
    });
    const label = document.getElementById("countdown-done");
    if (label) label.style.display = "none";
  }

  function init() {
    const root = document.getElementById("event-countdown");
    if (!root) return;

    const raw = root.getAttribute("data-target");
    let target = raw ? new Date(raw).getTime() : NaN;
    if (Number.isNaN(target)) {
      /* Varsayılan: örnek etkinlik başlangıcı */
      target = new Date("2026-04-17T10:00:00+03:00").getTime();
    }

    function tick() {
      render(root, target - Date.now());
    }

    tick();
    window.setInterval(tick, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
