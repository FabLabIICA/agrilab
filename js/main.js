/**
 * MOTOR DINÁMICO DE NOTICIAS - AGRI LAB 506
 */

// URL CSV de Google Sheets (Pestaña de noticias)
const SHEET_CSV_NOTICIAS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQcEPvs5r9YVEcW9VEajpS5x-iYwMQWYMkreg8TK_nDgLEsKqiOt0VEmCgmev_4lkOTHh-62tcOa3a1/pub?gid=0&single=true&output=csv";

let newsSwiperInstance = null;

function parsearLineaCSV(linea) {
  const resultado = [];
  let dentroDeComillas = false;
  let entradaActual = "";

  for (let i = 0; i < linea.length; i++) {
    const char = linea[i];
    if (char === '"') {
      dentroDeComillas = !dentroDeComillas;
    } else if (char === ',' && !dentroDeComillas) {
      resultado.push(entradaActual.trim().replace(/^"|"$/g, ''));
      entradaActual = "";
    } else {
      entradaActual += char;
    }
  }
  resultado.push(entradaActual.trim().replace(/^"|"$/g, ''));
  return resultado;
}

/**
 * Convierte enlaces de Google Drive de forma robusta para renderizar imágenes
 */
function convertirLinkDriveAImagen(url) {
  if (!url || url.trim() === "") {
    return "assets/images/noticia1.jpg";
  }
  const cleanUrl = url.trim();
  const match = cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || cleanUrl.match(/id=([a-zA-Z0-9_-]+)/);
  if (!match) return cleanUrl;
  
  // Usar el dominio de Google UserContent para renderizar imágenes públicas de Drive sin restricciones
  return `https://lh3.googleusercontent.com/d/${match[1]}`;
}

function inicializarCarruselNoticias() {
  if (newsSwiperInstance) {
    newsSwiperInstance.destroy(true, true);
  }

  newsSwiperInstance = new Swiper('.newsSwiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: false,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.news-next',
      prevEl: '.news-prev',
    },
    breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 24 },
      1024: { slidesPerView: 3, spaceBetween: 32 },
    },
  });
}

async function cargarNoticiasDinamicas() {
  const wrapper = document.getElementById("noticiasWrapper");
  if (!wrapper) return;

  try {
    const response = await fetch(SHEET_CSV_NOTICIAS);
    if (!response.ok) throw new Error("Error al conectar con Google Sheets.");

    const csvTexto = await response.text();
    const filas = csvTexto.split(/\r?\n/).filter(f => f.trim() !== "");

    if (filas.length <= 1) {
      inicializarCarruselNoticias();
      return;
    }

    /**
     * Mapeo exacto según el orden de tus columnas:
     * col[0] = Fecha
     * col[1] = Titulo
     * col[2] = Resumens
     * col[3] = Plataforma
     * col[4] = Enlace
     * col[5] = Imagen
     */
    const htmlSlides = filas.slice(1).map(row => {
      const col = parsearLineaCSV(row);
      const fecha = col[0] || "Reciente";
      const titulo = col[1] || "Noticia AGRI Lab 506";
      const resumen = col[2] || "";
      const plataforma = col[3] || "";
      const enlace = col[4] && col[4].trim() !== "" ? col[4].trim() : "#";
      const imagen = convertirLinkDriveAImagen(col[5]);

      return `
        <div class="swiper-slide">
          <article class="news-card">
            <div class="news-img-wrap">
              <img src="${imagen}" alt="${titulo}" onerror="this.src='assets/images/noticia1.jpg'">
              <span class="news-date">${fecha} ${plataforma ? '· ' + plataforma : ''}</span>
            </div>
            <div class="news-body">
              <h3>${titulo}</h3>
              <p>${resumen}</p>
              <a href="${enlace}" ${enlace !== '#' ? 'target="_blank" rel="noopener noreferrer"' : ''} class="read-more-link">
                Leer noticia completa <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </article>
        </div>
      `;
    }).join("");

    wrapper.innerHTML = htmlSlides;
    inicializarCarruselNoticias();

  } catch (error) {
    console.warn("No se pudieron cargar las noticias de la red, usando respaldo local.", error);
    inicializarCarruselNoticias();
  }
}

function initMenuResponsivo() {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.style.display = mainNav.style.display === 'flex' ? 'none' : 'flex';
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initMenuResponsivo();
  cargarNoticiasDinamicas();
});
