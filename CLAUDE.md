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

There is no test runner or linter. Prettier (with `prettier-plugin-tailwindcss`, see `.prettierrc`) is installed for formatting only. **After making changes, format the files you touched with Prettier** (e.g. `npx prettier --write <files>`).

## Architecture

**Multi-page Vite app.** Every HTML page is a separate entry listed explicitly in `build.rollupOptions.input` in [vite.config.js](vite.config.js). When adding a page under `src/pages/`, add it there too or it will be missing from the production build. `index.html` (home) lives at the root; the other pages (`about`, `coffees`, `contact`, `faq`, `gallery`, `menu`, `subscription`) are in `src/pages/`. The per-coffee detail pages are the exception: they are generated and registered as entries by `vite-plugins/coffee-pages.js` (see Data-driven coffee detail).

**Shared main + self-initializing page scripts.** Every page loads `src/js/main.js` (theme + footer newsletter form) via `<script type="module">`, plus any page-specific module from `src/js/utils/` with its own `<script type="module">` tag (`section-navigation.js` on home, `gallery-lightbox.js` on gallery, `form-validation.js` and `contact-form.js` on contact, `form-validation.js` and `subscription-wizard.js` on subscription). Those modules initialize themselves on import; there are no per-page `*-main.js` files.

**Custom-element components with HTML templates.** Interactive UI (`<theme-selector>`, `<section-navigation>`) are Web Components whose markup lives in `src/components/layout/*.html` and is imported with Vite's `?raw` suffix, then injected via `innerHTML` in `connectedCallback`. Change shared markup in `src/components/`, not per page.

**Theming.** `src/js/utils/theme.js` defines the `<theme-selector>` element and six themes (light, dark, matcha, cafe, blue, violet). The choice is stored in `localStorage` under `theme-preference` and applied as `data-theme` on `<html>`; with no stored value it follows `prefers-color-scheme`. Theme CSS variables are defined per `[data-theme="..."]` in `src/styles/themes.css`.

