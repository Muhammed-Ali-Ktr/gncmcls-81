/**
 * gallery-catalog.js — Galeri sayfasinda site gorselleri kategorileri + lightbox seti
 * Yeni dosya eklendiginde asagidaki listelere ekleyin (statik site).
 */

(function () {
  "use strict";

  function digerCategory() {
    const base = "assets/images/diger/";
    const specs = [
      ["banner.jpg", "Banner"],
      ["basvuru-açıldı.jpg", "Başvuru açıldı"],
      ["basvuru-kapandı.jpg", "Başvuru kapandı"],
      ["kgm-logo.jpg", "KGM logosu"],
      ["kıyafet-logo.jpg", "Kıyafet logosu"],
      ["kıyafet-yonetmeligi-erkek.jpg", "Kıyafet yönetmeliği — erkek"],
      ["kıyafet-yonetmeligi-kız.jpg", "Kıyafet yönetmeliği — kız"],
      ["son-1-gun.jpg", "Son 1. gün"],
      ["son-2-gun.jpg", "Son 2. gün"],
      ["son-3-gun.jpg", "Son 3. gün"],
    ];
    return {
      id: "diger",
      title: "Diğer",
      items: specs.map(([file, caption]) => ({ src: base + file, caption })),
    };
  }

  function kisilerCategory() {
    const T = window.GencMeclisTeam;
    if (!T || !Array.isArray(T.TEAM_FILES)) {
      return { id: "kisiler", title: "Kişiler", items: [] };
    }
    const base = (T.TEAM_IMAGE_DIR || "assets/images/kisiler") + "/";
    return {
      id: "kisiler",
      title: "Kişiler",
      items: T.TEAM_FILES.map((file) => ({
        src: base + file,
        caption: T.personCaption(file),
      })),
    };
  }

  function komisyonlarCategory() {
    const base = "assets/images/komisyonlar/";
    const specs = [
      ["mekomisyonu.jpg", "Milli Eğitim Komisyonu"],
      ["adaletkomisyonu.jpg", "Adalet Komisyonu"],
      ["tokkomisyon.jpg", "Tarım, Orman ve Köyişleri Komisyonu"],
      ["icislerikomisyon.jpg", "İçişleri Komisyonu"],
      ["dısıslerikomisyonu.jpg", "Dışişleri Komisyonu"],
      ["anayasakomisyonu.jpg", "Anayasa Komisyonu"],
    ];
    return {
      id: "komisyonlar",
      title: "Komisyonlar",
      items: specs.map(([file, caption]) => ({ src: base + file, caption })),
    };
  }

  function misyonVizyonCategory() {
    const base = "assets/images/mısyon-vızyon/";
    return {
      id: "misyon-vizyon",
      title: "Misyon & vizyon",
      items: [
        { src: base + "mısyon.jpg", caption: "Misyon" },
        { src: base + "vızyon.jpg", caption: "Vizyon" },
      ],
    };
  }

  function sponsorCategory() {
    const root = "assets/images/sponsor/";
    const orig = root + "Orjinal görsel/";
    return {
      id: "sponsor",
      title: "Sponsorlar",
      items: [
        { src: root + "karataygenclikmeclisi.png", caption: "Karatay Gençlik Meclisi" },
        { src: root + "kbsponsor.png", caption: "Karatay Belediyesi" },
        { src: root + "mkaihlsponsor.png", caption: "Mevlana Kız Anadolu İHL" },
        { src: orig + "karataygenclikmeclisi.jpg", caption: "Karatay Gençlik Meclisi (orijinal)" },
        { src: orig + "kbsponsor.jpg", caption: "Karatay Belediyesi (orijinal)" },
        { src: orig + "mkaihlsponsor.jpg", caption: "Mevlana Kız Anadolu İHL (orijinal)" },
      ],
    };
  }

  function buildCategories() {
    return [
      digerCategory(),
      kisilerCategory(),
      komisyonlarCategory(),
      misyonVizyonCategory(),
      sponsorCategory(),
    ];
  }

  function renderCatalog() {
    const mount = document.getElementById("gallery-catalog-root");
    if (!mount) return;

    const galleryApi = window.GencMeclisGallery;
    if (!galleryApi || typeof galleryApi.openSet !== "function") return;

    const categories = buildCategories();
    const frag = document.createDocumentFragment();

    categories.forEach((cat) => {
      if (!cat.items.length) return;

      const section = document.createElement("section");
      section.className = "gallery-catalog-block";
      section.id = "gallery-cat-" + cat.id;
      section.setAttribute("aria-labelledby", "gallery-cat-title-" + cat.id);

      const h3 = document.createElement("h3");
      h3.className = "gallery-catalog-title";
      h3.id = "gallery-cat-title-" + cat.id;
      h3.textContent = cat.title;

      const grid = document.createElement("div");
      grid.className = "gallery-catalog-grid stagger-children";

      cat.items.forEach((item, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "gallery-catalog-thumb";
        btn.setAttribute("aria-label", (item.caption || "Görsel") + " — büyüt");

        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.caption || "";
        img.loading = "lazy";
        img.decoding = "async";

        btn.appendChild(img);
        btn.addEventListener("click", () => {
          galleryApi.openSet(cat.items, index);
        });

        grid.appendChild(btn);
      });

      section.appendChild(h3);
      section.appendChild(grid);
      frag.appendChild(section);
    });

    mount.appendChild(frag);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderCatalog);
  } else {
    renderCatalog();
  }
})();
