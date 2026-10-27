# Registro de cambios

[English](CHANGELOG.md) · **Español**

Todos los cambios relevantes de este proyecto se documentarán en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/), y este proyecto sigue [Versionado Semántico](https://semver.org/lang/es/).

## [Sin publicar]

## [1.3.3] - 2026-10-27

### Corregido

- Reemplazados los roles `group` de la navegación de Favoritas y Recientes por secciones nativas etiquetadas, conservando sus nombres accesibles y resolviendo la advertencia de HTML semántico de SonarQube.

## [1.3.2] - 2026-10-27

### Corregido

- Mejorado el contraste del atajo de teclado de búsqueda global y de los indicadores de estado, posición del cursor, ayuda de tabulación y estado de salida en los pies de editor para cumplir WCAG 2 AA.
- Asignados roles semánticos de grupo a los contenedores de navegación de Favoritas y Recientes para que sus etiquetas accesibles sean válidas.

## [1.3.1] - 2026-10-27

### Añadido

- Acción destacada **Abrir aplicación completa** en el popup de la extensión de navegador. Abre la PWA pública de PayloadForge y proporciona acceso a todas las herramientas desde la extensión de acciones rápidas.
- Artefactos distribuibles de extensiones generados: `extensions/payloadforge-browser.zip` para navegadores basados en Chromium y `extensions/payloadforge-vscode.vsix` para Visual Studio Code.
- Icono dedicado de **PayloadForge** y vista Toolkit en la barra de actividad de la extensión de VS Code, con acciones directas para abrir el toolkit y las preferencias.

### Modificado

- Actualizado el manifiesto de la extensión de VS Code con metadatos de descubrimiento para Marketplace y un README específico que documenta funcionalidades, comandos, privacidad e instrucciones de acceso.
- Actualizada la documentación de instalación en inglés y español para distinguir los accesos rápidos de la extensión de navegador de la aplicación web completa, documentar las ubicaciones de los paquetes y los flujos de instalación, y explicar cómo abrir PayloadForge desde la barra de actividad de VS Code.

## [1.3.0] - 2026-10-26

### Añadido

- Espacio de trabajo premium para herramientas de desarrollo con navegación compacta de productividad, Favoritas y Recientes persistentes, onboarding contextual y Command Palette ampliada.
- Utilidades enterprise de editor: números de línea y resaltado JSON sincronizados, búsqueda `Ctrl/Cmd + F`, navegación de coincidencias, Go to Line con `Ctrl/Cmd + G`, línea/columna del cursor en tiempo real y foco/selección automática ante diagnósticos con línea y columna.
- Acciones local-first para reutilizar un resultado como siguiente entrada sin persistirlo, y presets locales explícitos por herramienta.
- Flujos por herramienta para guardar, cargar, exportar/importar, eliminar y limpiar presets; la limpieza del conjunto activo requiere confirmación en dos pasos. Los presets se limitan a 20 por herramienta, 200 KB por preset y 1 MB por archivo importado; almacenan solo nombre, herramienta, entrada y hora local.
- Traducciones completas español/inglés para onboarding y gestión de presets.
- `docs/DESIGN-SYSTEM.md` y `CONTRIBUTING.md` con contratos de componentes, tokens, expectativas de accesibilidad, políticas de almacenamiento local y checks de contribución.
- Cobertura core/smoke para familias de transformadores y flujos E2E Playwright para favoritas, recientes, onboarding, i18n, navegación de editor, encadenamiento local, presets y recuperación de errores.
- Gates de calidad GitHub Actions con Lighthouse CI, axe-core WCAG 2 A/AA, flujos Playwright y artefactos de revisión visual desktop/móvil.
- Tooling de comparación visual con baselines e instrucciones de inicialización para capturas aprobadas.

### Modificado

- Rediseñado el shell web con superficies por capas, comportamiento responsive, feedback compacto de navegación, jerarquía de acciones premium y mejores estados de foco/error del editor.
- Unificado el empaquetado de Pages y el ensamblado para CI mediante `scripts/build-site.mjs`.
- Refactorizada la navegación cliente, estado de búsqueda, dispatch de Command Palette y comparación visual para mejorar mantenibilidad y cumplimiento de análisis estático.
- Actualizada la validación de calidad con build de sitio, smoke coverage, auditoría de accesibilidad browser, artefactos visuales y diffs contra baseline.

## [1.2.0] - 2026-10-26

### Añadido

- Validación JSON Schema local avanzada con `$ref`/`$defs`, combinadores, formatos, arrays únicos, dependencias, condicionales y reglas de propiedades adicionales.
- Fixtures JSON Schema ampliados con referencias locales, alternativas de schema y formatos UUID, URI, IPv4 y hostname.
- Detalles de endpoint OpenAPI con referencias locales resueltas, parámetros, request bodies, respuestas, filtros y copiado de snippets Fetch/cURL.
- Preferencias de tema del sistema, densidad, tamaño de fuente del editor y ajuste de línea.
- Historial local de actividad opcional y solo de metadatos, que nunca almacena payloads ni resultados generados.
- Experiencias premium de Preferencias en las tres superficies de distribución: modal web adaptable, popup de la extensión de navegador y webview de Preferencias de VS Code mediante `PayloadForge: Open Preferences`.
- Preferencias persistentes de extensiones para tema, densidad, tamaño de fuente, ajuste de líneas, resaltado de sintaxis e historial local opcional, respaldadas por `chrome.storage.local` en el navegador y `globalState` en VS Code.

### Modificado

- Refinados los controles de Preferencias con un campo de fuente del editor más grande y legible, y checkboxes de ajuste de líneas e historial local alineados a la izquierda.
- Rediseñado el diálogo de Preferencias con secciones de apariencia, editor y privacidad; controles adaptables; resumen de actividad más claro; y mejor jerarquía visual y de foco.
- Alineadas la interacción de Preferencias, accesibilidad, privacidad del historial local, feedback de confirmación y soporte de movimiento reducido entre la web y ambas extensiones.
- Mejorados los controles select nativos con superficies adaptadas al tema, cheurones personalizados, estados hover y focus-visible, y colores para las opciones seleccionadas en herramientas y selector de idioma.
- Corregidos los imports del core compartido y las rutas de precache del Service Worker en el artefacto de GitHub Pages para que la PWA resuelva los módulos correctamente bajo la ruta de despliegue `/payload-forge/`, sin cambiar las rutas del desarrollo local.
- Resultados enriquecidos del Validador JSON Schema con controles para copiar rutas.
- Rotada la caché offline de la PWA a `payloadforge-v36`.

## [1.1.0] - 2026-10-25

### Añadido

- Probador de Regex con flags configurables, grupos capturados, posiciones de coincidencia y límite seguro de 500 coincidencias.
- Redactor de secretos para ocultar localmente tokens Bearer, API keys, JWT, claves privadas y correos.
- Generador JSON → TypeScript con inferencia de objetos anidados, arrays, uniones y propiedades entrecomilladas.
- Conversor cURL → Fetch para métodos, cabeceras y cuerpos de petición habituales.
- Validador JSON Schema local para tipos, campos requeridos, enums, constantes, objetos, arrays y restricciones de números y texto.
- Generador de fixtures JSON Schema para producir hasta 100 fixtures locales.
- Explorador OpenAPI para listar operaciones de OpenAPI 3.x y Swagger 2.0 locales.
- Comandos funcionales de VS Code sobre selección para formatear/minificar JSON, codificar Base64, redactar secretos y generar TypeScript.
- Popup funcional de extensión de navegador con formato JSON, Base64, redacción de secretos, copiado y acción desde el menú contextual de selección.
- Inspector JWT que decodifica localmente headers y payloads JWT, reconoce prefijos `Bearer`, muestra las fechas estándar y reporta errores de tokens malformados.
- Tests unitarios de JWT para tokens válidos, fechas estándar, prefijos `Bearer` y entradas malformadas.
- Codificador / Decodificador para transformaciones locales de texto UTF-8 con Base64, Base64URL y URL encoding.
- Tests unitarios para conversiones UTF-8 Base64, Base64URL sin padding y valores codificados malformados.
- Generador / Validador UUID con generación en lote de 1 a 1000 UUID v4 y validación de listas pegadas.
- Tests unitarios UUID para reconocimiento v4, otras versiones de UUID, entradas inválidas y generación en lote.

### Modificado

- Añadidos estados vacíos contextuales en el editor de salida con guías para schemas, JWT, codificación, UUID, comparación y diff.
- La barra de acciones de escritorio ahora permanece visible durante el scroll; en móvil conserva un flujo natural y táctil.
- Actualizada la caché de la PWA a `payloadforge-v8` para distribuir la interfaz renovada.
- Adaptado el flujo UUID: Generar desactiva el editor innecesario y destaca la cantidad; Validar restaura el editor de listas y la guía de entrada.
- Actualizada la caché de la PWA a `payloadforge-v9` para distribuir la interacción adaptativa de UUID.
- Ampliado el selector rápido con acciones para ejecutar, cargar ejemplo, limpiar, copiar resultado y cambiar tema.
- Añadidas pestañas móviles de Entrada/Resultado que cambian automáticamente al resultado después de una ejecución exitosa.
- Actualizado el precache de la PWA y rotado a `payloadforge-v18`.
- Añadido `packages/core/` para compartir redacción de secretos e inferencia JSON → TypeScript seguras para navegador.
- Migrados los adaptadores PWA y los tests unitarios para consumir los transformadores compartidos.
- Actualizado el artefacto de GitHub Pages para publicar `packages/` junto a la PWA y rotada la caché offline a `payloadforge-v19`.
- Extraídos los helpers UTF-8 Base64/Base64URL y el parseo cURL → Fetch a `packages/core/`, con adaptadores PWA y tests unitarios consumiendo las implementaciones compartidas.
- Actualizado el precache de la PWA para los nuevos módulos core y rotada la caché offline a `payloadforge-v21`.
- Consolidada la lógica restante de transformadores PWA en `packages/core/`: formato JSON, JSONPath, generación/validación/fixtures JSON Schema, comparación JSON, YAML, XPath, JWT, UUID, Regex, OpenAPI y datos mock.
- Añadidos `packages/core/index.js` como punto de entrada ESM público y `packages/core/package.json` para conservar la semántica ESM en las copias sincronizadas de extensiones.
- Añadido `scripts/sync-core.mjs` junto con verificaciones CI que sincronizan e importan el núcleo compartido para las extensiones de navegador y VS Code.
- Actualizadas la extensión de navegador y los comandos de VS Code para usar sus copias sincronizadas del núcleo; VS Code carga ESM mediante `import()` dinámico.
- Añadida la sincronización de paquetes de extensiones al ciclo de empaquetado de VS Code y documentado el flujo de release.
- Rotada la caché offline de la PWA a `payloadforge-v35`.

## [1.0.0] - 2026-10-25

### Añadido

- Lanzamiento público inicial de PayloadForge.
- Toolkit offline y sin dependencias para payloads de API, construido con HTML5, CSS3 y JavaScript ES2023.
- Generador de JSON Schema compatible con valores primitivos inferidos, objetos anidados, arrays y valores anulables.
- Explorador JSONPath con hasta 1.000 rutas generadas, filtros y acciones de copiado.
- Formateador JSON con embellecimiento, minificación, validación e informes de error por línea y columna.
- Conversión bidireccional local entre JSON y YAML.
- Generador XML → XPath con rutas de elementos indexados, atributos, filtros, acciones de copiado y conservación de prefijos de namespace.
- JSON Compare para resúmenes profundos de valores agregados, eliminados y modificados.
- JSON Diff con visualización de cambios semánticos estilo Git.
- Generador de datos mock para producir entre 1 y 1.000 fixtures.
- Atajos de teclado, incluidos `Ctrl/Cmd + K`, `Ctrl + Enter` y sangría del editor con `Tab`.
- Editores mejorados con números de línea, resaltado semántico de JSON, scroll sincronizado, drag and drop, importación de archivos locales y borradores solo para la sesión.
- Temas oscuro/claro persistentes y navegación adaptable para escritorio y móvil.
- Soporte PWA mediante manifest web, iconos y un Service Worker para uso offline después de la primera carga por HTTP/HTTPS.
- Características de accesibilidad: landmarks semánticos, gestión del foco, estados de foco visibles, regiones en vivo, navegación por teclado y soporte para movimiento reducido.
- Tests unitarios y comando de CI mediante `npm run ci`.
