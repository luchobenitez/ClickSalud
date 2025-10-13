/**
 * ==========================================================================
 * Click-Salud | historia-clinica.js
 * --------------------------------------------------------------------------
 * Carga y despliega todos los datos de historia-clinica.json
 * ==========================================================================
 */

export async function initHistoriaClinica() {
  const contenedor = document.querySelector('main .max-w-4xl');
  if (!contenedor) return;

  try {
    const basePath = location.hostname.includes('github.io') ? '/ClickSalud/' : './';
    const response = await fetch(`${basePath}assets/data/historia-clinica.json`, { cache: 'no-store' });
    const data = await response.json();

    contenedor.innerHTML = `
      <h2 class="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">Historia Clínica</h2>

      <!-- Datos del paciente -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Datos del Paciente</h3>
        <p><strong>Ficha:</strong> ${data.ficha_id}</p>
        <p><strong>Nombre:</strong> ${data.paciente.nombres} ${data.paciente.apellidos}</p>
        <p><strong>Fecha de nacimiento:</strong> ${data.paciente.fecha_nacimiento} (${data.paciente.edad} años)</p>
        <p><strong>Sexo:</strong> ${data.paciente.sexo}</p>
        <p><strong>Cédula:</strong> ${data.paciente.cedula_identidad}</p>
        <p><strong>Ocupación:</strong> ${data.paciente.ocupacion}</p>
        <p><strong>Estado civil:</strong> ${data.paciente.estado_civil}</p>
        <h4 class="mt-4 font-semibold">Contacto de emergencia:</h4>
        <p>${data.paciente.contacto_emergencia.nombre} (${data.paciente.contacto_emergencia.parentesco}) - ${data.paciente.contacto_emergencia.telefono}</p>
      </section>

      <!-- Diagnóstico -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Diagnóstico Principal</h3>
        <p><strong>CIE-10:</strong> ${data.diagnostico_principal.cie10}</p>
        <p><strong>Descripción:</strong> ${data.diagnostico_principal.descripcion}</p>
        <h4 class="mt-4 font-semibold">Diagnósticos Secundarios:</h4>
        <ul class="list-disc pl-6">
          ${data.diagnostico_principal.secundarios.map(d => `<li>${d.cie10} – ${d.descripcion}</li>`).join('')}
        </ul>
      </section>

      <!-- Antecedentes -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Antecedentes</h3>
        <h4 class="font-semibold mt-2">Personales:</h4>
        <ul class="list-disc pl-6">
          <li><strong>HTA:</strong> ${data.antecedentes.personales.hta}</li>
          <li><strong>DM2:</strong> ${data.antecedentes.personales.dm2}</li>
          <li><strong>Quirúrgicos:</strong> ${data.antecedentes.personales.quirurgicos}</li>
          <li><strong>Alergias:</strong> ${data.antecedentes.personales.alergias}</li>
          <li><strong>Hábitos:</strong> Tabaco: ${data.antecedentes.personales.habitos_toxicos.tabaco} | Alcohol: ${data.antecedentes.personales.habitos_toxicos.alcohol}</li>
        </ul>

        <h4 class="font-semibold mt-4">Familiares:</h4>
        <ul class="list-disc pl-6">
          <li><strong>Padre:</strong> ${data.antecedentes.familiares.padre}</li>
          <li><strong>Madre:</strong> ${data.antecedentes.familiares.madre}</li>
          <li><strong>Hermanos:</strong> ${data.antecedentes.familiares.hermanos}</li>
        </ul>
      </section>

      <!-- Episodio Actual -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Episodio Actual</h3>
        <p><strong>Fecha de ingreso:</strong> ${data.episodio_actual.fecha_ingreso}</p>
        <p><strong>Motivo de consulta:</strong> ${data.episodio_actual.motivo_consulta}</p>
        <h4 class="mt-4 font-semibold">Examen Físico:</h4>
        <ul class="list-disc pl-6">
          ${Object.entries(data.episodio_actual.examen_fisico)
            .map(([k, v]) => `<li><strong>${k.toUpperCase()}:</strong> ${v}</li>`).join('')}
        </ul>
      </section>

      <!-- Laboratorio e Imágenes -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Laboratorio e Imágenes</h3>
        <p><strong>Fecha del informe:</strong> ${data.laboratorio_e_imagenes.fecha_informe}</p>
        <ul class="list-disc pl-6">
          ${Object.entries(data.laboratorio_e_imagenes.resultados_clave)
            .map(([k, v]) => `<li><strong>${k.toUpperCase()}:</strong> ${v}</li>`).join('')}
        </ul>
      </section>

      <!-- Plan de Manejo -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Plan de Manejo Cronológico</h3>
        <ol class="list-decimal pl-6">
          ${data.plan_manejo_cronologico.map(p => `<li><strong>${p.fecha}:</strong> ${p.accion}</li>`).join('')}
        </ol>
      </section>

      <!-- Pronóstico -->
      <section class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Pronóstico</h3>
        <p>${data.pronostico}</p>
      </section>
    `;

  } catch (error) {
    console.error('Error cargando historia-clinica.json:', error);
    contenedor.innerHTML = `<p class="text-red-500">No se pudo cargar la historia clínica.</p>`;
  }
}
