# 🛠️ PayloadForge

<p align="center">
  <img src="https://img.shields.io/badge/Versi%C3%B3n-1.3.4-blueviolet" alt="Versión 1.3.4" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript ES2023" />
  <img src="https://img.shields.io/badge/Arquitectura-Vanilla%20ESM-0b6e4f" alt="Arquitectura Vanilla ESM" />
  <img src="https://img.shields.io/badge/Offline--first-2ea44f" alt="Offline first" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PWA-Instalable-5c2d91" alt="PWA instalable" />
  <img src="https://img.shields.io/badge/Plataformas-Web%20%7C%20Extensi%C3%B3n%20de%20navegador%20%7C%20VS%20Code-0969da" alt="Plataformas compatibles" />
  <img src="https://img.shields.io/badge/Privacidad-Procesamiento%20local-success" alt="Procesamiento local" />
  <img src="https://img.shields.io/badge/Estado-Desarrollo%20activo-yellow" alt="Desarrollo activo" />
</p>

<p align="center"><strong>🌐 Idioma / Language</strong></p>

<p align="center">
  <a href="./README.md">🇬🇧 English</a> &nbsp;|&nbsp; <a href="./README.es.md">🇪🇸 Español</a>
</p>

<p align="center">
  <strong>Genera, transforma, compara y valida payloads de API localmente.</strong><br />
  Construido con <strong>HTML5, CSS3 y JavaScript ES2023 sin framework</strong>; disponible como <strong>PWA web</strong>, <strong>extensión de navegador</strong> y <strong>extensión de VS Code</strong>.
</p>

---

PayloadForge es un toolkit offline-first para trabajar con payloads de API. Ayuda a desarrolladores, QA Engineers y equipos de API a inspeccionar, transformar, validar, generar y comparar datos estructurados sin enviar payloads a un servidor ni depender de servicios externos en tiempo de ejecución.

---

## 🎯 Por qué importa este proyecto

Este proyecto demuestra cómo construir una **herramienta de productividad para desarrolladores distribuida en varias superficies** con capacidades nativas del navegador y módulos JavaScript reutilizables:

- Una aplicación web sin framework ni dependencias, construida con módulos ES.
- Un núcleo seguro para navegador y compartido entre la PWA, la extensión de navegador y la extensión de VS Code.
- Flujos locales para datos API con JSON, YAML, XML, JWT, OpenAPI, expresiones regulares, schemas y secretos.
- Soporte offline mediante Progressive Web App y Service Worker.
- Patrones de interacción accesibles: landmarks semánticos, navegación por teclado, diálogos, gestión de foco, regiones en vivo y soporte de movimiento reducido.
- Funcionamiento privacy-first: los payloads se procesan en el navegador y el historial opcional solo guarda metadatos.

El resultado es un ejemplo práctico de **ingeniería frontend offline-first para flujos de API y QA**.

---

## 🚀 Visión general del proyecto

Este repositorio distribuye PayloadForge en tres superficies:

- Una **aplicación web pública** y PWA instalable.
- Una **extensión de navegador Manifest V3** para formato JSON, codificación Base64, redacción de secretos y acciones sobre selecciones; su popup enlaza directamente a la aplicación web completa.
- Una **extensión de VS Code** con comandos de selección para formato/minificación JSON, Base64, redacción de secretos y JSON → TypeScript.

La solución combina utilidades locales de parseo y transformación, módulos core reutilizables, una interfaz SPA adaptable, editores sincronizados y validación mediante CI.

