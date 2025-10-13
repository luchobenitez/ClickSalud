<<<<<<< HEAD
# ClickSalud
MVP de una aplicación orientada a servicios de salud pública. 
=======
# Click-Salud - Prototipo MVP

Este repositorio contiene el código fuente del prototipo MVP para **Click-Salud**, una aplicación web progresiva (PWA) diseñada para unificar servicios de salud en Paraguay.

## 🎯 Objetivo

El objetivo de este prototipo es validar las funcionalidades clave de la aplicación, incluyendo agendamiento, directorio médico, geolocalización de centros de salud y recordatorios preventivos, con un enfoque en la usabilidad y la accesibilidad.

## 🚀 Cómo ejecutar el proyecto

Dado que este es un proyecto frontend puro (HTML, CSS, JavaScript) sin un `build step` complejo, puedes ejecutarlo fácilmente de las siguientes maneras:

**1. Usando un servidor local simple (Recomendado):**

La forma más sencilla es usar una extensión de VS Code como **Live Server**.

1.  Instala la extensión [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) en VS Code.
2.  Haz clic derecho sobre el archivo `index.html`.
3.  Selecciona "Open with Live Server".

Esto abrirá el proyecto en tu navegador y se recargará automáticamente cada vez que guardes un cambio.

**2. Usando Python:**

Si tienes Python instalado, puedes levantar un servidor HTTP simple.

```bash
# Si tienes Python 3.x
python -m http.server

# Si tienes Python 2.x
python -m SimpleHTTPServer
```

Luego, abre tu navegador y ve a `http://localhost:8000`.

## 🧩 Estructura del Proyecto

```
click-salud/
│
├── index.html              # Punto de entrada principal
├── pages/                  # Contenido HTML de cada sección
│   ├── dashboard.html
│   └── directorio.html
│
├── assets/                 # Recursos estáticos
│   ├── css/
│   │   └── styles.css      # Estilos personalizados
│   ├── js/
│   │   ├── app.js          # Lógica principal de la app
│   │   └── ...
│   ├── data/               # Backend simulado (JSON)
│   │   ├── medicos.json
│   │   ├── faqs.json
│   │   └── ...
│   └── img/                # Imágenes e iconos
│
├── components/             # Componentes HTML reutilizables
│   ├── header.html
│   └── footer.html
│
├── service-worker.js       # Lógica PWA para offline
└── manifest.json           # Metadatos de la PWA
```

## 🧱 Puntos Técnicos Clave

*   **Lenguajes:** HTML5, CSS (TailwindCSS), JavaScript (Vanilla).
*   **Backend:** Simulado con archivos JSON locales (`/assets/data/*.json`).
*   **Arquitectura:** Carga dinámica de componentes y páginas para simular una SPA.
*   **PWA:** Incluye `manifest.json` y un `service-worker.js` para funcionalidad offline básica.

## 📈 Próximos Pasos (Post-MVP)

- [x] Implementar el resto de las páginas (Citas, Centros, etc.).
- [ ] Integración con una API real.
- [ ] Sistema de autenticación de usuarios.
- [ ] Refinar la experiencia offline.
- [x] Implementar la página de soporte con preguntas frecuentes.
>>>>>>> 4b0f0dc (Versión inicial del prototipo Click-Salud)
