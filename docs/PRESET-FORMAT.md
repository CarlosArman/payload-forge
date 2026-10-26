# Formato de presets locales

PayloadForge permite exportar e importar presets de una herramienta activa mediante un archivo JSON local. Esta capacidad está diseñada para respaldar configuraciones de trabajo o trasladarlas entre navegadores bajo control explícito del usuario.

## Privacidad

- PayloadForge no transmite presets por red.
- La exportación crea un archivo local descargado por el navegador.
- La importación lee un archivo seleccionado manualmente por el usuario.
- Un preset contiene una **entrada**; revísalo antes de compartirlo porque puede incluir datos sensibles.
- Los resultados generados nunca forman parte del archivo exportado.

## Formato `version: 1`

```json
{
  "version": 1,
  "tool": "schema",
  "presets": [
    {
      "name": "Payload de usuario",
      "input": "{\n  \"id\": 42,\n  \"name\": \"Ada\"\n}",
      "at": "2026-10-26T18:00:00.000Z"
    }
  ]
}
```

### Campos

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `version` | number | Versión del formato; actualmente debe ser `1`. |
| `tool` | string | ID de la herramienta de destino, por ejemplo `schema`, `formatter` o `yaml`. |
| `presets` | array | Lista de entradas reutilizables para esa herramienta. |
| `presets[].name` | string | Nombre visible del preset; máximo 60 caracteres. |
| `presets[].input` | string | Entrada local a reutilizar; máximo 200 KB por preset. |
| `presets[].at` | string | Marca de tiempo ISO 8601 local; opcional para compatibilidad. |

El archivo completo de importación tiene un límite de **1 MB** antes de ser leído o parseado.

## Reglas de importación

La aplicación rechaza el archivo si:

- No contiene `version: 1`.
- El ID `tool` no coincide con la herramienta activa.
- `presets` no es una lista.
- El archivo supera 1 MB.

Durante una importación válida:

1. Se descartan entradas malformadas.
2. Se descartan nombres vacíos, duplicados y presets que superen 200 KB.
3. Los presets importados se fusionan con los ya locales.
4. Los nombres importados tienen prioridad sobre nombres existentes.
5. Se conserva un máximo de 20 presets para la herramienta activa.
6. Los presets de otras herramientas no se modifican.

## Flujo recomendado

1. Abre **Cargar preset** en la herramienta correspondiente.
2. Pulsa **Exportar presets** para crear el backup.
3. Revisa el archivo antes de compartirlo.
4. En el destino, abre la misma herramienta y pulsa **Importar presets**.
5. Selecciona el archivo JSON exportado.
6. Confirma que los presets aparecen en la lista antes de cargarlos al editor.

No importes presets de fuentes no confiables sin revisar su contenido.
