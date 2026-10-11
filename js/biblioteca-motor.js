/**
 * MOTOR DE LA BIBLIOTECA MODULAR - AGROLINC
 * Encapsula la lógica de comunicación con Google Sheets (CSV) y renderizado de componentes.
 */

// --- 1. PARSER DE CSV UNIVERSAL ---
function parseCSV(text) {
  return text
    .trim()
    .split("\n")
    .map(row => {
      // Divide por comas respetando celdas que contienen comillas
      let matches = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || row.split(",");
      return matches.map(value => value.replace(/^"|"$/g, "").trim());
    });
}

// --- 2. CONSUMIDOR DE BASE DE DATOS (GOOGLE SHEETS) ---
async function consultarDatosCSV(urlCSV) {
  try {
    const response = await fetch(urlCSV);
    if (!response.ok) throw new Error("Error al obtener el archivo de la Base de Datos.");
    const textData = await response.text();
    return parseCSV(textData);
  } catch (error) {
    console.error("Error en el Motor de Datos:", error);
    return [];
  }
}

// --- 3. COMPONENTE INTERACTIVO: MENÚ HAMBURGUESA ---
function initMenuResponsivo() {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("open");
      mainNav.classList.toggle("open");
    });
  }
}

// --- 4. COMPONENTE INTERACTIVO: MODAL UNIVERSAL ---
function initModalControl(idModal) {
  const modal = document.getElementById(idModal);
  if (!modal) return null;

  const closeBtn = modal.querySelector(".modal-close-btn");
  const overlay = modal.querySelector(".modal-overlay");
  
  const close = () => { modal.style.display = "none"; };

  if (closeBtn) closeBtn.addEventListener("click", close);
  if (overlay) overlay.addEventListener("click", close);

  return {
    mostrar: (datos) => {
      if(document.getElementById("modalTitle")) document.getElementById("modalTitle").textContent = datos.titulo;
      if(document.getElementById("modalDescription")) document.getElementById("modalDescription").textContent = datos.descripcion;
      if(document.getElementById("modalBadge")) document.getElementById("modalBadge").textContent = datos.categoria;
      
      const visualContainer = document.getElementById("modalVisualContainer");
      if(visualContainer && datos.icono) {
        visualContainer.innerHTML = `<i class="${datos.icono}"></i>`;
      }
      
      modal.style.display = "flex";
    },
    ocultar: close
  };
}

// --- 5. COMPONENTE INTERACTIVO: CONTROLLER DE TABS EN MAPAS (MÓVIL) ---
function initMapTabs() {
  const tabButtons = document.querySelectorAll(".map-tab-btn");
  const mapWrapper = document.getElementById("mapWrapper");

  if (tabButtons.length && mapWrapper) {
    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        if (btn.getAttribute("data-tab") === "detalles") {
          mapWrapper.classList.add("show-details");
        } else {
          mapWrapper.classList.remove("show-details");
        }
      });
    });
  }
}

// Ejecución Base al iniciar el DOM
document.addEventListener("DOMContentLoaded", () => {
  initMenuResponsivo();
  initMapTabs();
});
