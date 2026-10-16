# Laboratorio GitHub — Frontend

MVP didáctico construido con React y Vite para practicar el control de código
fuente en equipo. El tablero muestra el recorrido de una actividad desde que se
define como issue hasta que se integra mediante un merge.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Ejecutar en local

Desde esta carpeta:

```bash
npm install
npm run dev
```

Abre en el navegador la dirección que indique Vite (normalmente
`http://localhost:5173`).

## Usar el ejemplo en clase

1. Crea una actividad con **Nueva actividad**; aparecerá en **Por hacer**.
2. Mueve cada tarjeta para simular el avance por **En desarrollo**, **En
   revisión** y **Completado**.
3. Relaciona los estados del tablero con el flujo visual Issue → Rama → Pull
   request → Merge.
4. Recarga la página: el tablero conserva los cambios en el almacenamiento local
   del navegador. **Restaurar ejemplo** recupera las tarjetas iniciales.

El MVP no se conecta a GitHub ni a una API: sus datos viven en el navegador. Se
puede usar como interfaz de muestra mientras la clase practica ramas, commits,
pull requests y revisiones en el repositorio.

## Compilar para producción

```bash
npm run build
npm run preview
```
