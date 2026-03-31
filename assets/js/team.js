/**
 * team.js — Hakkimizda ekip kartlari + gorsel buyutme
 */

(function () {
  "use strict";

  const DEFAULT_ROLE = "Ekip Uyesi";
  const TEAM_GRID_ID = "team-grid";
  const TEAM_IMAGE_DIR = "assets/images/kisiler";
  const TEAM_PLACEHOLDER_IMAGE = `${TEAM_IMAGE_DIR}/placeholder.svg`;

  const ROLE_OVERRIDES = {
    "ahmetcalıs.jpg": "Adalet Komisyonu Başkan Vekili",
    "ahmetemresimsek.jpg": "Anayasa Komisyonu Başkanı",
    "akifkenankavak.jpg": "İçişleri Komisyonu Başkan Vekili",
    "aliagahsafakcılar.jpg": "Katip",
    "aliagahsafakcılar1.jpg": "Tarım Orman ve Köy İşleri Komisyonu",
    "aliatar.jpg": "Sayman",
    "aliatar1.jpg": "Milli Eğitim Komisyonu Başkan Vekili",
    "aysesevdeısık.jpg": "Milli Eğitim Komisyonu Katip",
    "bedirhancalıskan.jpg": "Halkla İlişkiler Başkanı",
    "bekirnuribagcı.jpg": "Medya Başkanı",
    "betulerdogan.jpg": "Adalet Komisyonu Başkanı",
    "beyhanhalepeker.jpg": "Organizasyon Başkanı",
    "dilaraadıyaman.jpg": "Genel Koordinatör",
    "ecrinervabildirici.jpg": "Eğlence Başkanı",
    "elifnidaarduc.jpg": "Kriz Başkanı",
    "eymencakar.jpg": "Dışişleri Komisyonu Başkanı",
    "eymencakar1.jpg": "Akademi Başkanı",
    "furkandemirel.jpg": "Güvenlik Başkan Yardımcısı",
    "hikmetkücükbalcı.jpg": "İçişleri Komisyonu Başkanı",
    "izzetbayar.jpg": "Dışişleri Komisyonu Başkan Vekili",
    "meryemaydın.jpg": "Anayasa Komisyonu Başkan Vekili",
    "metehangozel.jpg": "Eğlence Başkan Yardımcısı",
    "mevlutterlemez.jpg": "Tarım Orman ve Köy İşleri Komisyonu Başkanı",
    "muhammedfurkankocak.jpg": "Dışişleri Komisyonu Katip",
    "muhammedsuhauca.jpg": "Basın Başkanı",
    "muhammedubeydefındık.jpg": "Lojistik Başkan Yardımcısı",
    "muhammetmalikmkayes.jpg": "Tarım Orman ve Köy İşleri Komisyonu Başkan Vekili",
    "omerfarukdurgun.jpg": "İçişleri Komisyonu Katip",
    "omerfarukyararlı.jpg": "Dışişleri Komisyonu Başkanı",
    "omertalhaterzi.jpg": "Adalet Komisyonu Katip",
    "ramazancomak.jpg": "Güvenlik Başkanı",
    "ruveydakocyigit.jpg": "Tasarım Başkanı",
    "serracok.jpg": "Anayasa Komisyonu Katip",
    "seyitomerdik.jpg": "Meclis Başkanı",
    "tahireroglu.jpg": "Kriz Başkan Yardımcısı",
    "yakupemırkınalı.jpg": "Milli Eğitim Komisyonu Başkanı",
    "yasinkoc.jpg": "Lojistik Başkanı",
    "zehrakocak.jpg": "Saha Görevlileri Başkanı",
  };

  // Sira: soldan saga, yukaridan asagi (verilen listeye gore)
  const TEAM_FILES = [
    "omerfarukyararlı.jpg",
    "dilaraadıyaman.jpg",
    "beyhanhalepeker.jpg",
    "yasinkoc.jpg",
    "muhammedubeydefındık.jpg",
    "bekirnuribagcı.jpg",
    "ecrinervabildirici.jpg",
    "metehangozel.jpg",
    "bedirhancalıskan.jpg",
    "ramazancomak.jpg",
    "furkandemirel.jpg",
    "zehrakocak.jpg",
    "muhammedsuhauca.jpg",
    "ruveydakocyigit.jpg",
    "elifnidaarduc.jpg",
    "tahireroglu.jpg",
    "seyitomerdik.jpg",
    "aliatar.jpg",
    "aliagahsafakcılar.jpg",
    "ahmetemresimsek.jpg",
    "meryemaydın.jpg",
    "serracok.jpg",
    "eymencakar1.jpg",
    "izzetbayar.jpg",
    "eymencakar.jpg",
    "muhammetmalikmkayes.jpg",
    "muhammedfurkankocak.jpg",
    "hikmetkücükbalcı.jpg",
    "akifkenankavak.jpg",
    "omerfarukdurgun.jpg",
    "betulerdogan.jpg",
    "omertalhaterzi.jpg",
    "mevlutterlemez.jpg",
    "aliagahsafakcılar1.jpg",
    "yakupemırkınalı.jpg",
    "aliatar1.jpg",
    "aysesevdeısık.jpg",
  ];

  // Tum gorunen isimleri buradan tek tek duzenleyebilirsin.
  const DISPLAY_NAMES = {
    "ahmetcalıs.jpg": "Ahmet Çalış",
    "ahmetemresimsek.jpg": "Ahmet Emre Şimşek",
    "akifkenankavak.jpg": "Akif Kenan Kavak",
    "aliagahsafakcılar.jpg": "Ali Agah Şafakçılar",
    "aliagahsafakcılar1.jpg": "Ali Agah Şafakçılar",
    "aliatar.jpg": "Ali Atar",
    "aliatar1.jpg": "Ali Atar",
    "aysesevdeısık.jpg": "Ayşe Sevde Işık",
    "bedirhancalıskan.jpg": "Bedirhan Çalışkan",
    "bekirnuribagcı.jpg": "Bekir Nuri Bağcı",
    "betulerdogan.jpg": "Betül Erdoğan",
    "beyhanhalepeker.jpg": "Beyhan Hale Peker",
    "dilaraadıyaman.jpg": "Dilara Adıyaman",
    "ecrinervabildirici.jpg": "Ecrin Erva Bildirici",
    "elifnidaarduc.jpg": "Elif Nida Arduç",
    "eymencakar.jpg": "Eymen Çakar",
    "eymencakar1.jpg": "Eymen Çakar",
    "furkandemirel.jpg": "Furkan Demirel",
    "hikmetkücükbalcı.jpg": "Hikmet Küçükbalcı",
    "izzetbayar.jpg": "İzzet Bayar",
    "meryemaydın.jpg": "Meryem Aydın",
    "metehangozel.jpg": "Metehan Gözel",
    "mevlutterlemez.jpg": "Mevlüt Terlemez",
    "muhammedfurkankocak.jpg": "Muhammed Furkan Koçak",
    "muhammedsuhauca.jpg": "Muhammed Süha Uca",
    "muhammedubeydefındık.jpg": "Muhammed Ubeyde Fındık",
    "muhammetmalikmkayes.jpg": "Muhammet Malik Mkayes",
    "omerfarukdurgun.jpg": "Ömer Faruk Durgun",
    "omerfarukyararlı.jpg": "Ömer Faruk Yararlı",
    "omertalhaterzi.jpg": "Ömer Talha Terzi",
    "ramazancomak.jpg": "Ramazan Çomak",
    "ruveydakocyigit.jpg": "Rüveyda Koçyigit",
    "serracok.jpg": "Serra Çok",
    "seyitomerdik.jpg": "Seyit Ömer Dik",
    "tahireroglu.jpg": "Tahir Eroğlu",
    "yakupemırkınalı.jpg": "Yakup Emir Kınalı",
    "yasinkoc.jpg": "Yasin Koç",
    "zehrakocak.jpg": "Zehra Koçak",
    "ebubekirmeral.jpg": "Ebubekir Meral",
    "esmadenizalgen.jpg": "Esma Deniz Algen",
  };

  function toTitleCase(input) {
    return input
      .split(" ")
      .filter(Boolean)
      .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
      .join(" ");
  }

  function splitByKnownFirstName(raw) {
    const knownFirstNames = [
      "ahmet",
      "akif",
      "ali",
      "ayse",
      "bedirhan",
      "bekir",
      "betul",
      "beyhan",
      "dilara",
      "ecrin",
      "elif",
      "eymen",
      "furkan",
      "hikmet",
      "izzet",
      "kerem",
      "meryem",
      "metehan",
      "mevlut",
      "muhammed",
      "muhammet",
      "omer",
      "ramazan",
      "ruveyda",
      "serra",
      "seyit",
      "tahir",
      "yakup",
      "yasin",
      "zehra",
    ];

    let result = raw;
    knownFirstNames.forEach((first) => {
      if (result.startsWith(first) && result.length > first.length) {
        result = `${first} ${result.slice(first.length)}`;
      }
    });
    return result;
  }

  function deriveDisplayName(filename) {
    const override = DISPLAY_NAMES[filename];
    if (override) return override;

    const base = filename.replace(/\.[a-z]+$/i, "").replace(/[0-9]+$/g, "");
    const cleaned = base.replace(/[^a-zA-Z]+/g, " ").toLowerCase().trim();
    const spaced = splitByKnownFirstName(cleaned);
    return toTitleCase(spaced || base);
  }

  function createMemberCard(filename) {
    const name = deriveDisplayName(filename);
    const role = ROLE_OVERRIDES[filename] || DEFAULT_ROLE;
    const imageSrc = `${TEAM_IMAGE_DIR}/${filename}`;

    const article = document.createElement("article");
    article.className = "glass team-card team-card--member";
    article.setAttribute("data-reveal", "");

    article.innerHTML = `
      <button type="button" class="member-image-btn" data-member-image="${imageSrc}" data-member-name="${name}">
        <img class="member-image" src="${imageSrc}" alt="${name}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${TEAM_PLACEHOLDER_IMAGE}';" />
      </button>
      <div class="card-body">
        <h3>${name}</h3>
        <p class="member-role">${role}</p>
      </div>
    `;

    return article;
  }

  function initTeamGrid() {
    const grid = document.getElementById(TEAM_GRID_ID);
    if (!grid) return;

    const fragment = document.createDocumentFragment();
    TEAM_FILES.forEach((file) => {
      fragment.appendChild(createMemberCard(file));
    });
    grid.replaceChildren(fragment);
  }

  function createImageLightbox() {
    const modal = document.createElement("div");
    modal.className = "team-image-lightbox";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = '<img src="" alt="" />';
    document.body.appendChild(modal);
    return modal;
  }

  function initImagePreview() {
    const modal = createImageLightbox();
    const modalImg = modal.querySelector("img");

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
    }

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-member-image]");
      if (trigger) {
        const src = trigger.getAttribute("data-member-image");
        const name = trigger.getAttribute("data-member-name") || "";
        if (!src) return;
        modalImg.src = src;
        modalImg.alt = name;
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

  function init() {
    initTeamGrid();
    initImagePreview();
  }

  window.GencMeclisTeam = {
    TEAM_FILES,
    personCaption: deriveDisplayName,
    TEAM_IMAGE_DIR,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
