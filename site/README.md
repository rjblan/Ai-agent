# Ai-agent — web de prueba

Landing de demostración para Ai-agent, hecha para ejercitar las skills de `.claude/skills/`.
Todo el contenido (tareas, nombres, cifras) es de ejemplo.

```bash
cd site
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
```

URLs útiles:

- `?dev=1&data=worst|empty|one|demo` — conmutador de datos del registro (break-ui). Siempre visible con `npm run dev`.
- `?proto=1&v=1|2|3` — selector de variantes de la parada con permiso (prototype). Teclas 1–3, ←/→, R.

## Qué skill se usa dónde

| Skill | Dónde se nota |
| --- | --- |
| impeccable | Todo el proceso: `PRODUCT.md`, sorteo de dirección («Plano de metro»), contrato en `.impeccable/surfaces/`, detector sin hallazgos, revisión final y `DESIGN.md`. |
| emil-design-eng | Curvas propias (`--ease-out`, `--ease-drawer`), `scale(0.97)` al pulsar, nada aparece desde `scale(0)`, duraciones < 300 ms en la UI. |
| animate | Cada animación pasó el filtro de frecuencia y propósito: tren (estado), parada con permiso (feedback), aviso (ocasional), escalonado de paradas. |
| animation-performance | Solo `transform`, `opacity` y `clip-path`; el tren usa la cadena `transform` completa en Motion; nada de `transition: all`. |
| apple-design | El tren se mueve con un muelle sin rebote (damping 1); el panel inferior se arrastra y se cierra con un gesto rápido. |
| mobile-native | `viewport-fit=cover`, áreas seguras, `100svh`, inputs de 16 px, sin destello al tocar, `:hover` solo con ratón, `touch-action: manipulation`, `inputmode`/`enterkeyhint`. |
| pick-ui-library | Sonner (avisos), Motion (muelles), Base UI Drawer (panel), NumberFlow (contador), clsx. |
| ask-sonner | Un solo `<Toaster />` en la raíz, `toast.success` con acción, `toast.promise` en la lista de espera, `id` estable contra duplicados. |
| break-ui | Datos de peor caso realistas (correos largos, «Jo», alemán, vietnamita, emoji, `<script>`), vacío y uno; plurales con `Intl.PluralRules`. |
| prototype | Tres variantes de la parada con permiso (Andén, Panel, Billete) tras el selector oficial de `PICKER.md`. |
| review-animations / improve-animations / find-animation-opportunities | Se aplicaron como lista de control: sin animación en acciones de teclado, salida igual a la entrada, reduced motion más suave pero no a cero. |
| animation-vocabulary | Nombres usados: *stagger* (paradas), *hold to confirm* (aprobar), *clip reveal* (trazado), *drag to dismiss* (panel). |
| write-swift, animate-expo | No aplican: son para Swift y React Native, no para una web. |
