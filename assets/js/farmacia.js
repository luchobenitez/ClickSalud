export async function initFarmacia() {
  const grilla = document.getElementById("grilla-farmacia");

  // Detectar base path (GitHub Pages o entorno local)
  const basePath = location.hostname.includes("github.io")
    ? "/ClickSalud/"
    : "./";

  try {
    const response = await fetch(`${basePath}assets/data/farmacia.json`, { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar farmacia.json");
    const recetas = await response.json();

    grilla.innerHTML = ""; // limpiar contenedor

    recetas.forEach((item) => {
      const tarjeta = document.createElement("div");
      tarjeta.className =
        "bg-white dark:bg-background-dark/50 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden";

      tarjeta.innerHTML = `
        <div class="p-6 flex flex-col h-full justify-between">
          <div>
            <h3 class="text-lg font-bold text-background-dark dark:text-background-light mb-1">
              ${item.medicamento.nombre_comercial}
            </h3>
            <p class="text-sm text-background-dark/60 dark:text-background-light/60 mb-2">
              <strong>${item.medicamento.nombre_generico}</strong> (${item.medicamento.concentracion})
            </p>
            <p class="text-sm mb-2">
              <span class="font-medium">Dosis:</span> ${item.indicaciones_medicas.dosis} |
              <span class="font-medium">Frecuencia:</span> ${item.indicaciones_medicas.frecuencia}
            </p>
            <p class="text-sm mb-2">
              <span class="font-medium">Vía:</span> ${item.indicaciones_medicas.via_administracion}
            </p>
            <p class="text-sm text-primary mb-3">
              ${item.indicaciones_medicas.proposito}
            </p>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3 text-sm">
            <p><strong>Retiro:</strong> ${item.dispensacion.lugar_retiro}</p>
            <p><strong>Cantidad:</strong> ${item.dispensacion.cantidad_asignada} ${item.dispensacion.unidades}</p>
            <p><strong>Vence:</strong> ${item.dispensacion.fecha_vencimiento_receta}</p>
          </div>

          <div class="mt-3">
            <details class="text-sm text-background-dark/70 dark:text-background-light/70">
              <summary class="cursor-pointer font-medium text-primary hover:underline">
                Advertencias e Instrucciones
              </summary>
              <ul class="list-disc ml-5 mt-2">
                ${item.advertencias_e_instrucciones_adicionales
                  .map((adv) => `<li>${adv}</li>`)
                  .join("")}
              </ul>
            </details>
          </div>
        </div>
      `;

      grilla.appendChild(tarjeta);
    });
  } catch (error) {
    console.error("Error cargando farmacia.json:", error);
    grilla.innerHTML =
      `<p class="text-red-600 dark:text-red-400 text-center col-span-full">⚠️ No se pudieron cargar los datos de farmacia.</p>`;
  }
}

// Llamar automáticamente si se carga como módulo directo
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("grilla-farmacia")) {
    initFarmacia();
  }
});
