# Baselines visuales

Este directorio contiene las capturas visuales aprobadas para PayloadForge:

- `desktop.png`: viewport Desktop Chrome.
- `mobile.png`: viewport iPhone 13.

## Inicialización

1. Ejecuta el workflow **Quality** o genera localmente las capturas en `visual-reports/`.
2. Revisa las imágenes publicadas en el artifact `visual-review`.
3. Copia las capturas aprobadas a este directorio con los nombres exactos indicados.
4. Confirma las imágenes en Git.

A partir de ese momento, el workflow compara cada captura contra el baseline usando ImageMagick y falla si excede el umbral definido en `scripts/compare-visual-baselines.mjs`.

La ausencia de un baseline no falla el pipeline: publica las capturas candidatas para revisión inicial.