**Build-time components.** Repeated page chunks are components expanded at build (and in dev) by `vite-plugins/html-components.js`, so pages stay plain static HTML (the `<h1>` is real markup, not client-rendered). Lists from JSON are expanded at build too: `<repeat data="menu" component="menu-item"></repeat>` renders `src/components/content/menu-item.html` once per item of `src/data/menu.json` (derived fields per collection live in `COLLECTIONS` in the plugin; collections: `menu`, `gallery`, `coffees`, `plans`, `faq`). `limit="3"` keeps the first items and `lcp="false"` keeps their images lazy when the list is below the fold. Components can contain other components (the plugin expands until nothing changes). Other shared chunks, `<cta-card>`, `<contact-item>`, `<home-section>`, `<section-body>` (animated content wrapper inside a home section; `class` sets its max width), `<spec-item term="...">` (dt/dd card), `<social-links>`, `<form-field>`/`<form-textarea>`, `<app-header></app-header>`, `<app-footer class="..."></app-footer>` and `<faq-item question="...">answer</faq-item>` are build-time components too (templates `app-header.html`, `app-footer.html`, `faq-item.html`; the footer's `class` goes on its root `<footer>`). Also use `<back-link href="/" label="Volver al inicio"></back-link>` and `<page-header heading-id="x-title" heading="Título" class="..."><p class="lead">...</p></page-header>`; their markup and utilities live in `src/components/layout/back-link.html` and `page-header.html`. Attributes fill `{{attr}}` placeholders and the inner HTML fills `{{slot}}`. To add one, create `src/components/<group>/<name>.html` (groups: `layout`, `content`, `coffee`, `subscription`, `forms`; the plugin finds a component by its file name in any subfolder) and register it (with attribute defaults) in `COMPONENTS` in the plugin.

**Data-driven coffee detail.** `src/data/coffees.json` is the single source of coffee data (id, price, origin, flavor profile, brewing...). Each coffee gets a static page at `/coffees/<id>/`, generated at build time and served in dev by `vite-plugins/coffee-pages.js` from `src/pages/coffee-page.html` (page shell) and `src/components/coffee-detail*.html` (content). The page is real HTML with its own `<title>`, meta description and `<h1>`, with no client-side rendering. The coffees page's cards are expanded at build from the same JSON with `<repeat data="coffees" component="coffee-card">` and link to those pages, so adding a coffee only means editing the JSON.

**Styling.** `src/styles/index.css` is the single stylesheet, imported by every page. It declares the cascade order `@layer theme, reset, base, components, utilities` and imports Tailwind plus `src/styles/`: `tokens.css` (`@theme`: fonts, coffee color palette, hero sizes and breakpoint, keyframes; `@theme inline`: semantic color aliases of the theme variables), `themes.css` (per-theme variables), `base.css` (`@apply` on native elements: body, headings, focus ring, inputs, and the empty-list rule), `utilities.css` (custom `@utility`: `page-gutter`, `theme-transition`, `enter-fade-up`) and `components/ui.css` (shared `@apply` components: `icon`, `btn`, `form__label`, `form__error`, `hover-zoom`, `gallery-lightbox__control`, and the text/layout patterns repeated 3+ times: `page`, `heading` (`--section`/`--item`), `lead`). There are no per-page or per-component CSS files. All Tailwind utilities live directly in the markup (HTML pages, `src/components/*.html`, HTML strings in JS), as Tailwind recommends, including gradients, pseudo-elements, `url()` backgrounds and scroll-driven animations via arbitrary values and variants. Don't write plain CSS properties anywhere: even `base.css` and `ui.css` use `@apply`. Fonts are bundled with `@fontsource` packages imported in `index.css`. Tailwind scans only the files listed with `@source` in `index.css` (`index.html`, `src/pages`, `src/components`, `src/js`, `vite-plugins`); if class names ever live elsewhere (for example in `src/data`), add that folder or they won't be generated.

**Header height.** `--header-height` (used by `home-section.html` and the menu panel) is derived in `themes.css` from the header's own tokens (`--header-button-size`, `--header-padding-y`, `--header-padding-y-compact`, `--brand-logo-size`) and selected per breakpoint on `html` in `base.css`. No JS measures it, so if `app-header.html` stops using those tokens for its height, update the derivation.

**Static assets.** Images/icons are served from `public/` and referenced by absolute paths (`/photos/...`, `/icons/...`), including inside JS data and templates.

**Icons.** No emojis as icons. UI icons are stroke SVGs in `public/icons/ui/` (24×24 viewBox, `stroke-width="2"`), applied as a CSS mask so they take `currentColor` and follow the active theme: `<span class="icon mask-[url(/icons/ui/pin.svg)]" aria-hidden="true"></span>`. `.icon` (in `ui.css`) sets the `1em` size and mask settings; size them with `font-size`. To add one, drop the SVG in `public/icons/ui/` and reference it in `mask-[url(...)]`.

## Conventions

**Semantic HTML first.**

- Use the element that matches the meaning: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<ul>`/`<ol>`/`<li>`, `<figure>`, `<details>`/`<summary>`, `<button>`, `<a>`. Don't reach for a `<div>` or `<span>` when one of these fits.
- Use `<div>` only as a layout/styling wrapper with no semantic equivalent. Before adding one, ask whether an existing element can take the class instead.
- A `<section>` needs a heading and `aria-labelledby`; use `<article>` only for self-contained, redistributable content. Collections of similar items (cards, FAQ entries, links) are lists.
- One `<h1>` per page, and heading levels never skip (h1 → h2 → h3).
- Decorative content (emojis, arrows, icons) gets `aria-hidden="true"`. Informative images get a meaningful `alt`; decorative ones get `alt=""`.
- Keep keyboard access intact: visible `:focus-visible` styles, interactive things are real `<a>`/`<button>` elements.

**Respect the themes.** Every change to CSS or markup must keep working in all six themes (light, dark, matcha, cafe, blue, violet).

- Colors, surfaces, borders and focus rings come from the theme CSS variables (`--text-primary`, `--surface-container`, `--border-subtle`, `--focus-ring`...), used through the semantic color utilities that `tokens.css` aliases to them in `@theme inline` (`text-text-primary`, `bg-surface-container`, `border-border-subtle`, `outline-focus-ring`: the class is the variable name without `--`), not as `text-(--text-primary)`, never hard-coded hex/rgb/Tailwind palette colors in components or pages.
- New colors that vary by theme must be added as variables in every `[data-theme="..."]` block in `src/styles/themes.css`, not only for light/dark.
- Verify contrast in **each** of the six themes after styling changes (switch with `<theme-selector>`), not just the default. Target WCAG AA: 4.5:1 for normal text, 3:1 for large text, UI components and focus rings. Lighthouse's accessibility audit should stay ≥ 90 per theme.
- Keep the `theme-transition` behavior on themed surfaces.
- No inline styles: don't use the `style` attribute in HTML or set `element.style.*` / `style.cssText` in JS. Put styles in the CSS files via classes; toggle state with classes or `data-*`/`aria-*` attributes. (Inline styles bypass the cascade layers and theme variables, and are easy to miss when theming.)

**Style with Tailwind.** All styling uses Tailwind utilities written directly in the markup (`class="flex items-center gap-4 text-text-primary hover:underline"`), including variants for states and breakpoints (`hover:`, `focus-visible:`, `open:`, `group-open:`, `aria-expanded:`, `motion-safe:`, `sm:`...). Use `@apply` **only** to define shared components that are already repeated across pages (`btn`, `form__label`, `icon`, `heading`...) once a pattern is used 3 or more times and base styles of native elements in `base.css`; never to move one-off utility lists into a CSS class. Never write plain CSS properties: if something looks inexpressible, use an arbitrary value or variant (`bg-[linear-gradient(...)]`, `before:content-['']`, `[&::-webkit-details-marker]:hidden`). If a utility string gets repeated in several places, first extract the markup into a component in `src/components/`; promote it to an `@apply` class in `ui.css` only if it is truly shared UI.

**Keep code small and readable.**

- Split large files by responsibility: one JS module per feature in `src/js/utils/` (shared helpers without side effects, like `template.js` and `aria.js`, live in `src/js/lib/`), and repeated markup as a component in `src/components/` rather than copied between pages.
- Prefer small functions with a single purpose over long `connectedCallback`/init bodies; move data into `src/data/` instead of hard-coding it in JS or HTML.
- Reuse existing shared classes (`btn btn--primary`, `heading heading--section`...) before creating new ones; a pattern used 3 or more times goes in `styles/components/ui.css` as an `@apply` component, never in per-page CSS (there are none).
- Name the classes that remain (shared components and CSS hooks) with BEM: `block__element--modifier` (e.g. `btn btn--primary`); JS hooks follow the same naming: ids as `block__element` (`subscription__form`, `menu__list`), plus `data-*` attributes for component internals. One level of element only (no `a__b__c`); a modifier always accompanies its base class in the markup. State toggled from JS is a modifier too.

**Copy and accessibility basics.** Spanish copy, with `lang="es"` and a unique `<title>` and meta description per page. Respect `prefers-reduced-motion` for animations. Run `npm run build` after adding or renaming pages to confirm they're in the production build.
