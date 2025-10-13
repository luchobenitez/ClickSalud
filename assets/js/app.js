/**
 * ==========================================================================
 * Click-Salud | app.js
 * --------------------------------------------------------------------------
 * Control principal de la aplicación PWA:
 *  - Carga dinámica de componentes (header, footer, nav)
 *  - Router hash simple
 *  - Gestión del tema claro/oscuro
 *  - Registro del Service Worker (rutas relativas para GitHub Pages)
 *  - Inicialización de páginas específicas
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const mainHeader = document.getElementById('main-header');
    const mainFooter = document.getElementById('main-footer');
    const mainNav = document.getElementById('main-nav');

    const loadComponent = async (component, element) => {
        try {
            if (!element) {
                console.warn(`[Aviso] Contenedor destino no encontrado para ${component}`);
                return;
            }
            const response = await fetch(`components/${component}`);
            if (!response.ok) throw new Error(`No se pudo cargar ${component}`);
            element.innerHTML = await response.text();
        } catch (error) {
            console.error(`[Error] ${component}:`, error);
            element.innerHTML = `<p class="text-red-500 text-center">Error al cargar ${component}</p>`;
        }
    };

    const loadPage = async (page) => {
        try {
            const response = await fetch(`pages/${page}.html`);
            if (!response.ok) {
                console.warn(`⚠️ Página "${page}" no encontrada. Redirigiendo al dashboard.`);
                window.location.hash = 'dashboard';
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
    */
    const router = async () => {
        const hash = window.location.hash.substring(1) || 'dashboard';
        await loadPage(hash);

         // Detectar contexto de ejecución (local o GitHub Pages)
        const basePath = location.hostname.includes('github.io')
            ? '/ClickSalud/'
            : './';
        switch (hash) {
            case 'directorio':
                initDirectorioPage();
            break;
        
            case 'citas':
                import(`${basePath}assets/js/medicos.js`)
                //import(medicos.js)
                    .then(module => module.initCitas())
                    .catch(err => console.error('Error al inicializar citas:', err));
            break;

            case 'centros':
                import(`${basePath}assets/js/centros.js`)
                    .then(module => {
                        if (typeof module.initCentros === 'function') {
                            module.initCentros();
                        } else {
                            console.warn('⚠️ initCentros() no encontrada en centros.js');
                        }
                    })
                    .catch(err => console.error('Error al inicializar Centros:', err));
                break;
       
            case 'soporte':
            // lógica futura
            break;
        
            case 'historia-clinica':
            // lógica futura
            break;
        }
    };

    const initApp = async () => {
        console.log('🚀 Inicializando Click-Salud...');
        await loadComponent('header.html', mainHeader);
        initThemeToggle();
        await Promise.all([
            loadComponent('footer.html', mainFooter),
            loadComponent('nav-mobile.html', mainNav)
        ]);
        window.addEventListener('hashchange', router);
        router();
        registerServiceWorker();
    };

    const initThemeToggle = () => {
        const toggle = document.getElementById('theme-toggle');
        const icon = document.getElementById('theme-icon');
        if (!toggle || !icon) return;

        const userTheme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const applyTheme = (theme) => {
            document.documentElement.classList.toggle('dark', theme === 'dark');
            icon.textContent = theme === 'dark' ? 'dark_mode' : 'light_mode';
        };

        applyTheme(userTheme || (systemDark ? 'dark' : 'light'));
        toggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            const theme = isDark ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            icon.textContent = isDark ? 'dark_mode' : 'light_mode';
        });
    };

    // Detectar contexto de ejecución (local o GitHub Pages)
    const basePath = location.hostname.includes('github.io')
        ? '/ClickSalud/'
        : './';
    let medicosCache = null;
    const initDirectorioPage = async () => {
        const lista = document.getElementById('directorio-lista');
        const espSel = document.getElementById('filtro-especialidad');
        const ciuSel = document.getElementById('filtro-ciudad');
        if (!lista) return;

        try {
            if (!medicosCache) {
                const res = await fetch(`${basePath}assets/js/medicos.js`);
                medicosCache = await res.json();
            }
            const medicos = medicosCache;
            const especialidades = [...new Set(medicos.map(m => m.especialidad))];
            const ciudades = [...new Set(medicos.map(m => m.ciudad))];
            especialidades.forEach(e => espSel.add(new Option(e, e)));
            ciudades.forEach(c => ciuSel.add(new Option(c, c)));

            const render = (listaM) => {
                lista.innerHTML = listaM.length
                    ? listaM.map(m => `
                        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center space-x-4">
                            <img src="${m.foto}" alt="${m.nombre}" class="h-16 w-16 rounded-full">
                            <div>
                                <h3 class="font-bold">${m.nombre}</h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${m.especialidad}</p>
                                <p class="text-sm text-gray-500 dark:text-gray-300">${m.ciudad}</p>
                            </div>
                        </div>
                    `).join('')
                    : '<p class="text-gray-500 text-center">No se encontraron médicos.</p>';
            };

            const filtrar = () => {
                const esp = espSel.value;
                const ciu = ciuSel.value;
                render(medicos.filter(m =>
                    (!esp || m.especialidad === esp) && (!ciu || m.ciudad === ciu)
                ));
            };

            espSel.addEventListener('change', filtrar);
            ciuSel.addEventListener('change', filtrar);
            render(medicos);
        } catch (error) {
            console.error('Error al cargar directorio médico:', error);
            lista.innerHTML = '<p class="text-red-500">Error al cargar el directorio.</p>';
        }
    };

    const registerServiceWorker = () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('./service-worker.js')
                .then(reg => console.log('✅ Service Worker registrado correctamente:', reg))
                .catch(err => console.error('❌ Error al registrar el Service Worker:', err));
        } else {
            console.warn('⚠️ El navegador no soporta Service Workers');
        }
    };

    initApp();
});
