# PayloadForge para Visual Studio Code

Herramientas locales y sin conexión para transformar, inspeccionar y preparar payloads de API directamente desde el editor de Visual Studio Code.

PayloadForge procesa el contenido seleccionado en el archivo activo. No envía tu texto a servicios externos.

## Cómo abrir el aplicativo

1. Abre Visual Studio Code.
2. Presiona `Ctrl+Shift+P` para abrir la **Paleta de comandos**.
3. Escribe y ejecuta **`PayloadForge: Open Toolkit`**.
4. Se abrirá el panel de bienvenida de PayloadForge junto al editor.

Como alternativa, selecciona el icono de **PayloadForge** en la barra de actividad. En la vista **Toolkit**, haz clic en **Abrir PayloadForge Toolkit**.

La barra de actividad se muestra normalmente a la izquierda. Para ubicarla a la derecha, selecciona **Ver → Apariencia → Ubicación de barra de actividad → Derecha**.

El panel explica el acceso a las herramientas. Las transformaciones se ejecutan desde la Paleta de comandos o desde el menú contextual del editor sobre texto seleccionado.

## Uso rápido

1. Abre un archivo con un payload, por ejemplo JSON.
2. Selecciona el texto que deseas procesar.
3. Presiona `Ctrl+Shift+P`.
4. Busca un comando que empiece por `PayloadForge:`.
5. Ejecuta la operación. El resultado reemplaza la selección actual.

También puedes hacer clic derecho sobre una selección para acceder directamente a las acciones de JSON y redacción de secretos disponibles en el menú contextual.

> **Importante:** para las operaciones de selección, primero debes tener un editor abierto y texto seleccionado.

## Comandos

| Comando | Descripción |
| --- | --- |
| `PayloadForge: Open Toolkit` | Abre el panel de inicio de PayloadForge en una columna junto al editor. |
| `PayloadForge: Open Preferences` | Abre las preferencias de apariencia, editor e historial local. |
| `PayloadForge: Format JSON Selection` | Formatea e indenta la selección JSON. |
| `PayloadForge: Minify JSON Selection` | Elimina espacios y saltos de línea innecesarios de la selección JSON. |
| `PayloadForge: Encode Selection as Base64` | Convierte la selección de texto a Base64. |
| `PayloadForge: Redact Secrets in Selection` | Oculta valores sensibles detectados, como tokens, claves y contraseñas. |
| `PayloadForge: Generate TypeScript from JSON Selection` | Genera definiciones TypeScript a partir de la estructura JSON seleccionada. |

## Funcionalidades

- **Operación offline:** las transformaciones se realizan localmente en VS Code.
- **Formateo JSON:** mejora la legibilidad de payloads JSON válidos.
- **Minificación JSON:** prepara JSON compacto para transporte o pruebas.
- **Codificación Base64:** transforma texto seleccionado a Base64.
- **Redacción de secretos:** reduce el riesgo de compartir accidentalmente información sensible.
- **Generación de tipos TypeScript:** acelera la creación de interfaces y tipos desde respuestas JSON.
- **Integración con el editor:** reemplaza el texto seleccionado con el resultado de la herramienta.
- **Acceso desde la barra de actividad:** abre el Toolkit o las preferencias desde el icono de PayloadForge.
- **Menú contextual:** ejecuta rápidamente acciones JSON y de redacción mediante clic derecho.
- **Preferencias locales:** configura tema, densidad, tamaño de fuente, ajuste de línea, resaltado e historial.
- **Privacidad:** si activas el historial local, solo se guardan el nombre de la acción y la fecha; nunca la entrada ni el resultado.

## Preferencias

Ejecuta **`PayloadForge: Open Preferences`** desde la Paleta de comandos para configurar:

- Tema: oscuro, claro o del sistema.
- Densidad visual: cómoda o compacta.
- Tamaño de fuente.
- Ajuste de líneas.
- Resaltado de sintaxis.
- Historial local de acciones y limpieza del historial.

## Ejemplo

Selecciona este JSON:

```json
{"id":1,"name":"Ada","active":true}
```

Ejecuta **`PayloadForge: Generate TypeScript from JSON Selection`** para reemplazar la selección por tipos TypeScript equivalentes.

## Requisitos

- Visual Studio Code `1.85.0` o una versión posterior.
- Un editor activo y una selección de texto para los comandos de transformación.

## Desarrollo y empaquetado

Desde la raíz del repositorio:

```bash
cd vscode-extension
npm install
npm run check
npm run package
```

El paquete VSIX se genera en `extensions/payloadforge-vscode.vsix`.