🔗 **Aplicación web publicada:** [carlosarman.github.io/payload-forge](https://carlosarman.github.io/payload-forge/)  
🔗 **Código fuente de la aplicación web:** [`web/`](./web/)  
🔗 **Extensión de navegador:** [`browser-extension/`](./browser-extension/)  
🔗 **Extensión de VS Code:** [`vscode-extension/`](./vscode-extension/)  
🔗 **Núcleo compartido:** [`packages/core/`](./packages/core/)  
🔗 **README en inglés:** [`README.md`](./README.md)  
🔗 **Registro de cambios:** [`CHANGELOG.es.md`](./CHANGELOG.es.md) · [Changelog en inglés](./CHANGELOG.md)

---

## 🎨 Identidad de marca

PayloadForge utiliza una única identidad visual refinada y orientada a developers en la PWA web, la extensión de navegador, la extensión de VS Code, Marketplace y el sitio generado para Pages.

- El icono conserva el concepto de **llave JSON + chevron de transformación hacia delante**: llave blanca, chevron naranja geométrica y contenedor cuadrado redondeado oscuro.
- El fondo de producto es `#081120`; el naranja de acento es `#FF7A45`, con `#FF9B71` reservado para detalles de luz contenidos. El blanco es `#FFFFFF`.
- El icono maestro es [`assets/brand/payloadforge-icon.svg`](./assets/brand/payloadforge-icon.svg). Sus copias de aplicación se sincronizan en `web/assets/icons/icon.svg`, `browser-extension/icons/payloadforge.svg` y `vscode-extension/media/payloadforge.svg`.
- Las variantes de marca están en [`assets/brand/`](./assets/brand/): primaria horizontal, oscura, clara, vertical, monocromática, solo icono y favicon.
- Las exportaciones por plataforma incluyen favicon de 16 px, PNG de navegador en 16/32/48/128 px, PNG de VS Code Marketplace de 128 px y PNG PWA/touch de 180/192/512 px. No edites manualmente los derivados: actualiza el arte maestro y regenera todas las exportaciones juntas.

---

## 🧩 Capacidades principales

### 📦 Herramientas JSON y de datos API

- **Generador de JSON Schema:** infiere valores primitivos, objetos anidados, arrays, valores anulables y estructuras JSON frecuentes.
- **Explorador JSONPath:** genera hasta 1.000 JSONPath, filtra rutas y permite copiar cada ruta.
- **Formateador JSON:** embellece, minifica y valida JSON con errores accionables de línea y columna.
- **JSON → TypeScript:** infiere interfaces y tipos TypeScript desde payloads JSON, incluidos objetos anidados, arrays, uniones y propiedades entrecomilladas.
- **Comparador JSON:** muestra altas, bajas y modificaciones profundas con resumen visual.
- **JSON Diff:** presenta cambios semánticos estilo Git para adiciones, eliminaciones y modificaciones.

### 🔄 Transformaciones locales

- **JSON ↔ YAML:** convierte payloads API habituales en ambas direcciones sin dependencia en tiempo de ejecución.
- **XML → XPath:** parsea XML y genera rutas indexadas de elementos y atributos, preservando prefijos de namespace.
- **Inspector JWT:** decodifica headers y payloads localmente, reconoce prefijos `Bearer` y presenta fechas estándar. No verifica firmas.
- **Codificador / Decodificador:** soporta Base64 UTF-8, Base64URL y codificación/decodificación URL.
- **Redactor de secretos:** oculta tokens Bearer, API keys, JWT, claves privadas y correos localmente.
- **cURL → Fetch:** convierte comandos cURL frecuentes en llamadas JavaScript Fetch.

### ✅ Validación y pruebas

- **Validador JSON Schema:** valida `$ref`/`$defs` locales, combinadores, formatos, dependencias, condicionales, arrays, restricciones escalares y reglas de propiedades adicionales.
- **Fixtures desde JSON Schema:** genera hasta 100 fixtures locales, incluidos schemas con referencias, alternativas y formatos seleccionados.
- **Explorador OpenAPI:** inspecciona documentos locales OpenAPI 3.x y Swagger 2.0, resuelve referencias locales y expone operaciones, parámetros, request bodies, respuestas y snippets Fetch/cURL.
- **Probador de Regex:** prueba patrones con flags configurables, grupos capturados, posiciones de coincidencia y límite seguro de 500 matches.
- **Generador / Validador UUID:** genera lotes de 1 a 1.000 UUID v4 o valida una lista pegada.
- **Generador de datos mock:** crea de 1 a 1.000 fixtures locales con UUID, identidad, email, teléfono, dirección y fecha.

### 🧠 Espacio de trabajo productivo y accesible

- Números de línea sincronizados y resaltado sintáctico local de JSON.
- Importación y drag & drop para archivos `.json`, `.yaml`, `.yml`, `.xml` y `.txt`, con límite de 1 MB.
- Borradores aislados por herramienta durante la sesión.
- Redimensionamiento de editores en escritorio y pestañas Entrada/Resultado en móvil.
- Navegación de productividad con Favoritas y Recientes persistentes, onboarding contextual y Paleta de comandos ampliada.
- Utilidades enterprise del editor: búsqueda con `Ctrl/Cmd + F`, navegación entre coincidencias, Go to Line con `Ctrl/Cmd + G`, línea/columna del cursor y selección automática de diagnósticos por línea/columna.
- Flujo local encadenado: reutiliza el resultado actual como siguiente entrada sin persistirlo.
- Presets locales explícitos por herramienta: guardar con `Ctrl/Cmd + S`, cargar, exportar/importar, eliminar y limpiar el conjunto activo con confirmación de dos pasos; nunca se almacenan resultados, con límite de 20 presets, 200 KB por preset y 1 MB por archivo de importación. Consulta el [formato portable de presets](./docs/PRESET-FORMAT.md).
- Paleta de comandos, ejemplos locales, copiado de resultados, descargas y enlaces para compartir.
- Modal premium de Preferencias con tema oscuro, claro o del sistema; densidad; tamaño de fuente; ajuste de líneas; números de línea; resaltado de sintaxis; autocompletado; switches accesibles; y navegación por teclado con focus trap.
- Historial local opcional con número de operaciones, uso de almacenamiento, última actualización y confirmación visual antes de limpiar; guarda únicamente identificador de herramienta, estado y hora.

---

## 💻 Instalación y desarrollo local

### Requisitos

- Node.js es opcional, pero se recomienda para servir localmente y ejecutar validaciones.
- Un navegador moderno con soporte para módulos ES: Chrome, Edge o Firefox.

> Puedes abrir `web/index.html` con `file://` para usar la aplicación básica. Sirve el directorio `web/` mediante HTTP/HTTPS para registrar el Service Worker y comprobar el comportamiento offline de la PWA.

### Ejecutar localmente

```bash
npx serve web
```

Después, abre la URL proporcionada por el servidor estático.

### Verificaciones de calidad

No se requieren dependencias npm de producción. Ejecuta las verificaciones y los tests unitarios con:

```bash
npm run ci
```

Este comando comprueba archivos clave, sincroniza y valida las copias core de las extensiones y ejecuta la suite `node:test`.

Para construir el mismo artefacto que consume GitHub Pages:

```bash
npm run build:site
```

En CI, GitHub Actions también ejecuta Lighthouse, axe-core para WCAG 2 A/AA, flujos E2E Playwright, capturas desktop/móvil y comparación opcional contra baselines visuales. Consulta [`CONTRIBUTING.md`](./CONTRIBUTING.md) y [`docs/DESIGN-SYSTEM.md`](./docs/DESIGN-SYSTEM.md) para el proceso de contribución, accesibilidad y aprobación de baselines.

### Publicación en GitHub Pages

La PWA publicada está disponible en [https://carlosarman.github.io/payload-forge/](https://carlosarman.github.io/payload-forge/).

El workflow [`deploy-pages.yml`](./.github/workflows/deploy-pages.yml) valida el proyecto y publica la aplicación web después de cada push a `main`. Copia `web/` y `packages/` al artefacto de Pages y después resuelve los imports del core compartido y las rutas de precache del Service Worker de forma relativa a ese artefacto; así, el despliegue bajo la ruta `/payload-forge/` funciona sin modificar las rutas usadas durante el desarrollo local. Configura **Pages → Build and deployment → Source** como **GitHub Actions** en los ajustes del repositorio. También puede ejecutarse manualmente desde la pestaña **Actions**.

---

## ⌨️ Atajos de teclado

| Atajo | Acción |
|---|---|
| `Ctrl/Cmd + K` | Abre la Command Palette de herramientas y acciones |
| `Ctrl/Cmd + Enter` | Ejecuta la herramienta activa |
| `Ctrl/Cmd + F` | Busca en Entrada o Resultado |
| `Ctrl/Cmd + G` | Salta a una línea del panel seleccionado |
| `Ctrl/Cmd + S` | Abre el diálogo para guardar un preset local |
| `Tab` | Inserta dos espacios en el editor de entrada |
| `←` / `→` sobre el divisor de escritorio | Redimensiona los editores |
| Deslizar desde el borde izquierdo en móvil | Abre el menú de navegación |
| Deslizar a la izquierda en móvil | Cierra el menú de navegación |

### Comparar documentos

**JSON Compare** y **JSON Diff** aceptan exactamente dos documentos JSON, separados por una línea que contenga `---`:

```json
{ "state": "draft" }

---

{ "state": "published", "reviewed": true }
```

---

## 🧩 Extensiones

### Extensión de navegador

La extensión Manifest V3 ofrece accesos rápidos para formato JSON local, codificación Base64, redacción de secretos, copiado, una acción en el menú contextual de selección y una vista dedicada de Preferencias en su popup.

Su botón principal **Abrir aplicación completa** abre la PWA pública de PayloadForge con todas las herramientas disponibles. El popup se mantiene como una superficie ligera para las transformaciones más habituales.

La vista de Preferencias del popup persiste tema, densidad, tamaño de fuente, ajuste de líneas, preferencia de resaltado sintáctico e historial de actividad opcional y solo de metadatos mediante `chrome.storage.local`. También muestra métricas del historial local y una confirmación explícita antes de limpiarlo.

1. Ejecuta `npm run sync:core`.
2. Abre el administrador de extensiones (`chrome://extensions` o `edge://extensions`).
3. Activa el **modo de desarrollador**.
4. Elige **Cargar descomprimida**.
5. Selecciona el directorio [`browser-extension/`](./browser-extension/).

El paquete generado para Chromium está disponible en `extensions/payloadforge-browser.zip`. Para recrearlo, sincroniza el núcleo compartido y comprime el **contenido** de `browser-extension/`:

```bash
node scripts/sync-core.mjs
powershell -NoProfile -Command "Compress-Archive -Path 'browser-extension\*' -DestinationPath 'extensions\payloadforge-browser.zip' -Force"
```

### Extensión de VS Code

La extensión de VS Code incluye comandos sobre selecciones para formatear/minificar JSON, codificar Base64, redactar secretos y generar JSON → TypeScript.

Abre el toolkit con **PayloadForge: Open Toolkit** desde la Paleta de comandos, o selecciona el icono de **PayloadForge** en la barra de actividad y usa la acción **Abrir PayloadForge Toolkit**. VS Code muestra la barra de actividad a la izquierda por defecto; puedes moverla a la derecha desde **Ver → Apariencia → Ubicación de barra de actividad → Derecha**.

Ejecuta **PayloadForge: Open Preferences** desde la Paleta de comandos o desde la vista de PayloadForge en la barra de actividad para abrir su webview nativo. Persiste tema, densidad, tamaño de fuente, ajuste de líneas, resaltado sintáctico e historial local solo de metadatos mediante `globalState` de VS Code; la tarjeta de historial muestra número de operaciones, espacio usado y última actualización. Consulta la [guía de uso de la extensión](./vscode-extension/README.md) para ver todos los comandos e instrucciones de uso.

```bash
cd vscode-extension
npm run package
```

El ciclo de empaquetado ejecuta automáticamente `npm run sync:core` antes de crear el paquete. El instalador generado para VS Code es `extensions/payloadforge-vscode.vsix`; instálalo desde VS Code con **Extensions: Install from VSIX...**. Los artefactos `.vsix`, `.zip` y `.xpi` generados pertenecen a `extensions/`, directorio excluido de Git.

---

## 🏗️ Arquitectura

```text
.
├── packages/
│   └── core/                  # Transformadores ESM puros compartidos y seguros para navegador
├── web/                       # PWA independiente
│   ├── assets/js/modules/     # Adaptadores de herramientas y contratos de UI
│   ├── tests/                 # Cobertura con node:test
│   ├── sw.js                  # Caché offline del shell de aplicación
│   └── index.html
├── browser-extension/         # Integración Manifest V3
├── vscode-extension/          # Integración VS Code
├── scripts/sync-core.mjs      # Sincroniza el core con las extensiones
└── extensions/                # Paquetes distribuibles generados localmente
```

### Núcleo compartido

[`packages/core/index.js`](./packages/core/index.js) es el punto de entrada ESM público de los transformadores reutilizables:

- Parseo/formato JSON, JSONPath, inferencia/validación/fixtures JSON Schema y comparación JSON.
- YAML, XPath, JWT, Base64/Base64URL, UUID, Regex, cURL → Fetch, OpenAPI y datos mock.
- Redacción de secretos y generación JSON → TypeScript.

Cada herramienta web sigue un contrato específico (`metadata`, `options`, `run`). El registro de la aplicación en [`web/assets/js/app.js`](./web/assets/js/app.js) compone estos módulos sin acoplarlos al layout ni a la navegación.

### Principios

- **Separación de responsabilidades:** routing, estado, renderizado, adaptadores y transformaciones puras están aislados.
- **Enfoque registry/factory:** las herramientas se añaden mediante el registro, sin reescribir la lógica global de UI.
- **Observer pattern:** `EventBus` y `Store` permiten cambios de estado desacoplados.
- **DRY:** las transformaciones compartidas viven en `packages/core/`.
- **KISS:** APIs nativas para parseo, clipboard, descargas, persistencia, UUID y capacidades PWA.
- **Privacidad por diseño:** ningún payload ni resultado generado se transmite ni persiste de forma predeterminada.

---

## ♿ Privacidad, offline y accesibilidad

PayloadForge no realiza solicitudes de red para procesar payloads ni usa assets remotos en tiempo de ejecución. Todos los parseos, transformaciones, comparaciones y datos mock se ejecutan localmente.

La PWA incluye un web manifest, iconos estándar y maskable, y un Service Worker. Después de la primera carga con HTTP/HTTPS, el shell y las herramientas pueden continuar disponibles sin conexión.

La interfaz proporciona HTML semántico, etiquetas y estados ARIA, anuncios `aria-live`, foco visible, enlace para saltar contenido, acceso por teclado, gestión de foco en diálogos, navegación adaptable y soporte para `prefers-reduced-motion`.

---

## 🧪 Calidad y CI

El proyecto utiliza tests unitarios nativos con `node:test` y verificaciones de sintaxis/importación. El workflow [`quality.yml`](./.github/workflows/quality.yml) ejecuta las mismas verificaciones para pushes a `main` y pull requests.

Las notas de las versiones se mantienen en [`CHANGELOG.es.md`](./CHANGELOG.es.md), siguiendo las convenciones Keep a Changelog y Versionado Semántico.

---

## 🔮 Extensiones futuras

El contrato de módulos permite añadir herramientas como un formateador SQL, explorador GraphQL, analizador HAR o constructor de solicitudes HTTP en [`web/assets/js/modules/`](./web/assets/js/modules/) y mediante el registro de la aplicación.
