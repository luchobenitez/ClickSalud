/**
 * =====================================================================
 * Click-Salud | directorio.js
 * ---------------------------------------------------------------------
 * Página: Directorio Médico
 * - Carga los datos desde medicos.json
 * - Filtro por especialidad y ciudad
 * - Renderiza automáticamente todos los resultados coincidentes
 * =====================================================================
 */

import { obtenerMedicos, filtrarMedicos, renderMedicos } from './medicos.js';

export async function initDirectorio() {
  console.log("📋 Inicializando página de Directorio...");

  try {
    const medicos = await obtenerMedicos();

    // Llenar los selectores iniciales
    llenarSelect('filtro-especialidad', [...new Set(medicos.map(m => m.especialidad))]);
    llenarSelect('filtro-ciudad', [...new Set(medicos.map(m => m.ciudad))]);

    // Evento: cambio en Especialidad
    document.getElementById('filtro-especialidad').addEventListener('change', e => {
      const esp = e.target.value;
      const filtrados = filtrar(medicos, esp, document.getElementById('filtro-ciudad').value);
      renderMedicos(filtrados, 'resultados-directorio');
    });

    // Evento: cambio en Ciudad
    document.getElementById('filtro-ciudad').addEventListener('change', e => {
      const ciu = e.target.value;
      const filtrados = filtrar(medicos, document.getElementById('filtro-especialidad').value, ciu);
      renderMedicos(filtrados, 'resultados-directorio');
    });

    // Mostrar todos los médicos al inicio
    renderMedicos(medicos, 'resultados-directorio');

  } catch (error) {
    console.error("❌ Error al inicializar directorio:", error);
    document.getElementById('resultados-directorio').innerHTML = `
      <p class="text-red-500 text-center">Error al cargar el directorio médico.</p>`;
  }
}

/**
 * Llenar un <select> con opciones únicas
 */
function llenarSelect(id, opciones) {
  const sel = document.getElementById(id);
  sel.innerHTML = '<option value="">Seleccionar</option>';
  opciones.forEach(o => sel.innerHTML += `<option value="${o}">${o}</option>`);
}

/**
 * Filtrar médicos según especialidad y ciudad
 */
function filtrar(medicos, especialidad, ciudad) {
  return medicos.filter(m =>
    (!especialidad || m.especialidad === especialidad) &&
    (!ciudad || m.ciudad === ciudad)
  );
}
