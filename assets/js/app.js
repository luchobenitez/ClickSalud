/**
 * ==========================================================================
 * Click-Salud | app.js
 * --------------------------------------------------------------------------
 * Control principal de la aplicación PWA:
 *  - Carga dinámica de componentes (header, footer, nav)
 *  - Router hash simple
 *  - Gestión del tema claro/oscuro
 *  - Registro del Service Worker (ajustado para GitHub Pages)
 *  - Inicialización de páginas específicas
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const mainHeader = document.getElementById('main-header');
    const mainFooter = document.getElementById('main-footer');
    const mainNav = document.getElementById('main-nav');

    /**
     * Carga un componente HTML desde /components y lo inyecta en un contenedor destino.
     * @param {string} component - Nombre del archivo, ej: 'header.html'
     * @param {HTMLElement} element - Elemento destino donde se inyectará el HTML.
     */
    const loadComponent = async (component, element) => {
        try {
            const response = await fetch(`components/${component}`);
            if (!response.ok) throw new Error(`No se pudo cargar ${component}`);
            element.innerHTML = await response.text();
        } catch (error) {
            console.error(`[Error] ${component}:`, error);
            element.innerHTML = `<p class="text-red-500 text-center">Error al cargar ${component}</p>`;
        }
    };

    /**
     * Carga una página desde /pages y la inyecta en el contenedor principal.
     * @param {string} page - Nombre base de la página (ej: 'dashboard')
     */
    const loadPage = async (page) => {
        try {
            const response = await fetch(`pages/${page}.html`);
            if (!response.ok) {
                appContent.innerHTML = `<p class="text-center text-gray-500">Página no encontrada.</p>`;
                return;
            }
            appContent.innerHTML = await response.text();
        } catch (error) {
            console.error('Error al cargar la página:', error);
            appContent.innerHTML = `<p class="text-center text-red-500">Error al cargar el contenido.</p>`;
        }
    };

    /**
     * Router basado en el hash (#ruta)
     * Ejemplo: #directorio → carga pages/directorio.html
     */
    const router = async () => {
        const hash = window.location.hash.substring(1) || 'dashboard';
        await loadPage(hash);

        switch (hash) {
            case 'directorio':
                initDirectorioPage();
                break;
            case 'soporte':
                // lógica futura
                break;
            case 'historia-clinica':
                // lógica futura
                break;
        }
    };

    /**
     * Inicializa la aplicación principal.
     */
    const initApp = async () => {
        console.log('🚀 Inicializando Click-Salud...');

        // 1️⃣ Cargar el header (necesario para el interruptor de tema)
        await loadComponent('header.html', mainHeader);

        // 2️⃣ Inicializar tema claro/oscuro
        initThemeToggle();

        // 3️⃣ Cargar footer y navegación móvil en paralelo
        await Promise.all([
            loadComponent('footer.html', mainFooter),
            loadComponent('nav-mobile.html', mainNav)
        ]);

        // 4️⃣ Activar router
        window.addEventListener('hashchange', router);
        router();

        // 5️⃣ Registrar Service Worker (rutas relativas para GitHub Pages)
        registerServiceWorker();
    };

    /**
     * Gestión del tema oscuro/claro con persistencia en localStorage.
     */
    const initThemeToggle = () => {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');

        if (!themeToggle || !themeIcon) {
            console.warn('⚠️ Botón de tema no encontrado');
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

        // Tema inicial
        applyTheme(userTheme || (systemPrefersDark ? 'dark' : 'light'));

        // Listener de botón
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            const newTheme = isDark ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            themeIcon.textContent = isDark ? 'dark_mode' : 'light_mode';
        });

        console.log('✅ Cambio de tema inicializado');
    };

    /**
     * Inicializa la página del Directorio Médico.
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

            // Cargar opciones
            especialidades.forEach(e => filtroEspecialidad.add(new Option(e, e)));
            ciudades.forEach(c => filtroCiudad.add(new Option(c, c)));

            const renderMedicos = (lista) => {
                listaDirectorio.innerHTML = lista.length
                    ? lista.map(medico => `
                        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center space-x-4">
                            <img src="${medico.foto}" alt="${medico.nombre}" class="h-16 w-16 rounded-full">
                            <div>
                                <h3 class="font-bold">${medico.nombre}</h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${medico.especialidad}</p>
                                <p class="text-sm text-gray-500 dark:text-gray-300">${medico.ciudad}</p>
                            </div>
                        </div>
                    `).join('')
                    : '<p class="text-gray-500 text-center">No se encontraron médicos con los filtros seleccionados.</p>';
            };

            const filtrarMedicos = () => {
                const especialidad = filtroEspecialidad.value;
                const ciudad = filtroCiudad.value;
                renderMedicos(
                    medicos.filter(m =>
                        (!especialidad || m.especialidad === especialidad) &&
                        (!ciudad || m.ciudad === ciudad)
                    )
                );
            };

            filtroEspecialidad.addEventListener('change', filtrarMedicos);
            filtroCiudad.addEventListener('change', filtrarMedicos);
            renderMedicos(medicos);
        } catch (error) {
            console.error('Error al cargar directorio médico:', error);
            listaDirectorio.innerHTML = '<p class="text-red-500">Error al cargar el directorio.</p>';
        }
    };

    /**
     * Registro del Service Worker para PWA.
     * NOTA: La ruta es relativa para funcionar tanto en localhost como en GitHub Pages.
     */
    const registerServiceWorker = () => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./service-worker.js')
                    .then(reg => console.log('✅ Service Worker registrado correctamente:', reg))
                    .catch(err => console.error('❌ Error al registrar el Service Worker:', err));
            });
        } else {
            console.warn('⚠️ El navegador no soporta Service Workers');
        }
    };

    // 🚀 Inicializar aplicación
    initApp();
});
