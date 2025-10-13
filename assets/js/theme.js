/* ==========================================================================
   Click-Salud - Control de Tema Oscuro / Claro
   Archivo: assets/js/theme.js
   Descripción: Maneja el cambio entre dark-mode y light-mode
   Autor: Luis C. Benítez A.
   ========================================================================== */

// --- Al cargar la página, aplicar el tema guardado o el del sistema ---
document.addEventListener('DOMContentLoaded', () => {
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Determinar el tema inicial
    const activeTheme = storedTheme ? storedTheme : (systemPrefersDark ? 'dark' : 'light');
    applyTheme(activeTheme);
});

// --- Escuchar clic en el botón de cambio de tema ---
document.addEventListener('click', (event) => {
    const toggleBtn = event.target.closest('#theme-toggle');
    if (!toggleBtn) return; // Ignorar si no es el botón

    const isDark = document.documentElement.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';

    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});

// --- Función para aplicar el tema y actualizar el ícono ---
function applyTheme(theme) {
    const root = document.documentElement;
    const icon = document.getElementById('theme-icon');

    if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        if (icon) icon.textContent = 'dark_mode';
    } else {
        root.classList.remove('dark');
        root.classList.add('light');
        if (icon) icon.textContent = 'light_mode';
    }
}

// --- Sincronizar cambios del sistema (opcional) ---
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const systemTheme = e.matches ? 'dark' : 'light';
    const userTheme = localStorage.getItem('theme');
    // Solo cambiar si el usuario no seleccionó manualmente un tema
    if (!userTheme) applyTheme(systemTheme);
});
