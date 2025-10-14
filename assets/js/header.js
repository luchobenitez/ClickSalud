/**
 * ==========================================================================
 * Click-Salud | header.js
 * --------------------------------------------------------------------------
 * Controla el comportamiento del encabezado:
 *  - Menú de usuario (abrir/cerrar)
 *  - Redirección al módulo de recordatorios
 *  - Cambio de tema (claro / oscuro)
 * ==========================================================================
 */

export function initHeader() {
  const userToggle = document.getElementById('user-menu-toggle');
  const userMenu = document.getElementById('user-menu');
  const notifBtn = document.getElementById('notifications-btn');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  // --- Menú de usuario ---
  document.addEventListener('click', (e) => {
    if (!userToggle || !userMenu) return;

    if (userToggle.contains(e.target)) {
      userMenu.classList.toggle('hidden');
    } else if (!userMenu.contains(e.target)) {
      userMenu.classList.add('hidden');
    }
  });

  // --- Botón de notificaciones ---
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      window.location.hash = '#recordatorios';
    });
  }

  // --- Cambio de tema ---
  if (themeToggle && themeIcon) {
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      themeIcon.textContent = isDark ? 'dark_mode' : 'light_mode';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Estado inicial del tema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      themeIcon.textContent = 'dark_mode';
    }
  }
}
