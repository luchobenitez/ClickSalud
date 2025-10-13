/**
 * Click-Salud | app.js
 * ---------------------
 * Control principal de la aplicación PWA:
 *  - Carga dinámica de componentes (header, footer, nav)
 *  - Router hash simple
 *  - Gestión del tema claro/oscuro
 *  - Registro del Service Worker
 *  - Inicialización de páginas específicas
 */

document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const mainHeader = document.getElementById('main-header');
    const mainFooter = document.getElementById('main-footer');
    const mainNav = document.getElementById('main-nav');

    /**
     * Carga un componente HTML desde la carpeta /components y lo inyecta en un elemento.
     * @param {string} component - Nombre del archivo (ej: 'header.html')
     * @param {HTMLElement} element - Elemento destino donde se inyectará el HTML.
     */
    const loadComponent = async (component, element) => {
        try {
            const response = await fetch(`components/${component}`);
            if (!response.ok) throw new Error(`No se pudo cargar ${component}`);
            const html = await response.text();
            element.innerHTML = html;
        } catch (error) {
            console.error(error);
            element.innerHTML = `<p class="text-red-500 text-center">Error al cargar ${component}</p>`;
        }
    };

    /**
     * Carga una página desde /pages/ y la inyecta en el contenedor principal.
     * @param {string} page - Nombre de la página (ej: 'dashboard')
     */
    const loadPage = async (page) => {
        try {
            const response = await fetch(`pages/${page}.html`);
            if (!response.ok) {
                appContent.innerHTML = `<p class="text-center">Página no encontrada.</p>`;
                return;
            }
            const html = await response.text();
            appContent.innerHTML = html;
        } catch (error) {
            console.error('Error al cargar la página:', error);
            appContent.innerHTML = `<p class="text-center">Error al cargar el contenido.</p>`;
        }
    };

    /**
     * Router basado en el hash de la URL.
     * Ejemplo: #directorio → carga pages/directorio.html
     */
    const router = async () => {
        const hash = window.location.hash.substring(1) || 'dashboard';
        await loadPage(hash);

        // Lógica específica por página
        switch (hash) {
            case 'directorio':
                initDirectorioPage();
                break;
            case 'soporte':
                // lógica adicional opcional
                break;
            case 'historia-clinica':
                // lógica adicional opcional
                break;
        }
    };

    /**
     * Inicializa la aplicación: carga componentes, router, tema y SW.
     */
    const initApp = async () => {
        console.log("🚀 Inicializando Click-Salud...");

        // 1️⃣ Cargar el header primero (necesario para themeToggle)
        await loadComponent('header.html', mainHeader);

        // 2️⃣ Inicializar el interruptor de tema (requiere header cargado)
        initThemeToggle();

        // 3️⃣ Cargar los demás componentes en paralelo
        await Promise.all([
            loadComponent('footer.html', mainFooter),
            loadComponent('nav-mobile.html', mainNav)
        ]);

        // 4️⃣ Configurar el router y escuchar cambios de hash
        window.addEventListener('hashchange', router);
        router();

        // 5️⃣ Registrar el Service Worker
        registerServiceWorker();
    };

    /**
     * Inicializa el cambio de tema oscuro/claro.
     * Controla el almacenamiento en localStorage y el ícono del tema.
     */
    const initThemeToggle = () => {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');

        if (!themeToggle || !themeIcon) {
            console.warn('⚠️ Botón de tema no encontrado en el DOM');
            return;
        }

        const userTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const applyTheme = (theme) => {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
                themeIcon.textContent = 'dark_mode';
            } else {
                document.documentElement.classList.remove('dark');
                themeIcon.textContent = 'light_mode';
            }
        };

        // Estado inicial
        if (userTheme) {
            applyTheme(userTheme);
        } else {
            applyTheme(systemPrefersDark ? 'dark' : 'light');
        }

        // Listener del botón
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            const newTheme = isDark ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            themeIcon.textContent = isDark ? 'dark_mode' : 'light_mode';
        });

        console.log('✅ Theme toggle inicializado');
    };

    /**
     * Lógica específica para la página del Directorio Médico.
     */
    const initDirectorioPage = async () => {
        const listaDirectorio = document.getElementById('directorio-lista');
        const filtroEspecialidad = document.getElementById('filtro-especialidad');
        const filtroCiudad = document.getElementById('filtro-ciudad');

        if (!listaDirectorio) return;

        try {
            const response = await fetch('assets/data/medicos.json');
            const medicos = await response.json();

            const especialidades = [...new Set(medicos.map(m => m.especialidad))];
            const ciudades = [...new Set(medicos.map(m => m.ciudad))];

            // Poblar selectores
            especialidades.forEach(e => {
                const option = document.createElement('option');
                option.value = e;
                option.textContent = e;
                filtroEspecialidad.appendChild(option);
            });
            ciudades.forEach(c => {
                const option = document.createElement('option');
                option.value = c;
                option.textContent = c;
                filtroCiudad.appendChild(option);
            });

            // Renderizado
            const renderMedicos = (lista) => {
                listaDirectorio.innerHTML = '';
                if (lista.length === 0) {
                    listaDirectorio.innerHTML = '<p>No se encontraron médicos con los filtros seleccionados.</p>';
                    return;
                }
                lista.forEach(medico => {
                    const card = `
                        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center space-x-4">
                            <img src="${medico.foto}" alt="${medico.nombre}" class="h-16 w-16 rounded-full">
                            <div>
                                <h3 class="font-bold">${medico.nombre}</h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${medico.especialidad}</p>
                                <p class="text-sm text-gray-500 dark:text-gray-300">${medico.ciudad}</p>
                            </div>
                        </div>
                    `;
                    listaDirectorio.innerHTML += card;
                });
            };

            // Filtros dinámicos
            const filtrarMedicos = () => {
                const especialidad = filtroEspecialidad.value;
                const ciudad = filtroCiudad.value;

                const filtrados = medicos.filter(m =>
                    (especialidad === '' || m.especialidad === especialidad) &&
                    (ciudad === '' || m.ciudad === ciudad)
                );
                renderMedicos(filtrados);
            };

            filtroEspecialidad.addEventListener('change', filtrarMedicos);
            filtroCiudad.addEventListener('change', filtrarMedicos);

            renderMedicos(medicos);
        } catch (error) {
            console.error('Error al cargar directorio médico:', error);
            listaDirectorio.innerHTML = '<p class="text-red-500">No se pudo cargar el directorio.</p>';
        }
    };

    /**
     * Registro del Service Worker para la PWA.
     */
    const registerServiceWorker = () => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js', { type: 'module' })
                    .then(registration => {
                        console.log('Service Worker registrado con éxito:', registration);
                    })
                    .catch(error => {
                        console.error('❌ Error al registrar el Service Worker:', error);
                    });
            });
        }
    };

    // 🚀 Iniciar la aplicación
    initApp();
});
