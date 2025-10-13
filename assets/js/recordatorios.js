// assets/js/recordatorios.js

// --- Variables y helpers globales ---
let recordatorios = [];

const basePath = location.hostname.includes('github.io') ? '/ClickSalud/' : './';

// Devuelve un ícono según el tipo de recordatorio
const getIconForType = (type) => {
    switch (type.toLowerCase()) {
        case 'cita': return 'calendar_month';
        case 'vacuna': return 'vaccines';
        case 'control': return 'checklist';
        default: return 'pill';
    }
};

// Renderiza la lista de recordatorios agrupados por tipo
const renderRecordatorios = (container) => {
    container.innerHTML = '';

    if (!recordatorios.length) {
        container.innerHTML = '<p class="text-center text-gray-500">No hay recordatorios disponibles.</p>';
        return;
    }

    const grouped = recordatorios.reduce((acc, rec) => {
        const key = rec.tipo;
        if (!acc[key]) acc[key] = [];
        acc[key].push(rec);
        return acc;
    }, {});

    for (const tipo in grouped) {
        const section = document.createElement('section');
        section.className = 'mb-8';

        const title = document.createElement('h3');
        title.className = 'text-xl font-bold mb-4 text-gray-800 dark:text-gray-200';
        title.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1) + 's';
        section.appendChild(title);

        grouped[tipo].forEach(rec => {
            const card = document.createElement('div');
            card.className = 'bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center';

            let actionsHtml = '';
            if (rec.tipo.toLowerCase() === 'cita') {
                actionsHtml = `
                    <div class="flex gap-2">
                        <button class="px-3 py-1 text-sm rounded-lg bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 hover:bg-red-200">No</button>
                        <button class="px-3 py-1 text-sm rounded-lg bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 hover:bg-green-200">Sí, confirmo</button>
                    </div>`;
            } else {
                actionsHtml = `<button class="px-3 py-1 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Editar</button>`;
            }

            card.innerHTML = `
                <div class="flex items-center gap-4">
                    <span class="material-symbols-outlined text-blue-500 text-3xl">${getIconForType(rec.tipo)}</span>
                    <div>
                        <p class="font-semibold text-gray-800 dark:text-gray-200">${rec.titulo}</p>
                        <p class="text-sm text-blue-600 dark:text-blue-400">${new Date(rec.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${rec.descripcion}</p>
                    </div>
                </div>
                ${actionsHtml}
            `;
            section.appendChild(card);
        });

        container.appendChild(section);
    }
};

// --- Export principal ---
export async function initRecordatorios() {
    const container = document.getElementById('recordatorios-container');
    const formSection = document.getElementById('form-section');
    const showFormBtn = document.getElementById('btn-show-form');
    const cancelFormBtn = document.getElementById('btn-cancel-form');
    const form = document.getElementById('form-nuevo-recordatorio');

    try {
        const response = await fetch(`${basePath}assets/data/recordatorios.json?nocache=${Date.now()}`);
        if (!response.ok) throw new Error('Error al cargar los recordatorios.');
        recordatorios = await response.json();
        renderRecordatorios(container);
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p class="text-center text-red-500">No se pudieron cargar los recordatorios.</p>';
    }

    // --- Eventos ---
    showFormBtn.addEventListener('click', () => {
        formSection.classList.remove('hidden');
        showFormBtn.classList.add('hidden');
    });

    cancelFormBtn.addEventListener('click', () => {
        formSection.classList.add('hidden');
        showFormBtn.classList.remove('hidden');
        form.reset();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nuevoRecordatorio = {
            id: Date.now(),
            tipo: 'Personalizado',
            titulo: form.titulo.value.trim(),
            descripcion: 'Recordatorio personal',
            fecha: new Date().toISOString().split('T')[0],
            estado: 'pendiente'
        };
        recordatorios.push(nuevoRecordatorio);
        renderRecordatorios(container);
        cancelFormBtn.click();
        alert('Recordatorio agregado con éxito.');
    });
}
