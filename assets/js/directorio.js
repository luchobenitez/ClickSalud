/**
 * =====================================================================
 * Click-Salud | directorio.js
 * ---------------------------------------------------------------------
 * Manejo de la página de Directorio Médico:
 *  - Carga de médicos desde medicos.json
 *  - Filtros dinámicos por especialidad, ciudad, profesional y centro
 *  - Renderizado del listado filtrado
 * =====================================================================
 */

import { obtenerMedicos, filtrarMedicos, renderMedicos } from './medicos.js';

export async function initDirectorio() {
  console.log("📋 Inicializando página de Directorio...");

  let medicos = [];

  try {
    medicos = await obtenerMedicos();

    llenarSelect('filtro-especialidad', [...new Set(medicos.map(m => m.especialidad))]);
    llenarSelect('filtro-ciudad', [...new Set(medicos.map(m => m.ciudad))]);

    // Eventos de filtro en cascada
    document.getElementById('filtro-especialidad').addEventListener('change', e => {
      const esp = e.target.value;
      const filtrados = medicos.filter(m => m.especialidad === esp);
      llenarSelect('filtro-ciudad', [...new Set(filtrados.map(m => m.ciudad))]);
      llenarSelect('filtro-profesional', [...new Set(filtrados.map(m => m.nombre))]);
      llenarSelect('filtro-centro', []);
    });

    document.getElementById('filtro-ciudad').addEventListener('change', e => {
      const esp = document.getElementById('filtro-especialidad').value;
      const ciudad = e.target.value;
      const filtrados = medicos.filter(m => m.especialidad === esp && m.ciudad === ciudad);
      llenarSelect('filtro-profesional', [...new Set(filtrados.map(m => m.nombre))]);
      llenarSelect('filtro-centro', [...new Set(filtrados.map(m => m.centro))]);
    });

    document.getElementById('filtro-profesional').addEventListener('change', e => {
      const profesional = e.target.value;
      const filtrados = medicos.filter(m => m.nombre === profesional);
      llenarSelect('filtro-centro', [...new Set(filtrados.map(m => m.centro))]);
    });

    document.getElementById('form-directorio').addEventListener('submit', e => {
      e.preventDefault();
      const filtros = {
        especialidad: document.getElementById('filtro-especialidad').value,
        ciudad: document.getElementById('filtro-ciudad').value,
        profesional: document.getElementById('filtro-profesional').value,
        centro: document.getElementById('filtro-centro').value,
      };
      const resultados = filtrarMedicos(medicos, filtros);
      renderMedicos(resultados, 'resultados-directorio');
    });

  } catch (error) {
    console.error("❌ Error al inicializar directorio:", error);
    document.getElementById('resultados-directorio').innerHTML = `
      <p class="text-red-500 text-center">Error al cargar el directorio médico.</p>`;
  }
}

function llenarSelect(id, opciones) {
  const sel = document.getElementById(id);
  sel.innerHTML = '<option value="">Seleccionar</option>';
  opciones.forEach(o => sel.innerHTML += `<option value="${o}">${o}</option>`);
}
