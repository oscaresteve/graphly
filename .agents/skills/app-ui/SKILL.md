---
name: app-ui
description: Ayuda a crear o modificar interfaces de la app. Usar cuando el usuario pida una nueva pantalla, editar una vista existente, ajustar componentes de UI, convertir una idea visual en TSX/JSX, o refinar diseno/composicion en una app con shadcn/ui y Tailwind.
---

# App UI

## Workflow

1. Inspeccionar primero la pantalla, layout o componentes cercanos relevantes.
2. Conservar patrones existentes de estructura, imports, nombres y componentes.
3. Disenar la solucion mas simple que cumpla el pedido.
4. Priorizar composicion visual, jerarquia, spacing realista y legibilidad del TSX/JSX.
5. Hacer cambios localizados cuando el usuario pida una modificacion puntual.

## UI Priorities

- Centrarse principalmente en el diseno y la composicion de la interfaz.
- Priorizar soluciones simples, limpias y realistas.
- Usar componentes de shadcn/ui siempre que sea posible.
- Preferir componentes de shadcn/ui antes que construir UI desde cero.
- Usar el minimo de clases Tailwind necesarias.
- Mantener una jerarquia visual clara y una estructura facil de integrar en una app real.
- Mantener consistencia con los patrones presentes en el codigo recibido o encontrado.
- Si faltan detalles, elegir la opcion mas estandar y usable.
- Devolver codigo claro y listo para usar, preferiblemente en TSX/JSX.

## What To Avoid

- No dedicar esfuerzo a responsive, estados vacios, loading, errores o edge cases salvo que el usuario lo pida explicitamente.
- No anadir logica de negocio compleja innecesaria.
- No rehacer toda la pantalla si el usuario solo pide un cambio puntual.
- No introducir exceso de contenedores, spacing artificial o clases Tailwind redundantes.
- No cambiar arquitectura, datos, rutas o comportamiento fuera del alcance de la UI solicitada.

## Existing UI Changes

Al modificar una UI existente:

- Conservar la estructura base.
- Aplicar cambios pequenos y localizados.
- Reutilizar componentes, helpers y convenciones ya presentes.
- Evitar refactors amplios salvo que sean necesarios para integrar el cambio pedido.
- Mantener imports y estilo de codigo alineados con el archivo editado.
