/**
 * AGRI Lab 506 — menú móvil y carrusel de prensa.
 * Las fechas null se muestran como "Fecha no verificada" y se ordenan al final.
 * Las imágenes reutilizan fotografías locales del sitio para evitar hotlinks rotos.
 */
(() => {
  "use strict";

  function initMenuResponsivo() {
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.classList.toggle("open");
      mainNav.classList.toggle("open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 768px)").matches) {
          menuToggle.classList.remove("open");
          mainNav.classList.remove("open");
          menuToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  // Para la biblioteca modular AGRILINC, si existen estas interfaces en otras páginas.
  function parseCSV(text) {
    const rows = [];
    let row = [], cell = "", quoted = false;
    const input = String(text || "").replace(/^\uFEFF/, "");
    for (let i = 0; i < input.length; i++) {
      const char = input[i], next = input[i + 1];
      if (char === '"' && quoted && next === '"') { cell += '"'; i++; }
      else if (char === '"') quoted = !quoted;
      else if (char === "," && !quoted) { row.push(cell.trim()); cell = ""; }
      else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && next === "\n") i++;
        row.push(cell.trim());
        if (row.some(value => value !== "")) rows.push(row);
        row = []; cell = "";
      } else cell += char;
    }
    if (cell.length || row.length) { row.push(cell.trim()); rows.push(row); }
    return rows;
  }

  async function consultarDatosCSV(urlCSV) {
    try {
      const response = await fetch(urlCSV);
      if (!response.ok) throw new Error("Error al obtener el archivo CSV.");
      return parseCSV(await response.text());
    } catch (error) {
      console.error("Error en el Motor de Datos:", error);
      return [];
    }
  }

  function initModalControl(idModal) {
    const modal = document.getElementById(idModal);
    if (!modal) return null;
    const closeBtn = modal.querySelector(".modal-close-btn");
    const overlay = modal.querySelector(".modal-overlay");
    const close = () => { modal.style.display = "none"; };
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (overlay) overlay.addEventListener("click", close);
    return {
      mostrar(datos) {
        const title = document.getElementById("modalTitle");
        const description = document.getElementById("modalDescription");
        const badge = document.getElementById("modalBadge");
        const visual = document.getElementById("modalVisualContainer");
        if (title) title.textContent = datos.titulo || "";
        if (description) description.textContent = datos.descripcion || "";
        if (badge) badge.textContent = datos.categoria || "";
        if (visual && datos.icono) {
          const icon = document.createElement("i");
          icon.className = datos.icono;
          visual.replaceChildren(icon);
        }
        modal.style.display = "flex";
      },
      ocultar: close
    };
  }

  function initMapTabs() {
    const tabButtons = document.querySelectorAll(".map-tab-btn");
    const mapWrapper = document.getElementById("mapWrapper");
    if (!tabButtons.length || !mapWrapper) return;
    tabButtons.forEach(btn => btn.addEventListener("click", () => {
      tabButtons.forEach(button => {
        button.classList.remove("active");
        button.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      mapWrapper.classList.toggle("show-details", btn.getAttribute("data-tab") === "detalles");
    }));
  }

  const news = [
    // AGRI-Talk / cobertura de jóvenes: fechas verificadas en páginas de medios.
    {
      title: "Jóvenes impulsan una nueva visión del agro mediante tecnología y emprendimiento",
      source: "Heredia Hoy",
      date: "2026-08-19",
      url: "https://herediahoy.com/destacadas/jovenes-impulsan-una-nueva-vision-del-agro-mediante-tecnologia-y-emprendimiento/",
      image: "assets/images/noticia3.jpg",
      description: "Cobertura de AGRI-Talk y de las experiencias de jóvenes que integran tecnología, ciencia y emprendimiento en el sector agroalimentario."
    },
    {
      title: "Jóvenes promueven innovación en el agro a través de tecnología y emprendimiento",
      source: "Radar Ganadero",
      date: "2026-08-19",
      url: "https://radarganadero.com/2026/08/19/%F0%9F%93%B0-jovenes-promueven-innovacion-en-el-agro-a-traves-de-tecnologia-y-emprendimiento/",
      image: "assets/images/noticia3.jpg",
      description: "Experiencias, proyectos e ideas de jóvenes participantes de la primera edición de AGRI-Talk."
    },
    {
      title: "Jóvenes impulsan innovación en el agro costarricense a través de AGRI Lab 506",
      source: "Radar Ganadero",
      date: "2026-08-18",
      url: "https://radarganadero.com/2026/08/18/%F0%9F%93%B0-jovenes-impulsan-innovacion-en-el-agro-costarricense-a-traves-de-agri-lab-506/",
      image: "assets/images/noticia3.jpg",
      description: "AGRI-Talk reunió a jóvenes del sector agroalimentario para fomentar la innovación y el emprendimiento."
    },
    {
      title: "Jóvenes impulsan nueva visión del agro costarricense desde la innovación, la tecnología y el emprendimiento",
      source: "MAG",
      date: "2026-08-18",
      url: "https://mag.go.cr/jovenes-impulsan-nueva-vision-del-agro-costarricense-desde-la-innovacion-la-tecnologia-y-el-emprendimiento/",
      image: "assets/images/noticia3.jpg",
      description: "La iniciativa busca fortalecer las capacidades de innovación, liderazgo y emprendimiento de las juventudes."
    },
    {
      title: "Jóvenes impulsan nueva visión del agro costarricense desde la innovación, la tecnología y el emprendimiento",
      source: "CAWTV Nicaragua",
      date: null,
      url: "https://www.cawtv.net/noticias/jovenes-impulsan-nueva-vision-del-agro-costarricense-desde-la-innovacion-la-tecnologia-y-el-emprendimiento/",
      image: "assets/images/noticia3.jpg",
      description: "Cobertura internacional de la experiencia de AGRI-Talk."
    },
    {
      title: "Jóvenes impulsan una nueva forma de hacer agricultura",
      source: "Diario Extra · Video",
      date: null,
      url: "https://www.diarioextra.com/videos/jovenes-impulsan-una-nueva-forma-de-hacer-agricultura/",
      image: "assets/images/noticia3.jpg",
      description: "Reportaje audiovisual sobre jóvenes, tecnología y nuevas formas de hacer agricultura."
    },
    {
      title: "Entrevista sobre jóvenes, innovación y el futuro del agro",
      source: "Extra Radio · YouTube",
      date: null,
      url: "https://www.youtube.com/watch?v=9u_0JWM18D8",
      image: "assets/images/noticia3.jpg",
      description: "Entrevista radial relacionada con la innovación y el emprendimiento agroalimentario."
    },
    {
      title: "Jóvenes impulsan una nueva visión del agro costarricense",
      source: "Comunicaciones Cartago · Facebook",
      date: null,
      url: "https://www.facebook.com/comunicaciones.cartago/posts/agroj%C3%B3venes-impulsan-nueva-visi%C3%B3n-del-agro-costarricense-no-se-trata-solamente-d/1060267219887549/",
      image: "assets/images/noticia3.jpg",
      description: "Publicación en redes sociales sobre la iniciativa."
    },
    {
      title: "Jóvenes apuestan por transformar el agro con tecnología y emprendimiento",
      source: "El Sol del Occidente · Facebook",
      date: null,
      url: "https://www.facebook.com/elsol.occidente/posts/nacional-j%C3%B3venes-apuestan-por-transformar-el-agro-costarricense-con-tecnolog%C3%ADa-e/1727899422677051/",
      image: "assets/images/noticia3.jpg",
      description: "Publicación en redes sociales sobre la cobertura de AGRI-Talk."
    },
    {
      title: "Jóvenes impulsan nueva visión del agro costarricense",
      source: "CAWTV · Facebook",
      date: null,
      url: "https://www.facebook.com/cawtv.net/posts/j%C3%B3venes-impulsan-nueva-visi%C3%B3n-del-agro-costarricense-desde-la-innovaci%C3%B3n-la-tecn/1650019353800496/",
      image: "assets/images/noticia3.jpg",
      description: "Publicación social de la cobertura internacional."
    },

    // Lanzamiento de AGRI-Lab: fechas verificadas en páginas de medios.
    {
      title: "MAG, INA y el IICA lanzan AGRI-Lab para impulsar talento y emprendimiento tecnológico",
      source: "MAG",
      date: null,
      url: "https://mag.go.cr/mag-ina-y-el-iica-lanzan-agri-lab-iniciativa-para-impulsar-talento-y-emprendimiento-tecnologico-de-jovenes-en-el-sector-agropecuario-costarricense/",
      image: "assets/images/noticia1.jpg",
      description: "Nota institucional sobre el lanzamiento de la plataforma para impulsar el talento joven y el emprendimiento tecnológico en el sector agropecuario."
    },
    {
      title: "MAG, INA e IICA lanzan AGRI-Lab: talento y emprendimiento tecnológico",
      source: "Velero Informativo",
      date: null,
      url: "https://velero.cr/2026/07/mag-ina-y-el-iica-lanzan-agri-lab-iniciativa-para-impulsar-talento-y-emprendimiento-tecnologico-de-jovenes-en-el-sector-agropecuario/",
      image: "assets/images/noticia1.jpg",
      description: "Cobertura periodística del lanzamiento de AGRI-Lab."
    },
    {
      title: "AGRI-Lab impulsará talento joven, tecnología y emprendimiento en el sector agropecuario",
      source: "Heredia Hoy",
      date: "2026-07-29",
      url: "https://herediahoy.com/destacadas/agri-lab-impulsara-talento-joven-tecnologia-y-emprendimiento-en-el-sector-agropecuario/",
      image: "assets/images/noticia1.jpg",
      description: "El programa conecta formación, innovación, emprendimiento y trabajo colaborativo para las juventudes rurales."
    },
    {
      title: "MAG, INA e IICA lanzan AGRI-Lab para impulsar el emprendimiento tecnológico en jóvenes rurales",
      source: "El Mundo CR",
      date: "2026-07-29",
      url: "https://elmundo.cr/costa-rica/mag-ina-e-iica-lanzan-agri-lab-para-impulsar-el-emprendimiento-tecnologico-en-jovenes-rurales/",
      image: "assets/images/noticia1.jpg",
      description: "La plataforma promueve aprendizaje práctico, liderazgo e innovación en el sector agropecuario."
    },
    {
      title: "MAG, INA e IICA lanzan programa para impulsar emprendimientos tecnológicos de jóvenes en el agro",
      source: "Delfino.cr",
      date: "2026-07-29",
      url: "https://delfino.cr/2026/07/mag-ina-e-iica-lanzan-programa-para-impulsar-emprendimientos-tecnologicos-de-jovenes-en-el-agro",
      image: "assets/images/noticia1.jpg",
      description: "AGRI-Lab combina capacitación práctica, innovación y acompañamiento para jóvenes vinculados al sector agropecuario."
    },
    {
      title: "Lanzamiento de AGRI-Lab para impulsar el talento juvenil en el agro costarricense",
      source: "Radar Ganadero",
      date: "2026-07-29",
      url: "https://radarganadero.com/2026/07/29/%F0%9F%93%85-%F0%9F%8C%B1-lanzamiento-de-agri-lab-para-impulsar-el-talento-juvenil-en-el-agro-costarricense/",
      image: "assets/images/noticia1.jpg",
      description: "La iniciativa busca fortalecer el liderazgo y la innovación entre jóvenes del sector agropecuario."
    },
    {
      title: "Lanzan AGRI-Lab para impulsar el talento joven y la innovación en el agro",
      source: "AgroTEC",
      date: "2026-08-02",
      url: "https://agroteccr.com/lanzan-agri-lab-para-impulsar-el-talento-joven-y-la-innovacion-en-el-agro/",
      image: "assets/images/noticia2.jpg",
      description: "El MAG, el INA y el IICA presentan una iniciativa para impulsar el talento joven y la innovación agropecuaria."
    },
    {
      title: "MAG, INA y el IICA lanzan AGRI-Lab: talento y emprendimiento tecnológico",
      source: "Periódico Gente",
      date: "2026-07-29",
      url: "https://periodicogente.co.cr/mag-ina-y-el-iica-lanzan-agri-lab-iniciativa-para-impulsar-talento-y-emprendimiento-tecnologico-de-jovenes-en-el-sector-agropecuario-costarricense/screen-shot-2026-07-29-at-12-49-09/",
      image: "assets/images/noticia1.jpg",
      description: "Cobertura del lanzamiento de la iniciativa interinstitucional."
    },
    {
      title: "MAG, INA e IICA lanzan AGRI-Lab para impulsar talento y emprendimiento",
      source: "Periódico El Mensaje · Guanacaste",
      date: null,
      url: "https://www.periodicomensaje.com/guanacaste/15194-mag-ina-y-el-iica-lanzan-agri-lab-iniciativa-para-impulsar-talento-y-emprendimiento-tecnologico-de-jovenes-en-el-sector-agropecuario-costarricense",
      image: "assets/images/noticia1.jpg",
      description: "Cobertura regional del lanzamiento de AGRI-Lab."
    },
    {
      title: "AGRI-Lab: tecnología y emprendimiento para las nuevas generaciones del campo",
      source: "Puntarenas se Oye",
      date: null,
      url: "https://www.puntarenasseoye.com/nacionales/agri-lab-la-iniciativa-que-llevara-tecnologia-y-emprendimiento-a-las-nuevas-generaciones-del-campo/",
      image: "assets/images/noticia1.jpg",
      description: "Cobertura del lanzamiento y de las oportunidades para las juventudes rurales."
    },
    {
      title: "Alianza estratégica potenciará el talento y el emprendimiento en jóvenes",
      source: "Radio Santa Clara",
      date: null,
      url: "https://www.radiosantaclara.cr/alianza-estrategica-potenciara-el-talento-y-el-emprendimiento-en-jovenes/",
      image: "assets/images/noticia1.jpg",
      description: "Nota radial sobre la alianza institucional para fortalecer el talento joven."
    },
    {
      title: "Lanzan iniciativa para impulsar talento y emprendimiento tecnológico en el agro",
      source: "Rumbo Económico",
      date: null,
      url: "https://rumboeconomico.net/pymes/lanzan-iniciativa-para-impulsar-talento-y-emprendimiento-tecnologico-en-sector-agropecuario/",
      image: "assets/images/noticia1.jpg",
      description: "Cobertura económica de la nueva iniciativa para el sector agropecuario."
    },
    {
      title: "Lanzan AGRI-Lab para impulsar el talento y el emprendimiento de las juventudes rurales",
      source: "Panorama Digital",
      date: null,
      url: "https://www.panoramadigital.co.cr/agri-lab-impulsara-el-talento-y-el-emprendimiento-de-las-juventudes-rurales/",
      image: "assets/images/noticia1.jpg",
      description: "Cobertura sobre el desarrollo de talento, innovación y emprendimiento juvenil."
    },
    {
      title: "En Costa Rica, IICA apoya iniciativa para impulsar talento y emprendimientos tecnológicos",
      source: "CAWTV Nicaragua · Internacional",
      date: null,
      url: "https://www.cawtv.net/noticias/en-costa-rica-iica-apoya-lanzamiento-de-iniciativa-para-impulsar-talento-y-emprendimientos-tecnologicos-de-jovenes-en-el-sector-agropecuario/",
      image: "assets/images/noticia1.jpg",
      description: "Cobertura internacional del lanzamiento de AGRI-Lab."
    },
    {
      title: "AGRI-Lab impulsa talento joven y emprendimiento tecnológico",
      source: "aDiarioCR",
      date: null,
      url: "https://adiariocr.com/economia/agri-lab-impulsar-talento-jovenes-cr/",
      image: "assets/images/noticia1.jpg",
      description: "Cobertura sobre la iniciativa para jóvenes del sector agropecuario."
    },
    {
      title: "AGRI-Lab: lanzamiento y oportunidad para las juventudes rurales",
      source: "Cámara Nacional de Agricultura y Agroindustria · Facebook",
      date: null,
      url: "https://www.facebook.com/CamaraDeAgricultura/posts/desde-la-c%C3%A1mara-nacional-de-agricultura-y-agroindustria-felicitamos-al-ministeri/1532619682209403/",
      image: "assets/images/noticia1.jpg",
      description: "Publicación de la Cámara Nacional de Agricultura y Agroindustria."
    },
    {
      title: "Cobertura audiovisual del lanzamiento de AGRI-Lab",
      source: "Heredia Hoy · Facebook",
      date: null,
      url: "https://www.facebook.com/watch/?v=1706043970692697",
      image: "assets/images/noticia1.jpg",
      description: "Video relacionado con el lanzamiento de la iniciativa."
    },
    {
      title: "Cobertura audiovisual del lanzamiento de AGRI-Lab",
      source: "Facebook · Video",
      date: null,
      url: "https://www.facebook.com/watch/?v=1354640509536042",
      image: "assets/images/noticia1.jpg",
      description: "Video relacionado con la iniciativa AGRI-Lab."
    },
    {
      title: "Publicación sobre AGRI-Lab",
      source: "Periódico El Mensaje · Facebook",
      date: null,
      url: "https://www.facebook.com/watch/?v=1038878531878072",
      image: "assets/images/noticia1.jpg",
      description: "Publicación social sobre la iniciativa."
    },
    {
      title: "Publicación sobre el lanzamiento de AGRI-Lab",
      source: "Radio 88 Stereo · Facebook",
      date: null,
      url: "https://www.facebook.com/88stereo/posts/-mag-ina-y-el-iica-lanzan-agri-lab-iniciativa-para-impulsar-talento-y-emprendimi/1642410477888794/",
      image: "assets/images/noticia1.jpg",
      description: "Publicación radial sobre el lanzamiento."
    },
    {
      title: "Publicación de noticias de agricultura",
      source: "La República",
      date: null,
      url: "https://www.larepublica.net/agricultura",
      image: "assets/images/noticia1.jpg",
      description: "Sección general de agricultura; el enlace compartido no apunta a una nota individual de AGRI-Lab."
    }
  ];

  function formatDate(isoDate) {
    if (!isoDate) return "Fecha no verificada";
    const date = new Date(`${isoDate}T12:00:00Z`);
    return new Intl.DateTimeFormat("es-CR", {
      day: "numeric", month: "short", year: "numeric", timeZone: "UTC"
    }).format(date);
  }

  function renderNews() {
    const track = document.getElementById("newsTrack");
    if (!track) return;

    const ordered = [...news].sort((a, b) => {
      if (!a.date && !b.date) return a.source.localeCompare(b.source, "es");
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.localeCompare(a.date);
    });

    track.innerHTML = ordered.map(item => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      const article = document.createElement("article");
      article.className = "news-card";

      const imageWrap = document.createElement("div");
      imageWrap.className = "news-img-wrap";
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = `Fotografía de referencia: ${item.source} y AGRI Lab 506`;
      img.loading = "lazy";
      img.onerror = () => {
        img.onerror = null;
        img.src = "assets/images/noticia1.jpg";
      };
      const date = document.createElement("span");
      date.className = "news-date";
      date.textContent = formatDate(item.date);
      imageWrap.append(img, date);

      const body = document.createElement("div");
      body.className = "news-body";
      const source = document.createElement("div");
      source.className = "news-source";
      source.textContent = item.source;
      const title = document.createElement("h3");
      title.textContent = item.title;
      const description = document.createElement("p");
      description.textContent = item.description;
      const link = document.createElement("a");
      link.className = "read-more-link";
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.append(document.createTextNode("Leer publicación "));
      const icon = document.createElement("i");
      icon.className = "fa-solid fa-arrow-right";
      icon.setAttribute("aria-hidden", "true");
      link.append(icon);
      body.append(source, title, description, link);
      article.append(imageWrap, body);
      slide.append(article);
      return slide;
    }).forEach(slide => track.appendChild(slide));

    if (typeof Swiper === "undefined") {
      console.error("Swiper no está disponible. Verifica la conexión al CDN.");
      return;
    }

    const swiper = new Swiper(".news-swiper", {
      slidesPerView: 1,
      spaceBetween: 18,
      speed: 450,
      watchOverflow: true,
      grabCursor: true,
      keyboard: { enabled: true },
      navigation: { nextEl: "#newsNext", prevEl: "#newsPrev" },
      pagination: { el: "#newsPagination", clickable: true },
      breakpoints: {
        620: { slidesPerView: 2, spaceBetween: 22 },
        980: { slidesPerView: 3, spaceBetween: 26 }
      },
      on: {
        init: function () { updateCount(this); },
        slideChange: function () { updateCount(this); },
        breakpoint: function () { updateCount(this); }
      }
    });

    function updateCount(instance) {
      const count = document.getElementById("newsCount");
      if (!count) return;
      const first = instance.slides.length ? instance.activeIndex + 1 : 0;
      const visible = Math.min(instance.params.slidesPerView, instance.slides.length);
      count.textContent = `${first}–${Math.min(first + visible - 1, instance.slides.length)} de ${instance.slides.length} coberturas`;
    }
    window.agriNewsSwiper = swiper;
  }

  document.addEventListener("DOMContentLoaded", () => {
    initMenuResponsivo();
    initMapTabs();
    renderNews();
  });

  // Mantiene accesibles las funciones para las otras páginas de la biblioteca modular.
  window.AGRILab = Object.assign(window.AGRILab || {}, {
    parseCSV, consultarDatosCSV, initModalControl, initMapTabs
  });
})();
