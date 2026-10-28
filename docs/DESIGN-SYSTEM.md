# PayloadForge Design System

Guía de referencia para mantener una experiencia consistente de herramienta SaaS orientada a developers, QA y DevOps.

## Principios

1. **El editor es el producto.** La interfaz debe preservar el área útil para entrada y resultado.
2. **Densidad intencional.** La información técnica se compacta sin reducir legibilidad ni objetivos táctiles.
3. **Acción principal inequívoca.** Cada herramienta mantiene una sola CTA primaria contextual.
4. **Local-first y confianza.** La interfaz comunica procesamiento local y evita sugerir que payloads salen del navegador.
5. **Accesibilidad por defecto.** Focus visible, contraste AA, teclado y estados semánticos son requisitos de cada componente.

## Identidad de marca e iconografía

La marca PayloadForge forma parte del sistema de producto y no es un recurso decorativo independiente.

- **Concepto invariable:** llave JSON blanca + chevron geométrica naranja de transformación hacia delante dentro de un cuadrado redondeado oscuro.
- **Arte maestro:** `assets/brand/payloadforge-icon.svg`. Las variantes aprobadas están en `assets/brand/` y conservan la misma geometría base.
- **Color:** fondo `#081120`, blanco `#FFFFFF`, naranja primario `#FF7A45` y naranja secundario `#FF9B71`. El naranja es un acento; glow, sombras y degradados deben ser mínimos.
- **Wordmark:** `Payload` en blanco y `Forge` en naranja, con una sans geométrica de alta legibilidad equivalente a Inter, Geist o SF Pro Display.
- **Tamaños críticos:** favicon 16 px; Browser Extension 16/32/48/128 px; Marketplace y desktop 128 px; PWA 192/512 px; touch icon 180 px. Para 16 px se utiliza la variante favicon sin detalle ni efecto fino.
- **Distribución:** los SVG de web, Browser Extension y VS Code deben ser idénticos al icono maestro. Los PNG son derivados y se regeneran al actualizar la marca. Ejecuta `node scripts/build-site.mjs` después para sincronizar `_site/`.
- **No rediseñar por superficie:** ninguna aplicación crea una interpretación alternativa de la llave, chevron, radio, colores o wordmark.

## Tokens

Fuente: `web/assets/css/variables.css`.

| Categoría | Tokens principales | Uso |
| --- | --- | --- |
| Fondo | `--bg`, `--surface`, `--surface-raised`, `--surface-overlay` | Jerarquía del shell, paneles y overlays |
| Bordes | `--border-subtle`, `--border`, `--border-strong` | Separación y estados de control |
| Acción | `--primary`, `--primary-hover`, `--primary-soft` | CTA, estado activo y acentos PayloadForge |
| Semántica | `--success`, `--warning`, `--danger`, `--info` + variantes `-soft` | Resultados, alertas y validación |
| Tipografía | `--font-ui`, `--font-mono`, `--text-xs` a `--text-2xl` | UI general y contenido técnico |
| Espaciado | `--space-1` a `--space-8` | Escala base de 4 px |
| Forma | `--radius-control`, `--radius`, `--radius-panel` | Controles, cards y dialogs |
| Movimiento | `--transition`, `--transition-fast` | 120–180 ms; respetar reduced motion |

No se deben introducir colores hexadecimales en componentes si existe un token semántico adecuado.

## Componentes

### App shell

- **Header:** marca, búsqueda/Command Palette, idioma, preferencias y tema.
- **Sidebar:** categorías escalables, grupos colapsables y acceso rápido persistente.
- **Workspace:** título de herramienta, estado, opciones, editor, resultados y action bar.

Contrato:
- El contenido principal se identifica con `main#workspace`.
- El sidebar puede pasar a off-canvas en `< 768px`.
- Acciones secundarias no deben competir visualmente con la CTA primaria.

### Navegación

- `.nav-item`: enlace de herramienta.
- `aria-current` identifica herramienta activa.
- Grupos `.nav-group` usan botón con `aria-expanded`.
- Favoritas y recientes se persisten sin payloads en `localStorage`.

Estados:
- Default: texto muted.
- Hover: `--surface-hover`.
- Active: `--primary-soft`, acento y estado semántico.
- Focus: outline definido globalmente con `--focus`.

### Botones

