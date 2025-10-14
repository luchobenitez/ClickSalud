/**
 * ==========================================================================
 * Click-Salud | soporte.js (versión depurada)
 * --------------------------------------------------------------------------
 * Este módulo:
 *   - Verifica si initSoporte() se ejecuta
 *   - Comprueba si los elementos HTML están disponibles
 *   - Carga faqs.json con logging detallado
 *   - Muestra errores visualmente en pantalla si algo falla
 * ==========================================================================
 */

export async function initSoporte() {
  console.log("🟢 [initSoporte] Iniciando módulo de soporte...");

  // Esperar un breve tiempo para asegurar que el DOM fue insertado por el router
  await new Promise(resolve => setTimeout(resolve, 200));

  // Referencias de elementos
  const selectCategoria = document.getElementById("select-categoria");
  const selectPregunta = document.getElementById("select-pregunta");
  const respuestaContainer = document.getElementById("respuesta-container");
  const formSoporte = document.getElementById("form-soporte");
  const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");

  // Validar que el HTML haya sido insertado correctamente
  if (!selectCategoria || !selectPregunta || !respuestaContainer) {
    console.error("❌ [initSoporte] No se encontraron los elementos del DOM de soporte.html");
    alert("⚠️ Error: El HTML de soporte no se cargó antes del script.");
    return;
  }

  console.log("✅ [initSoporte] Elementos HTML detectados correctamente.");

  try {
    // Detectar entorno de ejecución
    const basePath = location.hostname.includes("github.io")
      ? "/ClickSalud/"
      : "./";

    const dataPath = `${basePath}assets/data/faqs.json`;
    console.log("📂 [initSoporte] Intentando cargar:", dataPath);

    // Intentar fetch
    const response = await fetch(dataPath, { cache: "no-store" });
    console.log("📡 [initSoporte] Estado HTTP:", response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status} al cargar faqs.json`);
    }

    const faqsData = await response.json();
    console.log("✅ [initSoporte] FAQs cargadas:", faqsData);

    if (!Array.isArray(faqsData) || faqsData.length === 0) {
      console.warn("⚠️ [initSoporte] El archivo faqs.json está vacío o mal estructurado.");
      respuestaContainer.innerHTML = `
        <p class="text-yellow-600 dark:text-yellow-400">⚠️ No se encontraron preguntas frecuentes.</p>
      `;
      return;
    }

    // --- Llenar categorías ---
    const categorias = [...new Set(faqsData.map(f => f.categoria))];
    console.log("📑 [initSoporte] Categorías detectadas:", categorias);

    categorias.forEach(categoria => {
      const option = document.createElement("option");
      option.value = categoria;
      option.textContent = categoria;
      selectCategoria.appendChild(option);
    });

    // --- Función para llenar preguntas ---
    const llenarPreguntas = (categoriaSeleccionada) => {
      console.log("🔍 [llenarPreguntas] Categoría seleccionada:", categoriaSeleccionada);
      selectPregunta.innerHTML = '<option value="">Seleccionar pregunta</option>';
      let preguntas = [];

      if (!categoriaSeleccionada) {
        faqsData.forEach(cat => (preguntas = preguntas.concat(cat.preguntas)));
      } else {
        const categoria = faqsData.find(f => f.categoria === categoriaSeleccionada);
        preguntas = categoria ? categoria.preguntas : [];
      }

      console.log("📝 [llenarPreguntas] Preguntas detectadas:", preguntas);

      preguntas.forEach(p => {
        const option = document.createElement("option");
        option.value = p.pregunta;
        option.textContent = p.pregunta;
        selectPregunta.appendChild(option);
      });
    };

    // --- Eventos ---
    selectCategoria.addEventListener("change", () => {
      llenarPreguntas(selectCategoria.value);
      respuestaContainer.textContent = "Selecciona una pregunta para ver la respuesta.";
    });

    selectPregunta.addEventListener("change", () => {
      const preguntaSeleccionada = selectPregunta.value;
      const categoriaSeleccionada = selectCategoria.value;
      console.log("🧩 [Evento] Pregunta seleccionada:", preguntaSeleccionada);

      let faqSeleccionado = null;

      if (!categoriaSeleccionada) {
        faqsData.forEach(cat => {
          const encontrada = cat.preguntas.find(p => p.pregunta === preguntaSeleccionada);
          if (encontrada) faqSeleccionado = encontrada;
        });
      } else {
        const categoria = faqsData.find(f => f.categoria === categoriaSeleccionada);
        faqSeleccionado = categoria?.preguntas.find(p => p.pregunta === preguntaSeleccionada);
      }

      if (faqSeleccionado) {
        console.log("📘 [FAQ encontrada]", faqSeleccionado);
        respuestaContainer.innerHTML = `
          <p class="text-gray-800 dark:text-gray-200 leading-relaxed">
            ${faqSeleccionado.respuesta}
          </p>`;
      } else {
        respuestaContainer.innerHTML = `<p class="text-red-500">No se encontró la respuesta.</p>`;
      }
    });

    // Inicializar con todas las preguntas
    llenarPreguntas("");
    console.log("🎯 [initSoporte] Módulo cargado correctamente.");

  } catch (error) {
    console.error("❌ [initSoporte] Error crítico:", error);
    respuestaContainer.innerHTML = `
      <p class="text-red-600 dark:text-red-400">
        ❌ Error al cargar las preguntas frecuentes: ${error.message}
      </p>
    `;
  }

  // --- Formulario de contacto ---
  if (formSoporte) {
    formSoporte.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("📨 [formSoporte] Enviando solicitud de soporte...");

      const data = {
        nombre: document.getElementById("nombre")?.value || "",
        correo: document.getElementById("correo")?.value || "",
        tipo: document.getElementById("tipo-consulta")?.value || "",
        mensaje: document.getElementById("mensaje")?.value || "",
      };
      console.log("📦 [formSoporte] Datos del formulario:", data);

      mensajeConfirmacion?.classList.remove("hidden");
      formSoporte.reset();
      setTimeout(() => mensajeConfirmacion?.classList.add("hidden"), 4000);
    });
  } else {
    console.warn("⚠️ [initSoporte] No se encontró el formulario de soporte en el DOM.");
  }
}
