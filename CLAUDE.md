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

**Per-page JS entry points.** Each page loads its own module via `<script type="module">` from `src/js/` (`main.js` for home, `gallery-main.js`, `subscription-main.js`, `coffee-detail-main.js`, ...). They all import the shared pieces (`utils/theme.js`, header/footer components) and then page-specific logic from `src/js/utils/`. `main-simple.js` is the minimal shared set (theme + header + footer); `main.js` additionally registers section navigation.

**Custom-element components with HTML templates.** Shared UI (`<app-header>`, `<app-footer>`, `<theme-selector>`, `<section-navigation>`) are Web Components whose markup lives in `src/components/*.html` and is imported with Vite's `?raw` suffix, then injected via `innerHTML` in `connectedCallback`. Pages just place the tag (e.g. `<app-header></app-header>`). Change shared markup in `src/components/`, not per page.

**Theming.** `src/js/utils/theme.js` defines the `<theme-selector>` element and six themes (light, dark, matcha, cafe, blue, violet). The choice is stored in `localStorage` under `theme-preference` and applied as `data-theme` on `<html>`; with no stored value it follows `prefers-color-scheme`. Theme CSS variables are defined per `[data-theme="..."]` in `src/styles/base.css`.

**Data-driven coffee detail.** `src/data/coffees.json` is the single source of coffee data (id, price, origin, flavor profile, brewing...). `coffee-detail.html?id=<id>` is rendered client-side by `utils/coffee-detail.js` from that data. The home page's coffee cards are rendered from the same JSON by `utils/home-coffees.js` into `#coffee-grid`, so adding a coffee only means editing the JSON.

**Styling.** `src/index.css` is the single stylesheet, imported by every page. It declares the cascade order `@layer theme, reset, base, components, utilities` and imports Tailwind plus `src/styles/`: `tokens.css` (`@theme`: fonts, coffee color palette), `reset`, `base` (theme variables), `components`, `utilities`, and one file per page in `styles/pages/`. Styles are mostly semantic CSS classes (`btn-primary`, `card`, `detail-back-link`...) in these files rather than inline Tailwind utilities in the HTML. Fonts load from Google Fonts via `@import`.

**Static assets.** Images/icons are served from `public/` and referenced by absolute paths (`/photos/...`, `/icons/...`), including inside JS data and templates.