| Variante | Clase | Uso |
| --- | --- | --- |
| Principal | `.button.button-primary` | Ejecutar la operación de la herramienta |
| Secundaria | `.button.button-secondary` | Copiar o descargar resultado |
| Ghost | `.button.button-ghost` | Ejemplo, limpiar, compartir |
| Icono | `.icon-button` | Tema, preferencias, menú móvil |
| Editor | `.editor-action` | Importar y utilidades del editor |

Reglas:
- Mantener una sola acción `.button-primary` por barra.
- Usar icono + etiqueta cuando el espacio lo permita.
- Objetivo táctil mínimo: `--control-height-touch` en móvil.
- Un botón disabled debe seguir explicando su contexto mediante proximidad o etiqueta.

### Editor card

Estructura:
1. `.editor-header`: etiqueta, acciones y metadatos.
2. `.code-editor-shell`: línea, capa de sintaxis y textarea.
3. `.editor-footer`: estado y ayuda contextual.

Estados:
- Normal: borde estándar.
- Focus: borde de foco/primary.
- Error: `.has-error` + `aria-invalid="true"` sobre textarea.
- Busy: `aria-busy="true"`.
- Empty: `.editor-empty-state` en salida.

Reglas:
- El textarea sigue siendo la fuente de verdad.
- La capa de sintaxis no recibe interacción ni foco.
- Nunca guardar payloads por defecto.
- Mantener Tab para indentación y Ctrl/Cmd+Enter para ejecutar.
- `Ctrl/Cmd+F` abre búsqueda de entrada/salida; Enter y Shift+Enter navegan coincidencias.
- `Ctrl/Cmd+G` abre el salto directo a línea del panel seleccionado.
- `Ctrl/Cmd+S` abre el diálogo explícito para guardar un preset local; nunca persiste la entrada sin confirmación del usuario.
- El footer de entrada muestra línea y columna del cursor en tiempo real para facilitar revisión y diagnóstico.
- La acción secundaria “Usar como entrada” transfiere solo el resultado actual al editor de entrada; no debe persistir ni enviar el payload.
- Los presets son opt-in: guardan únicamente nombre, herramienta y entrada en este navegador; nunca resultados. Limitar a 20 por herramienta y 200 KB por preset.
- La carga y eliminación de presets sucede en un diálogo por herramienta; eliminar requiere confirmación explícita de dos pasos.
- La limpieza total también requiere confirmación de dos pasos y elimina únicamente los presets de la herramienta activa, preservando los de las demás herramientas.
- La exportación/importación de presets usa JSON local versionado (`version: 1`), limita el archivo a la herramienta activa, valida nombre/entrada/tamaño, deduplica por nombre y nunca transmite contenido por red.
- Errores de sintaxis con línea/columna deben enfocar, seleccionar y desplazar el editor a la ubicación indicada.

### Workflow guide

`.workflow-guide` es onboarding contextual:
- Expone el ciclo input → run → reuse y shortcuts.
- No usa overlay ni bloquea el trabajo.
- El usuario puede colapsarlo; la preferencia es persistente.
- Todo texto visible se obtiene de `i18n.js`.

### Dialogs

- Command Palette y preferencias usan `<dialog>`.
- Deben restaurar el foco al elemento originador.
- Escape cierra sin perder contexto.
- El foco debe quedarse dentro del dialog mientras está abierto.

### Toasts y estados

- Toasts anuncian cambios puntuales mediante región live.
- `tool-status` comunica estado de ejecución.
- Errores deben indicar recuperación y devolver foco a la entrada afectada.

## Breakpoints

| Rango | Comportamiento |
| --- | --- |
| ≥ 1440px | Mayor área de workspace y editores altos |
| 768–1439px | Sidebar fija y editor doble |
| 360–767px | Sidebar off-canvas; tabs para entrada/salida |
| ≤ 359px | Compactación adicional de controles y metadatos |

## Checklist de nuevos componentes

- [ ] Usa tokens existentes.
- [ ] Tiene estados default, hover, active, disabled y focus.
- [ ] Tiene etiqueta accesible y navegación por teclado.
- [ ] Funciona en dark/light y densidad compacta.
- [ ] No reduce el área útil del editor sin una razón clara.
- [ ] Tiene comportamiento definido en móvil.
- [ ] Respeta `prefers-reduced-motion`.
- [ ] Se documenta aquí antes de reutilizarse.
