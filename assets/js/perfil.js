/**
 * ==========================================================================
 * Click-Salud | perfil.js
 * --------------------------------------------------------------------------
 * Despliega la ficha clínica del paciente a partir de perfil.json
 * ==========================================================================
 */

export async function initPerfil() {
  try {
    // Detectar entorno (local o GitHub Pages)
    const basePath = location.hostname.includes('github.io')
      ? '/ClickSalud/'
      : './';

    const response = await fetch(`${basePath}assets/data/perfil.json`);
    if (!response.ok) throw new Error('No se pudo cargar perfil.json');

    const data = await response.json();

    const p = data.datos_personales;
    const s = data.datos_de_salud_resumen;
    const m = data.metas_de_salud;

    // Imagen de perfil
    document.getElementById('foto-perfil').src = p.foto_perfil_url || 'assets/img/default-avatar.png';

    // Datos personales
    document.getElementById('nombre-completo').textContent = `${p.nombres} ${p.apellidos}`;
    document.getElementById('ocupacion').textContent = p.ocupacion;
    document.getElementById('cedula').textContent = `CI: ${p.cedula_identidad}`;
    document.getElementById('fecha-nacimiento').textContent = p.fecha_nacimiento;
    document.getElementById('edad').textContent = p.edad;
    document.getElementById('sexo').textContent = p.sexo;
    document.getElementById('grupo-sanguineo').textContent = p.grupo_sanguineo;
    document.getElementById('estado-civil').textContent = p.estado_civil;
    document.getElementById('direccion').textContent = p.contacto_propio.direccion;
    document.getElementById('telefono').textContent = p.contacto_propio.telefono_movil;
    document.getElementById('email').textContent = p.contacto_propio.email;

    // Diagnóstico
    document.getElementById('diagnostico').textContent =
      `${s.diagnostico_cronico_principal.descripcion} (${s.diagnostico_cronico_principal.cie10})`;

    // Listas dinámicas
    renderList('comorbilidades', s.comorbilidades.map(c => `${c.descripcion} (${c.cie10})`));
    renderList('medicamentos', s.medicamentos_cronicos);
    renderList('alergias', s.alergias.map(a => `${a.sustancia} – ${a.reaccion}`));

    // Otros campos
    document.getElementById('vacunas').textContent = s.vacunas_covid;
    document.getElementById('cirugias').textContent = s.historial_quirurgico.join(', ');

    // Metas de salud
    document.getElementById('meta-pa').textContent = m.presion_arterial_objetivo;
    document.getElementById('meta-glucosa').textContent = m.glucosa_ayunas_objetivo;
    document.getElementById('meta-peso').textContent = m.peso_objetivo;
    document.getElementById('meta-fc').textContent = m.frecuencia_cardiaca_objetivo;

  } catch (err) {
    console.error('❌ Error cargando el perfil:', err);
    const container = document.getElementById('perfil-container');
    if (container) {
      container.innerHTML = `<p class="text-red-600 text-center">Error al cargar la ficha clínica.</p>`;
    }
  }
}

function renderList(elementId, items) {
  const list = document.getElementById(elementId);
  if (!list) return;
  list.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
}
