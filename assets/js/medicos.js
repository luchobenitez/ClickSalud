// assets/js/medicos.js

/**
 * ==============================================================
 * Click-Salud | Módulo de gestión de médicos y citas
 * --------------------------------------------------------------
 * Contiene:
 *  - obtenerMedicos(): carga el JSON con la lista de médicos
 *  - filtrarMedicos(): filtra según criterios
 *  - renderMedicos(): muestra resultados en tarjetas
 *  - initCitas(): inicializa la lógica completa de la página de citas
 * ==============================================================
 */

/**
 * Cargar datos de médicos desde el JSON (ruta relativa)
 */
export async function obtenerMedicos() {
  try {
    const response = await fetch('assets/data/medicos.json');
    if (!response.ok) throw new Error('No se pudo cargar medicos.json');
    return await response.json();
  } catch (error) {
    console.error('❌ Error al obtener médicos:', error);
    return [];
  }
}

/**
 * Filtrar lista de médicos según filtros activos
 */
export function filtrarMedicos(medicos, filtros = {}) {
  return medicos.filter(m =>
    (!filtros.especialidad || m.especialidad === filtros.especialidad) &&
    (!filtros.ciudad || m.ciudad === filtros.ciudad) &&
    (!filtros.profesional || m.nombre === filtros.profesional) &&
    (!filtros.centro || m.centro === filtros.centro)
  );
}

/**
 * Renderizar tarjetas de médicos en el contenedor especificado
 */
export function renderMedicos(lista, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  contenedor.innerHTML = '';

  if (!lista || lista.length === 0) {
    contenedor.innerHTML = `<p class="text-gray-600 dark:text-gray-400">No se encontraron resultados.</p>`;
    return;
  }

  lista.forEach(m => {
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700';
    card.innerHTML = `
      <div class="flex items-center space-x-4">
        <img src="${m.foto}" alt="${m.nombre}" class="h-16 w-16 rounded-full object-cover">
        <div>
          <h4 class="text-lg font-bold text-gray-900 dark:text-white">${m.nombre}</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">${m.especialidad}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">${m.centro} — ${m.ciudad}</p>
          <p class="text-sm mt-2 text-primary font-semibold">${m.telefono}</p>
          <p class="text-sm text-gray-500">${m.email}</p>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

/**
 * Inicializar la lógica de la página de citas
 */
export async function initCitas() {
  const form = document.getElementById('form-citas');
  const selEspecialidad = document.getElementById('select-especialidad');
  const selCiudad = document.getElementById('select-ciudad');
  const selProfesional = document.getElementById('select-profesional');
  const selCentro = document.getElementById('select-centro');
  const contenedor = document.getElementById('resultados-citas');

  if (!form || !selEspecialidad || !selCiudad) {
    console.warn('⚠️ Elementos del formulario no encontrados en la página citas.');
    return;
  }

  const medicos = await obtenerMedicos();

  // Cargar opciones iniciales
  llenarSelect(selEspecialidad, [...new Set(medicos.map(m => m.especialidad))]);
  llenarSelect(selCiudad, [...new Set(medicos.map(m => m.ciudad))]);

  // Manejar selecciones encadenadas
  selEspecialidad.addEventListener('change', e => {
    const especialidad = e.target.value;
    const filtrados = medicos.filter(m => m.especialidad === especialidad);
    llenarSelect(selProfesional, [...new Set(filtrados.map(m => m.nombre))]);
    llenarSelect(selCentro, []);
  });

  selCiudad.addEventListener('change', e => {
    const especialidad = selEspecialidad.value;
    const ciudad = e.target.value;
    const filtrados = medicos.filter(m =>
      m.especialidad === especialidad && m.ciudad === ciudad
    );
    llenarSelect(selProfesional, [...new Set(filtrados.map(m => m.nombre))]);
    llenarSelect(selCentro, [...new Set(filtrados.map(m => m.centro))]);
  });

  selProfesional.addEventListener('change', e => {
    const profesional = e.target.value;
    const filtrados = medicos.filter(m => m.nombre === profesional);
    llenarSelect(selCentro, [...new Set(filtrados.map(m => m.centro))]);
  });

  // Buscar y renderizar resultados
  form.addEventListener('submit', e => {
    e.preventDefault();
    const filtros = {
      especialidad: selEspecialidad.value,
      ciudad: selCiudad.value,
      profesional: selProfesional.value,
      centro: selCentro.value
    };
    const resultados = filtrarMedicos(medicos, filtros);
    renderMedicos(resultados, 'resultados-citas');
  });

  console.log('✅ Lógica de citas inicializada');
}

/**
 * Función auxiliar: llenar un <select> con opciones
 */
function llenarSelect(select, opciones) {
  if (!select) return;
  select.innerHTML = '<option value="">Seleccionar</option>';
  opciones.forEach(o => {
    const opt = document.createElement('option');
    opt.value = o;
    opt.textContent = o;
    select.appendChild(opt);
  });
}
