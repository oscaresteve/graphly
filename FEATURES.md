# Graphly — Funcionalidades y Requisitos

## Descripción general

Graphly es una app mobile-first para registrar y visualizar métricas personales a lo largo del tiempo mediante gráficos flexibles y personalizables.

---

## Funcionalidades

### Gráficos y métricas

- El usuario puede crear múltiples gráficos, cada uno asociado a una métrica concreta (ej. peso, cigarrillos al día, horas de sueño…)
- Al crear un gráfico se elige el nombre, la unidad de medida y el tipo de valor:
  - Entero (ej. número de cigarrillos)
  - Decimal (ej. kg con decimales)
  - Personalizado (ej. "vasos de agua")
- El usuario puede gestionar (editar, archivar, eliminar) sus gráficos

### Registro de entradas

- Entrada diaria rápida para la fecha actual
- Posibilidad de añadir entradas para fechas pasadas
- Flujo cómodo para introducir varias entradas de golpe (carga masiva retroactiva)

### Visualización

- Gráfico interactivo con rango de tiempo flexible (semana, mes, año, personalizado)
- Diseño mobile-first; la visualización debe funcionar bien en pantallas pequeñas
- El usuario podra elegir entre varios temas predefinidos.

### Gestión de usuarios

- Autenticación y gestión de cuentas mediante **Clerk**
- Cada usuario ve únicamente sus propios gráficos y datos

---

## Requisitos técnicos

- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS + **shadcn/ui** (componentes, temas)
- **Gráficos:** shadcn/ui Charts (Recharts bajo el capó)
- **Autenticación:** Clerk
- **Gestor de paquetes:** pnpm
- **Diseño:** Mobile-first

---
