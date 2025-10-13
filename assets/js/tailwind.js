module.exports = {
  darkMode: 'class',  // ← este valor es CRÍTICO
  content: [
    "./index.html",
    "./pages/**/*.{html,js}",
    "./components/**/*.{html,js}",
    "./assets/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#11d4d4",
        "background-light": "#f6f8f8",
        "background-dark": "#0f172a",
      },
    },
  },
  plugins: [],
};
