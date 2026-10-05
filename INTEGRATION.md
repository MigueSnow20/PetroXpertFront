# Integración de la V1 — 2026-10-01

Fuente funcional: `C:/Users/migue/Desktop/PetroXpert/PetroXpertBackend/petroxpert-web`.
Destino observado: `MigueSnow20/PetroXpertFront`, rama `fix-form-fields`, HEAD `f773ccc`.
El destino no tenía cambios locales. Se conservaron los componentes legacy sin borrar carpetas.

## Frontend activo

`index.html` arranca `src/main.ts`. Se integran Vue/TypeScript, cinco rutas, logo transparente,
favicon, cotizaciones y cálculos desde Spring, formularios de cierre/primas/informe y dashboard oscuro.
Se ocultan códigos técnicos de fuente y la frase retirada de precios por terminal.
Los componentes antiguos conservados no forman parte del bundle ni ejecutan sus temporizadores.

Ambos gráficos mantienen sus URLs originales y `referrerpolicy="no-referrer"`.
Ventana visible máxima 780 × 510 px; iframe lógico 650 × 450 px escalado hasta 1,2.
Tarjeta exterior de hasta 826 px, altura automática y columna ajustada. ResizeObserver adapta la escala
sin reorganizar el documento interno ni cambiar la proporción del recorte. No se eluden bloqueos del proveedor.

## Vercel y producción

Se conserva Vite, salida `dist`, alias `@` y separación de vendor de la configuración existente.
`vercel.json` añade fallback de rutas SPA; no cambia dominios ni la vinculación del proyecto Vercel.
`npm run build` comprueba TypeScript y compila. Se añaden TypeScript y vue-tsc, y se actualizan las
versiones de Vue/Router/Vite al rango de la fuente funcional. Axios y PrimeVue existentes permanecen.
Se elimina solo la dependencia circular del paquete sobre sí mismo (`web-frontend: file:`).

`src/api.ts` usa `https://petroxpertbackend.fly.dev` en build de producción por defecto.
`VITE_API_BASE_URL` o la variable legacy `VITE_BACKEND_URL` pueden sobrescribir ese origen.
No se copian `.env`, credenciales, `node_modules`, archivos compilados ni `.git`.
El polling recibe `X-Market-Refresh-Ms` de Spring: 30 s por defecto, sin consultas simultáneas.
Solo los widgets de gráficos consultan contenido de mercado externo directamente.

## Antes de publicar

- Confirmar en Vercel que `VITE_API_BASE_URL`/`VITE_BACKEND_URL`, si existen, apuntan al backend Fly vigente.
- Confirmar que el proyecto sigue usando Vite, `npm run build` y salida `dist`.
- Confirmar la rama de producción de Vercel: la rama local conservada es `fix-form-fields`.
- Publicar el backend primero: el servidor publicado actualmente todavía debe incorporar `/api/v1`.
- Comprobar widgets, precios y fechas en el navegador habitual; Chromium automatizado recibe 403.
- No se modifican ajustes remotos de Vercel ni se realizan POST a producción durante la validación.

Sin commit ni push.
