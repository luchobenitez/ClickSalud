/**
 * ==========================================================================
 * Click-Salud | soporte.js
 * --------------------------------------------------------------------------
 * Controla el módulo de soporte y FAQs
 *  - Carga y despliega las preguntas frecuentes (faqs.json)
 *  - Filtra por categoría y pregunta
 *  - Maneja el formulario de contacto
 * ==========================================================================
 */

export async function initSoporte() {
  const selectCategoria = document.getElementById("select-categoria");
  const selectPregunta = document.getElementById("select-pregunta");
  const respuestaContainer = document.getElementById("respuesta-container");
  const formSoporte = document.getElementById("form-soporte");
  const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");

  console.log("🟢 initSoporte() iniciado");

  try {
    // Detectar ruta base (GitHub Pages o local)
    const basePath = location.hostname.includes("github.io")
      ? "/ClickSalud/"
      : "./";

    const response = await fetch(`${basePath}assets/data/faqs.json`);
    if (!response.ok) throw new Error("No se pudo cargar faqs.json");
    const faqsData = await response.json();
    console.log("✅ FAQs cargadas:", faqsData);
    console.log("🔢 Cantidad de categorías:", faqsData.length);

    // --- Llenar categorías únicas ---
    const categorias = [...new Set(faqsData.map((faq) => faq.categoria))];
    console.log("🗂 Categorías detectadas:", categorias);
    categorias.forEach((categoria) => {
      const option = document.createElement("option");
      option.value = categoria;
      option.textContent = categoria;
      selectCategoria.appendChild(option);
    });

    // --- Función para llenar preguntas ---
    const llenarPreguntas = (categoriaSeleccionada) => {
      selectPregunta.innerHTML = '<option value="">Seleccionar pregunta</option>';
      let preguntas = [];

      if (!categoriaSeleccionada) {
        faqsData.forEach((cat) => (preguntas = preguntas.concat(cat.preguntas)));
      } else {
        const categoria = faqsData.find((f) => f.categoria === categoriaSeleccionada);
        preguntas = categoria ? categoria.preguntas : [];
      }

      preguntas.forEach((p) => {
        const option = document.createElement("option");
        option.value = p.pregunta;
        option.textContent = p.pregunta;
        selectPregunta.appendChild(option);
      });
    };

    // --- Listener categoría ---
    selectCategoria.addEventListener("change", () => {
      llenarPreguntas(selectCategoria.value);
      respuestaContainer.textContent = "Selecciona una pregunta para ver la respuesta.";
    });

    // --- Listener pregunta ---
    selectPregunta.addEventListener("change", () => {
      const preguntaSeleccionada = selectPregunta.value;
      const categoriaSeleccionada = selectCategoria.value;
      let faqSeleccionado = null;

      if (!categoriaSeleccionada) {
        faqsData.forEach((cat) => {
          const encontrada = cat.preguntas.find((p) => p.pregunta === preguntaSeleccionada);
          if (encontrada) faqSeleccionado = encontrada;
        });
      } else {
        const categoria = faqsData.find((f) => f.categoria === categoriaSeleccionada);
        faqSeleccionado = categoria?.preguntas.find((p) => p.pregunta === preguntaSeleccionada);
      }

      if (faqSeleccionado) {
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

  } catch (error) {
    console.error("Error al cargar las FAQs:", error);
    respuestaContainer.innerHTML = `<p class="text-red-500">Error al cargar las preguntas frecuentes.</p>`;
  }

  // --- Formulario de contacto ---
  formSoporte.addEventListener("submit", (e) => {
    e.preventDefault();

    // Aquí podrías enviar los datos al servidor o API si existe backend
    console.log("📨 Solicitud de soporte enviada:", {
      nombre: document.getElementById("nombre").value,
      correo: document.getElementById("correo").value,
      tipo: document.getElementById("tipo-consulta").value,
      mensaje: document.getElementById("mensaje").value,
    });

    mensajeConfirmacion.classList.remove("hidden");
    formSoporte.reset();

    setTimeout(() => mensajeConfirmacion.classList.add("hidden"), 4000);
  });
}
