# Scripts

Este directorio contiene utilidades para optimizar imágenes del proyecto.

- `resize-dark2.js`: genera una versión "suave" optimizada de `src/assets/dark2.png` y la guarda en `src/assets.optim/dark2-soft.png`.

Uso desde la raíz del repo:

```powershell
npm run optimize:dark2
```

Notas:
- Haz backup de `src/assets` antes de reemplazar.
- `src/assets.orig` se usa como backup automático cuando ejecutamos procesos manuales.
