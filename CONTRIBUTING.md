# Contribuir a PayloadForge

## Principios no negociables

- Payloads, resultados y secretos permanecen locales por defecto.
- La experiencia debe priorizar el flujo **entrada → ejecución → resultado**.
- Cada cambio de UI debe conservar navegación por teclado, foco visible y contraste WCAG AA.
- No introducir dependencias de UI, frameworks ni estilos inline sin una necesidad documentada.

## Diseño y componentes

Antes de crear o modificar un componente, revisa:

```text
docs/DESIGN-SYSTEM.md
web/assets/css/variables.css
```

Reglas:

1. Usa tokens existentes para color, espacio, tipografía, bordes y movimiento.
2. Define estados default, hover, active, disabled y focus.
3. Verifica dark/light, densidad compacta y mobile.
4. No reduzcas el área útil del editor sin justificación de producto.
5. Añade o actualiza la documentación del componente cuando su contrato cambie.

## Calidad local

Ejecuta antes de abrir un PR:

```bash
node --check web/assets/js/app.js
node --test web/tests/core.test.js web/tests/smoke.test.js
node scripts/build-site.mjs
```

GitHub Actions valida adicionalmente:

- Sintaxis, extensiones, unit y smoke tests.
- Lighthouse CI.
- axe-core con reglas WCAG 2 A/AA.
- Flujos E2E Playwright.
- Capturas y comparación visual.

## Pruebas E2E

Los flujos E2E viven en:

```text
web/tests/e2e.spec.js
```

Toda funcionalidad interactiva de producto debe añadir una prueba para:

- Acción principal y estado esperado.
- Navegación por teclado, si aplica.
- Persistencia local, si aplica.
- Recuperación del error, si aplica.
- Variante móvil cuando cambia el comportamiento.

## Baselines visuales

El workflow genera screenshots desktop y móvil como artifact `visual-review`.

Para aprobar o actualizar un baseline:

1. Revisa el artifact del PR.
2. Confirma que el cambio visual es intencional.
3. Copia las imágenes aprobadas a:

```text
web/tests/visual-baselines/desktop.png
web/tests/visual-baselines/mobile.png
```

4. Incluye el baseline en el mismo PR del cambio visual.

El comparador permite hasta 250 píxeles modificados. Si un cambio legítimo supera el umbral, revisa la diferencia y actualiza el baseline; no aumentes el umbral sin explicación en el PR.

## Accesibilidad

No silencies una violación axe/Lighthouse sin una corrección o una justificación documentada. En especial, verifica:

- Nombre accesible de controles.
- Orden de foco.
- `aria-expanded`, `aria-current`, `aria-invalid` y `aria-busy`.
- Contraste de estados interactivos y error.
- Escape y restauración de foco en overlays/dialogs.
