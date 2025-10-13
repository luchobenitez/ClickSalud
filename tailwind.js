/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./components/**/*.html",
    "./pages/**/*.html",
    "./assets/js/**/*.js"
  ],

  // Activar modo oscuro por clase (compatibilidad con Click-Salud)
  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        primary: '#11d4d4',
        secondary: '#317EFB',
        'background-light': '#f6f8f8',
        'background-dark': '#102222',
        'text-light': '#0f172a',
        'text-dark': '#f8fafc'
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0,0,0,0.08)',
        'medium': '0 4px 16px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
