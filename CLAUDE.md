# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Multi-page static site for a fictional specialty coffee roaster (Spanish-language copy), built with Vite + Tailwind CSS v4 and vanilla JS (no framework). It began as a Tailwind lab assignment (`README.md`).

## Commands

```bash
npm install
npm run dev       # Vite dev server
npm run build     # outputs to dist/
npm run preview   # serve the built dist/
```

There is no test runner or linter. Prettier (with `prettier-plugin-tailwindcss`, see `.prettierrc`) is installed for formatting only.

## Architecture

**Multi-page Vite app.** Every HTML page is a separate entry listed explicitly in `build.rollupOptions.input` in [vite.config.js](vite.config.js). When adding a page under `src/pages/`, add it there too or it will be missing from the production build. `index.html` (home) lives at the root; the other pages (`about`, `coffee-detail`, `contact`, `faq`, `gallery`, `subscription`) are in `src/pages/`.

**Shared main + self-initializing page scripts.** Every page loads `src/js/main.js` (theme + header + footer) via `<script type="module">`, plus any page-specific module from `src/js/utils/` with its own `<script type="module">` tag (`home-coffees.js` and `section-navigation.js` on home, `lightbox.js` on gallery, `subscription-wizard.js`, `coffee-detail.js`). Those modules initialize themselves on import; there are no per-page `*-main.js` files.

**Custom-element components with HTML templates.** Shared UI (`<app-header>`, `<app-footer>`, `<theme-selector>`, `<section-navigation>`) are Web Components whose markup lives in `src/components/*.html` and is imported with Vite's `?raw` suffix, then injected via `innerHTML` in `connectedCallback`. Pages just place the tag (e.g. `<app-header></app-header>`). Change shared markup in `src/components/`, not per page.

**Theming.** `src/js/utils/theme.js` defines the `<theme-selector>` element and six themes (light, dark, matcha, cafe, blue, violet). The choice is stored in `localStorage` under `theme-preference` and applied as `data-theme` on `<html>`; with no stored value it follows `prefers-color-scheme`. Theme CSS variables are defined per `[data-theme="..."]` in `src/styles/base.css`.

**Data-driven coffee detail.** `src/data/coffees.json` is the single source of coffee data (id, price, origin, flavor profile, brewing...). `coffee-detail.html?id=<id>` is rendered client-side by `utils/coffee-detail.js` from that data. The home page's coffee cards are rendered from the same JSON by `utils/home-coffees.js` into `#coffee-grid`, so adding a coffee only means editing the JSON.

**Styling.** `src/index.css` is the single stylesheet, imported by every page. It declares the cascade order `@layer theme, reset, base, components, utilities` and imports Tailwind plus `src/styles/`: `tokens.css` (`@theme`: fonts, coffee color palette), `reset`, `base` (theme variables), `components`, `utilities`, and one file per page in `styles/pages/`. Styles are mostly semantic CSS classes (`btn-primary`, `card`, `detail-back-link`...) in these files rather than inline Tailwind utilities in the HTML. Fonts load from Google Fonts via `@import`.

**Static assets.** Images/icons are served from `public/` and referenced by absolute paths (`/photos/...`, `/icons/...`), including inside JS data and templates.

**Icons.** No emojis as icons. UI icons are stroke SVGs in `public/icons/ui/` (24×24 viewBox, `stroke-width="2"`), applied as a CSS mask by `src/styles/icons.css` so they take `currentColor` and follow the active theme: `<span class="icon icon-pin" aria-hidden="true"></span>`. Size them with `font-size` (they are `1em`). To add one, drop the SVG in `public/icons/ui/` and add an `.icon-<name>` rule with its `--icon` url in `icons.css`.

## Conventions

**Semantic HTML first.**

- Use the element that matches the meaning: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<ul>`/`<ol>`/`<li>`, `<figure>`, `<details>`/`<summary>`, `<button>`, `<a>`. Don't reach for a `<div>` or `<span>` when one of these fits.
- Use `<div>` only as a layout/styling wrapper with no semantic equivalent. Before adding one, ask whether an existing element can take the class instead.
- A `<section>` needs a heading and `aria-labelledby`; use `<article>` only for self-contained, redistributable content. Collections of similar items (cards, FAQ entries, links) are lists.
- One `<h1>` per page, and heading levels never skip (h1 → h2 → h3).
- Decorative content (emojis, arrows, icons) gets `aria-hidden="true"`. Informative images get a meaningful `alt`; decorative ones get `alt=""`.
- Keep keyboard access intact: visible `:focus-visible` styles, interactive things are real `<a>`/`<button>` elements.

**Respect the themes.** Every change to CSS or markup must keep working in all six themes (light, dark, matcha, cafe, blue, violet).

- Colors, surfaces, borders and focus rings come from the theme CSS variables (`--text-primary`, `--surface-container`, `--border-subtle`, `--focus-ring`...), never hard-coded hex/rgb/Tailwind palette colors in components or pages.
- New colors that vary by theme must be added as variables in every `[data-theme="..."]` block in `src/styles/base.css`, not only for light/dark.
- Verify contrast in **each** of the six themes after styling changes (switch with `<theme-selector>`), not just the default. Target WCAG AA: 4.5:1 for normal text, 3:1 for large text, UI components and focus rings. Lighthouse's accessibility audit should stay ≥ 90 per theme.
- Keep the `theme-transition` behavior on themed surfaces.
- No inline styles: don't use the `style` attribute in HTML or set `element.style.*` / `style.cssText` in JS. Put styles in the CSS files via classes; toggle state with classes or `data-*`/`aria-*` attributes. (Inline styles bypass the cascade layers and theme variables, and are easy to miss when theming.)

**Keep code small and readable.**

- Split large files by responsibility: one JS module per feature in `src/js/utils/`, one CSS file per page in `src/styles/pages/`, and repeated markup as a component in `src/components/` rather than copied between pages.
- Prefer small functions with a single purpose over long `connectedCallback`/init bodies; move data into `src/data/` instead of hard-coding it in JS or HTML.
- Reuse existing classes (`btn-primary`, `card`...) before creating new ones, and put shared styles in `components.css`, page-only styles in the page's file.
- Follow existing naming (`page-element` BEM-like class names such as `faq-accordion-summary`).

**Copy and accessibility basics.** Spanish copy, with `lang="es"` and a unique `<title>` and meta description per page. Respect `prefers-reduced-motion` for animations. Run `npm run build` after adding or renaming pages to confirm they're in the production build.
