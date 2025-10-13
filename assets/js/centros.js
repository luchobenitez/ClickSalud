// assets/js/centros.js
document.addEventListener('DOMContentLoaded', async () => {
  // Verifica si el contenedor actual pertenece a la vista de centros
  const listaCentrosEl = document.getElementById('lista-centros');
  const mapContainer = document.getElementById('map');
  if (!listaCentrosEl || !mapContainer) return; // Evita errores si se carga en otra vista

  const searchInput = document.getElementById('search-centros');
  const abiertosToggle = document.getElementById('toggle-abiertos');

  let todosLosCentros = [];
  let map, markersLayer;

  // === Inicializar mapa ===
  map = L.map('map').setView([-25.3, -57.6], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);

  /**
   * Renderiza la lista y los marcadores en el mapa
   */
  const renderCentros = (centros) => {
    listaCentrosEl.innerHTML = '';
    markersLayer.clearLayers();

    if (centros.length === 0) {
      listaCentrosEl.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400">No se encontraron centros.</p>';
      return;
    }

    centros.forEach((centro) => {
      const estadoAbierto = centro.estado === 'abierto';
      const estadoClass = estadoAbierto ? 'text-green-500' : 'text-red-500';
      const estadoTexto = estadoAbierto ? 'Abierto' : 'Cerrado';

      // Tarjeta lateral
      const card = document.createElement('div');
      card.className = 'bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer';
      card.innerHTML = `
        <div class="flex items-start space-x-4">
          <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(centro.nombre)}&background=random"
               alt="Logo ${centro.nombre}" class="w-16 h-16 rounded-lg object-cover">
          <div class="flex-1">
            <h3 class="font-bold text-lg">${centro.nombre}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${centro.direccion}</p>
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-300 mt-2 space-x-2">
              <span class="material-symbols-outlined text-base">schedule</span>
              <span class="${estadoClass} font-semibold">${estadoTexto}</span>
              <span>- ${centro.horario}</span>
            </div>
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <a href="https://maps.google.com/?q=${encodeURIComponent(centro.direccion)}" target="_blank"
             class="flex-1 text-center bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition-colors">
             Cómo llegar
          </a>
          <a href="tel:${centro.contacto}"
             class="flex-1 text-center bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-lg py-2 font-semibold hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors">
             Llamar
          </a>
        </div>
      `;
      listaCentrosEl.appendChild(card);

      // Marcador en el mapa
      if (centro.coordenadas) {
        const marker = L.marker([centro.coordenadas.lat, centro.coordenadas.lng])
          .bindPopup(`<b>${centro.nombre}</b><br>${centro.direccion}<br><span class="${estadoClass}">${estadoTexto}</span>`);
        markersLayer.addLayer(marker);

        // Centrar mapa al hacer clic en la tarjeta
        card.addEventListener('click', () => {
          map.setView([centro.coordenadas.lat, centro.coordenadas.lng], 15, { animate: true });
          marker.openPopup();
        });
      }
    });
  };

  /**
   * Filtra los centros por texto y estado
   */
  const filtrarYRenderizar = () => {
    const texto = searchInput.value.toLowerCase();
    const soloAbiertos = abiertosToggle.checked;

    const filtrados = todosLosCentros.filter((c) => {
      const matchTexto = c.nombre.toLowerCase().includes(texto) || c.direccion.toLowerCase().includes(texto);
      const matchEstado = !soloAbiertos || c.estado === 'abierto';
      return matchTexto && matchEstado;
    });

    renderCentros(filtrados);
  };

    // Detectar contexto de ejecución (local o GitHub Pages)
    const basePath = location.hostname.includes('github.io')
      ? '/ClickSalud/'
      : './';

    
  /**
   * Cargar datos desde centros.json
   */
  try {
    const response = await fetch(`${basePath}assets/data/centros.json`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Error al cargar centros.json');
    todosLosCentros = await response.json();
    renderCentros(todosLosCentros);
  } catch (err) {
    console.error(err);
    listaCentrosEl.innerHTML = '<p class="text-center text-red-500">Error al cargar los centros.</p>';
  }

  // Eventos
  searchInput.addEventListener('input', filtrarYRenderizar);
  abiertosToggle.addEventListener('change', filtrarYRenderizar);
});
