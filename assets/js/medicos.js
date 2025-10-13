// assets/js/medicos.js
/**
 * ==============================================================
 * Click-Salud | Módulo de gestión de médicos y citas
 * --------------------------------------------------------------
 * Carga, filtrado y renderizado de médicos con manejo de errores.
 * Incluye inicialización robusta para SPA (páginas cargadas dinámicamente)
 * ==============================================================
 */

export async function obtenerMedicos() {
  try {
    // Detectar contexto de ejecución (local o GitHub Pages)
    const basePath = location.hostname.includes('github.io')
      ? '/ClickSalud/'
      : './';

    const response = await fetch(`${basePath}assets/data/medicos.json`, { cache: 'no-store' });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    console.log(`✅ ${data.length} médicos cargados desde ${basePath}assets/data/medicos.json`);
    return data;
  } catch (error) {
    console.error('❌ Error al obtener médicos:', error);
    mostrarMensajeError('Error al cargar datos de médicos. Verifique la conexión o el archivo.');
    return [];
  }
}


export function filtrarMedicos(medicos, filtros = {}) {
  return medicos.filter(m =>
    (!filtros.especialidad || m.especialidad === filtros.especialidad) &&
    (!filtros.ciudad || m.ciudad === filtros.ciudad) &&
    (!filtros.profesional || m.nombre === filtros.profesional) &&
    (!filtros.centro || m.centro === filtros.centro)
  );
}

export function renderMedicos(lista, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) {
    mostrarMensajeError(`❌ Contenedor con id="${contenedorId}" no encontrado.`);
    return;
  }

  contenedor.innerHTML = '';

  if (!lista || lista.length === 0) {
    contenedor.innerHTML = `<p class="text-gray-600 dark:text-gray-400">⚠️ No se encontraron resultados.</p>`;
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
 * Inicializa la lógica de la página de citas con manejo robusto de errores
 */
export async function initCitas() {
  console.log('🩺 Inicializando módulo de citas...');

  // Intentar esperar que el DOM tenga los elementos requeridos
  await esperarElemento('#form-citas', 2000);

  const form = document.getElementById('form-citas');
  const selEspecialidad = document.getElementById('select-especialidad');
  const selCiudad = document.getElementById('select-ciudad');
  const selProfesional = document.getElementById('select-profesional');
  const selCentro = document.getElementById('select-centro');

  if (!form || !selEspecialidad || !selCiudad || !selProfesional || !selCentro) {
    mostrarMensajeError('⚠️ No se encontraron elementos del formulario en el DOM.');
    console.warn('⚠️ initCitas: elementos del formulario no disponibles aún.');
    return;
  }

  const medicos = await obtenerMedicos();
  if (medicos.length === 0) {
    mostrarMensajeError('⚠️ No se cargaron datos de médicos.');
    return;
  }

  // Cargar opciones iniciales
  llenarSelect(selEspecialidad, [...new Set(medicos.map(m => m.especialidad))]);
  llenarSelect(selCiudad, [...new Set(medicos.map(m => m.ciudad))]);
  console.log('✅ Selectores iniciales cargados.');

  // Encadenar selects
  selEspecialidad.addEventListener('change', e => {
    const esp = e.target.value;
    const filtrados = medicos.filter(m => m.especialidad === esp);
    llenarSelect(selProfesional, [...new Set(filtrados.map(m => m.nombre))]);
    llenarSelect(selCentro, []);
    console.log(`➡️ Especialidad seleccionada: ${esp}`);
  });

  selCiudad.addEventListener('change', e => {
    const esp = selEspecialidad.value;
    const ciudad = e.target.value;
    const filtrados = medicos.filter(m => m.especialidad === esp && m.ciudad === ciudad);
    llenarSelect(selProfesional, [...new Set(filtrados.map(m => m.nombre))]);
    llenarSelect(selCentro, [...new Set(filtrados.map(m => m.centro))]);
    console.log(`➡️ Ciudad seleccionada: ${ciudad}`);
  });

  selProfesional.addEventListener('change', e => {
    const prof = e.target.value;
    const filtrados = medicos.filter(m => m.nombre === prof);
    llenarSelect(selCentro, [...new Set(filtrados.map(m => m.centro))]);
    console.log(`➡️ Profesional seleccionado: ${prof}`);
  });

  // Buscar
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
    console.log(`🔍 ${resultados.length} resultados filtrados.`);
  });

  mostrarMensajeExito('✅ Módulo de citas inicializado correctamente.');
}

/**
 * Llenar un select con opciones
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

/**
 * Mostrar un mensaje de error visible en pantalla
 */
function mostrarMensajeError(msg) {
  let box = document.getElementById('mensaje-error');
  if (!box) {
    box = document.createElement('div');
    box.id = 'mensaje-error';
    box.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    document.body.appendChild(box);
  }
  box.textContent = msg;
  console.error(msg);
  setTimeout(() => box.remove(), 6000);
}

/**
 * Mostrar un mensaje de éxito visible
 */
function mostrarMensajeExito(msg) {
  let box = document.getElementById('mensaje-exito');
  if (!box) {
    box = document.createElement('div');
    box.id = 'mensaje-exito';
    box.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    document.body.appendChild(box);
  }
  box.textContent = msg;
  setTimeout(() => box.remove(), 4000);
}

/**
 * Esperar hasta que un elemento esté presente en el DOM
 */
function esperarElemento(selector, timeout = 1500) {
  return new Promise(resolve => {
    const intervalo = 100;
    let tiempo = 0;
    const timer = setInterval(() => {
      if (document.querySelector(selector)) {
        clearInterval(timer);
        resolve(true);
      } else if ((tiempo += intervalo) >= timeout) {
        clearInterval(timer);
        console.warn(`⚠️ Elemento ${selector} no encontrado tras ${timeout}ms`);
        resolve(false);
      }
    }, intervalo);
  });
}
