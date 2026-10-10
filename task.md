# 🧪 Laboratorio · Módulo 01 · Layout + Tailwind CSS

⏱️ Dedicación estimada: 6-10 h para los obligatorios; los opcionales y desafíos, lo que queráis estirar.  
📦 Formato: enlace a un repositorio de GitHub

## La idea

En el módulo hemos visto cómo se construye una página por dentro: HTML semántico, modelo de caja, cascada, especificidad, posicionamiento, flexbox, grid y media queries. Después hemos visto Tailwind, PostCSS y cómo trabajar con herramientas de IA.

En este laboratorio vais a juntarlo todo: maquetar una landing page (y, si queréis, alguna pantalla más) usando Tailwind, que se vea bien en móvil y en escritorio.

## La regla del juego

- ✅ La IA está permitida y recomendada.
- ⚠️ Pero tenéis que entender cada clase que entregáis. Si en la revisión os preguntamos "¿por qué este `md:grid-cols-3`?" o "¿qué hace este `min-h-dvh`?", tenéis que saber responder. Tailwind es CSS con otro nombre: todo lo del módulo sigue aplicando.

## Elige tu tema

Tenéis dos caminos. Los dos valen lo mismo.

### A. Tema propuesto: Tueste, tostadero de café de especialidad

Seguimos con el café de los ejemplos del módulo (Etiopía, Colombia, Kenia…). Tueste es un pequeño tostadero ficticio que vende café online por suscripción.

Necesita una landing con:

- Cabecera con logo y menú.
- Hero: titular potente, subtítulo, botón de "Suscríbete" y una imagen.
- Cafés del mes: tarjetas con origen, notas de cata y precio.
- Cómo funciona: 3 pasos (eliges → tostamos → te llega a casa).
- Planes de suscripción: 2-3 planes con uno destacado.
- Preguntas frecuentes.
- Pie con enlaces, redes y newsletter.

### B. La UI de tu TFM

Si ya tenéis en mente el TFM, aprovechad este laboratorio para empezar a maquetarlo. Así sacáis trabajo adelantado y os corregimos el enfoque pronto.

Vale cualquier cosa: la landing del producto, el dashboard, la pantalla de listado + detalle, el perfil de usuario…

Condición: tiene que cubrir las mismas piezas técnicas que el tema propuesto.

## Punto de partida: el proyecto

Usamos Vite (arranca en un segundo y recarga solo). Nada de frameworks: HTML + Tailwind. Si alguien quiere usar React o similar, adelante, pero no suma nota: aquí se evalúa el layout.

```bash
npm create vite@latest lab-tailwind -- --template vanilla
cd lab-tailwind
npm install
```

Ahora tenéis dos formas de conectar Tailwind. Elegid una y explicad en el README cuál y por qué.

### Opción 1: plugin de Vite

```bash
npm install tailwindcss @tailwindcss/vite
```

`vite.config.js`:

```js
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

### Opción 2: vía PostCSS

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

`postcss.config.mjs`:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

Vite detecta `postcss.config.mjs` solo, no hay que tocar nada más.

En los dos casos:

`src/style.css`

```css
@import "tailwindcss";
```

Aseguraos de que el `index.html` enlaza ese CSS (o lo importa `main.js`) y arrancad:

```bash
npm run dev
```

Poned un:

```html
<h1 class="text-4xl font-bold text-amber-700">Hola</h1>
```

Si se ve grande y marrón, estáis dentro. 🎉

> ⚠️ Ojo con la IA y las versiones. Estamos usando Tailwind v4. Muchas IAs (y muchos tutoriales) todavía generan configuración de la v3: `tailwind.config.js`, `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`, etc. En v4 la configuración se hace en el propio CSS con `@theme`.

## Extensiones recomendadas (VS Code)

- Tailwind CSS IntelliSense
- Prettier + prettier-plugin-tailwindcss

---

# ✅ Parte 1 · Obligatorios

Todos son necesarios para aprobar. Ninguno es difícil si vais paso a paso.

## O1 · Estructura semántica

Nada de un mar de `<div>`. Usad lo que vimos en el tema 01:

- `<html lang="es">`, `<meta name="viewport">` y un `<title>`
- `<header>`, `<nav>`, `<main>`, `<section>` (cada una con su título), `<footer>`
- Un solo `<h1>` y títulos sin saltarse niveles (`h1` → `h2` → `h3`)
- Las tarjetas, `<article>`. Las listas de enlaces, `<ul>`
- Todas las imágenes con `alt` (vacío `alt=""` si son decorativas)

## O2 · Tu tema visual con `@theme`

No vamos a usar la paleta por defecto tal cual. Definid vuestra identidad con variables (tema 05) dentro de `@theme`:

```css
@import "tailwindcss";

