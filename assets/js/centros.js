// assets/js/centros.js
export async function initCentros() {
  const listaCentrosEl = document.getElementById('lista-centros');
  const mapContainer = document.getElementById('map');
  if (!listaCentrosEl || !mapContainer) return;

  const searchInput = document.getElementById('search-centros');
  const abiertosToggle = document.getElementById('toggle-abiertos');
  let todosLosCentros = [];

  // Inicia mapa
  const map = L.map('map').setView([-25.3, -57.6], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);
  const markersLayer = L.layerGroup().addTo(map);

  const renderCentros = (centros) => {
    listaCentrosEl.innerHTML = '';
    markersLayer.clearLayers();
    if (centros.length === 0) {
      listaCentrosEl.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400">No se encontraron centros.</p>';
      return;
    }
    centros.forEach((centro) => {
      const estadoClass = centro.estado === 'abierto' ? 'text-green-500' : 'text-red-500';
      const estadoTexto = centro.estado === 'abierto' ? 'Abierto' : 'Cerrado';
      const card = document.createElement('div');
      card.className = 'bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer';
      card.innerHTML = `
        <div class="flex items-start space-x-4">
          <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(centro.nombre)}" class="w-16 h-16 rounded-lg object-cover">
          <div class="flex-1">
            <h3 class="font-bold text-lg">${centro.nombre}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">${centro.direccion}</p>
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-300 mt-2">
              <span class="material-symbols-outlined text-base">schedule</span>
              <span class="${estadoClass} ml-1">${estadoTexto}</span>
              <span class="ml-2">- ${centro.horario}</span>
            </div>
          </div>
        </div>`;
      listaCentrosEl.appendChild(card);

      if (centro.coordenadas) {
        const marker = L.marker([centro.coordenadas.lat, centro.coordenadas.lng])
          .bindPopup(`<b>${centro.nombre}</b><br>${centro.direccion}<br><span class="${estadoClass}">${estadoTexto}</span>`);
        markersLayer.addLayer(marker);
        card.addEventListener('click', () => {
          map.setView([centro.coordenadas.lat, centro.coordenadas.lng], 15, { animate: true });
          marker.openPopup();
        });
      }
    });
  };

  const filtrarYRenderizar = () => {
    const texto = searchInput.value.toLowerCase();
    const soloAbiertos = abiertosToggle.checked;
    const filtrados = todosLosCentros.filter(
      (c) =>
        (c.nombre.toLowerCase().includes(texto) ||
          c.direccion.toLowerCase().includes(texto)) &&
        (!soloAbiertos || c.estado === 'abierto')
    );
    renderCentros(filtrados);
  };

  // Detectar contexto de ejecución (local o GitHub Pages)
  const basePath = location.hostname.includes('github.io')
    ? '/ClickSalud/'
    : './';

  const response = await fetch(`${basePath}assets/data/centros.json`, { cache: 'no-store' });
  todosLosCentros = await response.json();
  renderCentros(todosLosCentros);
  searchInput.addEventListener('input', filtrarYRenderizar);
  abiertosToggle.addEventListener('change', filtrarYRenderizar);
}
