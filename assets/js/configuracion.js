/**
 * ==========================================================================
 * Click-Salud | configuracion.js
 * --------------------------------------------------------------------------
 * Controla las preferencias de la aplicación:
 *  - Tema (claro / oscuro)
 *  - Idioma
 *  - Notificaciones
 *  - Sincronización
 * ==========================================================================
 */

export function initConfiguracion() {
  console.log("⚙️ Iniciando módulo de configuración...");

  const temaSelect = document.getElementById("select-tema");
  const idiomaSelect = document.getElementById("select-idioma");
  const notifToggle = document.getElementById("toggle-notificaciones");
  const syncToggle = document.getElementById("toggle-sync");
  const btnGuardar = document.getElementById("btn-guardar-config");
  const mensajeGuardado = document.getElementById("mensaje-guardado");

  // --- Cargar valores guardados ---
  const config = JSON.parse(localStorage.getItem("clicksalud_config")) || {
    tema: "light",
    idioma: "es",
    notificaciones: true,
    sincronizacion: false,
  };

  temaSelect.value = config.tema;
  idiomaSelect.value = config.idioma;
  notifToggle.checked = config.notificaciones;
  syncToggle.checked = config.sincronizacion;

  // --- Aplicar tema al cargar ---
  document.documentElement.classList.toggle("dark", config.tema === "dark");

  // --- Guardar cambios ---
  btnGuardar.addEventListener("click", () => {
    const nuevaConfig = {
      tema: temaSelect.value,
      idioma: idiomaSelect.value,
      notificaciones: notifToggle.checked,
      sincronizacion: syncToggle.checked,
    };

    localStorage.setItem("clicksalud_config", JSON.stringify(nuevaConfig));

    // Aplicar tema instantáneamente
    document.documentElement.classList.toggle("dark", nuevaConfig.tema === "dark");

    mensajeGuardado.classList.remove("hidden");
    setTimeout(() => mensajeGuardado.classList.add("hidden"), 2500);

    console.log("💾 Configuración guardada:", nuevaConfig);
  });
}
