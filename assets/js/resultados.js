export async function initResultados() {
  const tablaBody = document.getElementById('tabla-resultados-body');
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center hidden z-50';
  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
      <button id="cerrarModal" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
        <span class="material-symbols-outlined">close</span>
      </button>
      <h3 id="modalTitulo" class="text-xl font-bold text-gray-900 dark:text-white mb-2"></h3>
      <p id="modalFecha" class="text-sm text-gray-500 dark:text-gray-400 mb-4"></p>
      <div id="modalContenido" class="text-sm text-gray-700 dark:text-gray-300"></div>
      <div class="mt-4 text-right">
        <a id="modalDescargar" target="_blank" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hidden">
          Descargar PDF
        </a>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const cerrarModal = () => modal.classList.add('hidden');
  modal.addEventListener('click', e => { if (e.target === modal) cerrarModal(); });
  modal.querySelector('#cerrarModal').addEventListener('click', cerrarModal);

  try {
    // ✅ Detección robusta del path, compatible con GitHub Pages
    const basePath = location.hostname.includes('github.io')
      ? '/ClickSalud/'
      : `${window.location.origin}/`;

    console.log('🧩 Buscando JSON en:', `${basePath}assets/data/resultados.json`);

    const response = await fetch(`${basePath}assets/data/resultados.json`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Error cargando resultados.json');

    const data = await response.json();
    console.log('📊 Datos cargados:', data);

    // Ordenar cronológicamente (descendente)
    data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    tablaBody.innerHTML = ''; // limpiar tabla
    data.forEach(item => {
      const fecha = new Date(item.fecha).toLocaleDateString('es-ES');
      const disponible = item.estado === 'disponible';
      const fila = document.createElement('tr');
      fila.className = 'border-b border-gray-200 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors';
      fila.innerHTML = `
        <td class="px-6 py-4">${fecha}</td>
        <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${item.tipo}</td>
        <td class="px-6 py-4 text-center">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            disponible ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
          }">${item.estado}</span>
        </td>
        <td class="px-6 py-4 text-right">
          ${disponible 
            ? `<button data-id="${item.id}" class="verResultado text-blue-600 dark:text-blue-400 hover:underline font-medium">Ver</button>` 
            : `<span class="text-gray-400 dark:text-gray-500">Pendiente</span>`}
        </td>
      `;
      tablaBody.appendChild(fila);
    });

    // Eventos "Ver"
    document.querySelectorAll('.verResultado').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = parseInt(e.target.dataset.id, 10);
        const resultado = data.find(r => r.id === id);
        mostrarDetalle(resultado);
      });
    });

    // Función para mostrar detalles
    const mostrarDetalle = (r) => {
      document.getElementById('modalTitulo').textContent = r.tipo;
      document.getElementById('modalFecha').textContent = `Fecha: ${new Date(r.fecha).toLocaleDateString('es-ES')}`;
      const contenido = document.getElementById('modalContenido');
      contenido.innerHTML = '';

      if (r.resultados?.valores) {
        contenido.innerHTML = `
          <table class="w-full border-collapse text-sm">
            <thead><tr class="border-b"><th class="text-left py-1">Parámetro</th><th>Valor</th><th>Referencia</th></tr></thead>
            <tbody>
              ${r.resultados.valores.map(v => `
                <tr class="border-b">
                  <td class="py-1">${v.parametro}</td>
                  <td class="text-center">${v.valor} ${v.unidades}</td>
                  <td class="text-center">${v.referencia}</td>
                </tr>`).join('')}
            </tbody>
          </table>`;
      } else if (r.resultados?.informe_radiologico) {
        const inf = r.resultados.informe_radiologico;
        contenido.innerHTML = `
          <p><strong>Técnica:</strong> ${r.resultados.tecnica}</p>
          <ul class="mt-2 list-disc ml-6">
            <li><strong>Campos pulmonares:</strong> ${inf.campos_pulmonares}</li>
            <li><strong>Silueta cardíaca:</strong> ${inf.silueta_cardiaca}</li>
            <li><strong>Impresión diagnóstica:</strong> ${inf.impresion_diagnostica}</li>
          </ul>`;
      } else {
        contenido.textContent = 'No hay información detallada disponible.';
      }

      const descargar = document.getElementById('modalDescargar');
      if (r.url_pdf) {
        descargar.href = r.url_pdf;
        descargar.classList.remove('hidden');
      } else {
        descargar.classList.add('hidden');
      }

      modal.classList.remove('hidden');
    };

  } catch (err) {
    console.error('❌ Error cargando resultados:', err);
    tablaBody.innerHTML = `<tr><td colspan="4" class="text-center p-4 text-red-500">Error al cargar los resultados.</td></tr>`;
  }
}
