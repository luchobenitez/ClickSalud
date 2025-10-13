// medicos.js

export async function obtenerMedicos() {
    const response = await fetch('/assets/data/medicos.json');
    const data = await response.json();
    return data;
}

export function filtrarMedicos(medicos, filtros = {}) {
    return medicos.filter(m => {
        return (
            (!filtros.especialidad || m.especialidad === filtros.especialidad) &&
            (!filtros.centro || m.centro === filtros.centro) &&
            (!filtros.ciudad || m.ciudad === filtros.ciudad)
        );
    });
}

export function renderMedicos(lista, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    contenedor.innerHTML = '';

    if (lista.length === 0) {
        contenedor.innerHTML = `<p class="text-gray-600 dark:text-gray-400">No se encontraron resultados.</p>`;
        return;
    }

    lista.forEach(m => {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700';
        card.innerHTML = `
            <h4 class="text-lg font-bold text-background-dark dark:text-background-light">${m.nombre}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">${m.especialidad}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">${m.centro} — ${m.ciudad}</p>
            <p class="text-sm mt-2 text-primary font-semibold">${m.telefono}</p>
            <p class="text-sm text-gray-500">${m.email}</p>
        `;
        contenedor.appendChild(card);
    });
}