@theme {
  --color-tueste-50: #fbf7f3;
  --color-tueste-500: #9a5b33;
  --color-tueste-900: #2e1a10;

  --font-display: "Fraunces", serif;
  --font-sans: "Inter", system-ui, sans-serif;
}
```

Con esto Tailwind genera clases como `bg-tueste-50`, `text-tueste-900` o `font-display`.

### Requisitos

- Al menos un color de marca con 3 tonos y un color de acento.
- Una tipografía propia para los títulos.
- Usadlos en toda la página. No uséis colores "a pelo" como `bg-[#9a5b33]` repartidos por el HTML.
- Si un color se repite, va al `@theme`.

## O3 · Cabecera con flexbox

- Logo a la izquierda, menú a la derecha (`flex`, `justify-between`, `items-center`, `gap-*`)
- En móvil, que no se rompa: basta con que el menú pase debajo del logo o se simplifique
- Enlaces con `hover` y `focus-visible`

## O4 · Hero

- Titular + texto + dos botones (uno principal, uno secundario) + imagen
- En móvil: todo en una columna
- A partir de `md`: texto e imagen lado a lado
- El texto no debe hacerse ilegible: usar `max-w-prose` o `max-w-xl`

## O5 · Rejilla de tarjetas con grid

- Sección con al menos 6 tarjetas
- Mobile first: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- Cada tarjeta: imagen, título, texto, precio / dato destacado y botón
- `p-*`, `rounded-*`, `border`, `shadow-*`
- `hover` con sombra más grande y `-translate-y-1`
- Imágenes con `aspect-video` / `aspect-square` + `object-cover`

## O6 · Sección de pasos o destacados con flexbox

- 3 pasos o 3 datos/ventajas
- En móvil, en columna; en escritorio, en fila
- `flex flex-col md:flex-row`

## O7 · Pie de página

- Al menos 3 columnas en escritorio y apiladas en móvil
- Línia final con copyright separado por borde

## O8 · Accesibilidad mínima

- Todo lo interactivo se puede usar con teclado (`Tab`)
- `focus-visible` visible
- Contraste suficiente: Lighthouse en Accesibilidad ≥ 90
- Nada de texto metido en imágenes

## O9 · README + bitácora de IA

El `README.md` del repo tiene que incluir:

- Tema elegido (A o TFM)
- Cómo arrancarlo (`npm install` + `npm run dev`)
- Opción de integración de Tailwind (Vite o PostCSS) y por qué
- Capturas en móvil y escritorio
- Checklist de obligatorios / opcionales / desafíos que habéis hecho
- Bitácora de IA con este formato:

```md
### Prompt

"Hazme la sección de planes con 3 tarjetas, la del medio destacada..."

### Qué me dio

Me generó un `tailwind.config.js` (sintaxis v3) y colores a pelo tipo `bg-[#c2410c]`.

### Qué corregí y por qué

Pasé los colores a `@theme` y quité el config: en v4 la configuración va en el CSS.
```

---

# ⭐ Parte 2 · Opcionales

Suben nota. Haced los que más os apetezcan (recomendamos al menos 3).

## P1 · Modo oscuro 🌙

- Variante `dark:` según preferencia del sistema
- Mejor: botón para alternar tema con clase `dark`

## P2 · Cabecera fija con efecto cristal

```css
sticky top-0 z-50 backdrop-blur bg-white/70
```

Explicad en el README por qué `sticky` y no `fixed`, y por qué hace falta `z-index`.

## P3 · Planes con tarjeta destacada

- Tarjeta central más grande
- Borde de color
- Etiqueta "⭐ Más popular" con `absolute`

## P4 · FAQ plegable sin JavaScript

Usar `<details>` y `<summary>`. Girar la flecha con `group-open:rotate-180`.

## P5 · Formulario con estados

- `label` asociado a cada campo
- `focus:`, `invalid:`, `user-invalid:`, `disabled:`
- Mensaje de error visible con `peer-invalid:block`

## P6 · Bento grid 🍱

Sección con layouts de cajas de distintos tamaños usando `col-span-*` y `row-span-*`.

## P7 · Animaciones con cabeza

- Transiciones suaves (`transition`, `duration-*`, `ease-*`)
- `motion-safe:` para respetar preferencias de movimiento reducido
- Animación propia con `@keyframes` en `@theme`

---

# 🔥 Parte 3 · Desafíos

Para quien quiera sufrir un poco.

## D1 · Menú hamburguesa sin JavaScript

- Menú oculto en móvil con botón `☰`
- Desplegable sin JS
- Debe ser usable con teclado

## D2 · Componentes con container queries

Tarjeta que cambia de diseño según el ancho de su contenedor, no el de la ventana.

## D3 · Multitema

Cambiar tema claro / oscuro y 2-3 variables de color con atributo `data-theme`.

## D4 · Tus propias utilidades

Crear al menos una utilidad con `@utility` y explicar cuándo tiene sentido crear una utilidad frente a repetir clases.

## D5 · Layout de aplicación

Dashboard con cabecera, barra lateral y contenido.

## D6 · De captura a código

Elegir una sección de una web y maquetarla en Tailwind con revisión posterior.

## D7 · Lighthouse al 100

Accesibilidad, buenas prácticas y SEO todo al 100.

---

## 🤖 Cómo sacarle partido a la IA (sin que os la cuele)

Dadle contexto. Un buen prompt incluye versión, tokens y restricciones:

```text
Estoy maquetando con Tailwind CSS v4 (sin tailwind.config.js, el tema está en
@theme dentro del CSS). Mis colores son tueste-50, tueste-500, tueste-900 y
acento-500; la fuente de títulos es font-display.

Hazme la sección "Cafés del mes": HTML semántico (section + h2 + article por
tarjeta), mobile first (1 columna → 2 en sm → 3 en lg), sin valores arbitrarios,
con estados hover y focus-visible. No uses JavaScript.
```

Pedidle que explique, no solo que haga:

- "Explícame cada clase de este bloque y qué CSS genera"
- "¿por qué has usado grid aquí y no flex?"

### Revisa esta lista

| ❌ Lo que suele hacer         | ✅ Qué hacer                              |
| ----------------------------- | ----------------------------------------- |
| Sintaxis de Tailwind v3       | `@import "tailwindcss"` + `@theme`        |
| `<div>` para todo             | `<header>`, `<section>`, `<article>`      |
| Colores a pelo `bg-[#c2410c]` | Tokens del `@theme`                       |
| Se olvida del `focus-visible` | Añadirlo a todo lo interactivo            |
| Diseña escritorio primero     | Base móvil + `sm:`/`md:`/`lg:`            |
| Clases contradictorias        | Mantener una sola estrategia              |
| Imágenes sin `alt`            | `alt` descriptivo o vacío para decorativa |
| Añade autoprefixer a PostCSS  | En v4 no hace falta                       |

Usad DevTools como en el módulo: si algo no se ve como esperáis, inspeccionad el elemento, mirad qué regla gana y activad el overlay de grid/flex.

---

## 📬 Entrega

- Repositorio público en GitHub (o privado dando acceso a los profesores)
- En la raíz: el proyecto de Vite + el `README.md` del punto O9
- Capturas en una carpeta `docs/` o `screenshots/`
- En el portal `academia.lemoncode.net` id a los laboratorios del módulo 1 y pegad el enlace a vuestro repo público
- No subáis `node_modules`

## 📊 Evaluación

| Bloque                       | Peso |
| ---------------------------- | ---: |
| Obligatorios O1-O8           |  50% |
| README + bitácora de IA (O9) |  10% |
| Opcionales (P1-P7)           |  20% |
| Desafíos (D1-D7)             |  15% |
| Acabado general              |   5% |

Para aprobar: todos los obligatorios hechos y funcionando en móvil y escritorio.

## 📚 Recursos

- Documentación de Tailwind CSS
- Tailwind: instalación con Vite y con PostCSS
- Tailwind: configurar el tema (`@theme`) y modo oscuro
- Los apuntes del módulo: `01-layout`
- Inspiración: Tailwind UI / Plus, Dribbble, Land-book

¡A maquetar! ☕
