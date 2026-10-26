# Registro de cambios

[English](CHANGELOG.md) · **Español**

Todos los cambios relevantes de este proyecto se documentarán en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/), y este proyecto sigue [Versionado Semántico](https://semver.org/lang/es/).

## [Sin publicar]

### Añadido

- Validación JSON Schema local avanzada con `$ref`/`$defs`, combinadores, formatos, arrays únicos, dependencias, condicionales y reglas de propiedades adicionales.
- Fixtures JSON Schema ampliados con referencias locales, alternativas de schema y formatos UUID, URI, IPv4 y hostname.
- Detalles de endpoint OpenAPI con referencias locales resueltas, parámetros, request bodies, respuestas, filtros y copiado de snippets Fetch/cURL.
- Preferencias de tema del sistema, densidad, tamaño de fuente del editor y ajuste de línea.
- Historial local de actividad opcional y solo de metadatos, que nunca almacena payloads ni resultados generados.

### Modificado

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
