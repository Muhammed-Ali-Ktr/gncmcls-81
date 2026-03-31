/**
 * main.js — layout shell, nav, lazy media, loading screen, smooth scroll
 */

(function () {
  "use strict";

  const CONFIG = {
    /** Paths are relative to each HTML file in project root */
    navbarUrl: "components/navbar.html",
    footerUrl: "components/footer.html",
    socialIconsUrl: "components/social-row-content.html",
    /** Max time to show intro if video fails */
    loadingFallbackMs: 6500,
  };

  /**
   * Inject partial HTML into a target element.
   */
  async function injectPartial(url, targetId) {
    const el = document.getElementById(targetId);
    if (!el) return false;
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(res.statusText);
      el.innerHTML = await res.text();
      return true;
    } catch (err) {
      console.warn("[Genç Meclis] Bileşen yüklenemedi:", url, err.message);
      el.innerHTML =
        '<p style="padding:1rem;text-align:center;color:#94a3b8;">Menü ve alt bilgi yüklenemedi. Lütfen siteyi bir yerel sunucu üzerinden açın (ör. Live Server).</p>';
      return false;
    }
  }

  function setActiveNavLink() {
    const page = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-menu a[data-nav]").forEach((a) => {
      const href = a.getAttribute("data-nav");
      if (href === page || (page === "" && href === "index.html")) {
        a.classList.add("is-active");
        a.setAttribute("aria-current", "page");
      }
    });
  }

  function initMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open);
    });

    menu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        menu.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initSmoothAnchors() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const dest = document.querySelector(id);
      if (!dest) return;
      e.preventDefault();
      dest.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /**
   * Native lazy loading + optional video poster swap when intersecting
   */
  function initLazyMedia() {
    const videos = document.querySelectorAll("video[data-lazy-src]");
    if (!videos.length || !("IntersectionObserver" in window)) {
      videos.forEach((v) => {
        const s = v.getAttribute("data-lazy-src");
        if (s) {
          const src = document.createElement("source");
          src.src = s;
          src.type = "video/mp4";
          v.appendChild(src);
          v.load();
        }
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const v = entry.target;
          const s = v.getAttribute("data-lazy-src");
          if (s && !v.querySelector("source")) {
            const src = document.createElement("source");
            src.src = s;
            src.type = "video/mp4";
            v.appendChild(src);
            v.load();
          }
          obs.unobserve(v);
        });
      },
      { rootMargin: "120px" }
    );

    videos.forEach((v) => io.observe(v));
  }

  function initFooterYear() {
    const y = document.getElementById("footer-year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  /**
   * Fullscreen loading: giris.mp4 + logo; skip button + fallback timeout
   */
  function initLoadingScreen() {
    const root = document.getElementById("loading-screen");
    if (!root) return;

    const video = root.querySelector("#loading-intro-video");
    const skip = root.querySelector(".skip-intro");
    let done = false;

    function finish() {
      if (done) return;
      done = true;
      root.classList.add("is-hidden");
      document.body.classList.remove("no-scroll");
      setTimeout(() => root.remove(), 900);
    }

    document.body.classList.add("no-scroll");

    const t = window.setTimeout(finish, CONFIG.loadingFallbackMs);

    if (skip) {
      skip.addEventListener("click", () => {
        window.clearTimeout(t);
        finish();
      });
    }

    if (video) {
      video.addEventListener("ended", () => {
        window.clearTimeout(t);
        finish();
      });
      video.addEventListener("error", () => {
        window.clearTimeout(t);
        finish();
      });
    }
  }

  /**
   * Başvuru formu — istemci tarafı doğrulama ve başarı mesajı
   */
  function initBasvuruForm() {
    const form = document.getElementById("basvuru-form");
    if (!form) return;

    const success = document.getElementById("basvuru-success");

    const fields = {
      ad: { input: form.querySelector("#basvuru-ad"), err: form.querySelector('[data-error-for="ad"]'), validate: (v) => v.trim().length >= 2 },
      okul: { input: form.querySelector("#basvuru-okul"), err: form.querySelector('[data-error-for="okul"]'), validate: (v) => v.trim().length >= 2 },
      email: {
        input: form.querySelector("#basvuru-email"),
        err: form.querySelector('[data-error-for="email"]'),
        validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      },
      telefon: {
        input: form.querySelector("#basvuru-telefon"),
        err: form.querySelector('[data-error-for="telefon"]'),
        validate: (v) => /^[0-9+\s()-]{10,}$/.test(v.trim()),
      },
      komisyon: {
        input: form.querySelector("#basvuru-komisyon"),
        err: form.querySelector('[data-error-for="komisyon"]'),
        validate: (v) => v.trim() !== "",
      },
    };

    function showErr(key, show) {
      const f = fields[key];
      if (!f || !f.input || !f.err) return;
      f.input.classList.toggle("is-invalid", show);
      f.err.classList.toggle("is-visible", show);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      Object.keys(fields).forEach((key) => {
        const f = fields[key];
        if (!f.input) return;
        const val = f.input.value;
        const pass = f.validate(val);
        showErr(key, !pass);
        if (!pass) ok = false;
      });

      if (!ok) return;

      form.reset();
      Object.keys(fields).forEach((k) => showErr(k, false));
      if (success) {
        success.classList.add("is-visible");
        success.scrollIntoView({ behavior: "smooth", block: "nearest" });
        window.setTimeout(() => success.classList.remove("is-visible"), 8000);
      }
    });
  }

  async function injectSocialIcons() {
    const mounts = document.querySelectorAll(".js-social-icons");
    if (!mounts.length) return;
    try {
      const res = await fetch(CONFIG.socialIconsUrl, { cache: "no-cache" });
      if (!res.ok) throw new Error(res.statusText);
      const raw = await res.text();
      mounts.forEach((mount, i) => {
        const uid = `ig-grad-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        mount.innerHTML = raw.replace(/__IG_GRAD__/g, uid);
      });
    } catch (err) {
      console.warn("[Genç Meclis] Sosyal ikonlar yüklenemedi:", err.message);
    }
  }

  async function boot() {
    await Promise.all([
      injectPartial(CONFIG.navbarUrl, "site-header-placeholder"),
      injectPartial(CONFIG.footerUrl, "site-footer-placeholder"),
    ]);

    await injectSocialIcons();

    setActiveNavLink();
    initMobileNav();
    initFooterYear();
    initSmoothAnchors();
    initLazyMedia();
    initLoadingScreen();
    initBasvuruForm();

    initHeroScrollVisibility();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.GencMeclis = window.GencMeclis || {};
  window.GencMeclis.initLazyMedia = initLazyMedia;

  function initHeroScrollVisibility() {
    const heroes = document.querySelectorAll(".hero, .page-hero");
    if (!heroes.length) return;

    let t = null;

    const show = () => heroes.forEach((el) => el.classList.remove("hero--scroll-hidden"));
    const hide = () => heroes.forEach((el) => el.classList.add("hero--scroll-hidden"));

    const onScroll = () => {
      const y = window.scrollY || 0;

      // Sayfa en yukarıdayken hero hep görünür.
      if (y <= 5) {
        if (t) window.clearTimeout(t);
        show();
        return;
      }

      // Kaydırma sırasında gizle.
      hide();

      // Kaydırma durunca tekrar göster.
      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => {
        show();
      }, 180);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
