import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import coffeePages from "./vite-plugins/coffee-pages.js";
import htmlComponents from "./vite-plugins/html-components.js";
import i18n from "./vite-plugins/i18n.js";
import inlineThemeScript from "./vite-plugins/inline-theme-script.js";
import lowPriorityScripts from "./vite-plugins/low-priority-scripts.js";
import preloadFonts from "./vite-plugins/preload-fonts.js";

export default defineConfig({
  plugins: [
    tailwindcss(),
    htmlComponents(),
    coffeePages(),
    i18n(),
    inlineThemeScript(),
    lowPriorityScripts(),
    preloadFonts(),
  ],
  build: {
    rollupOptions: {
      input: [
        "index.html",
        "src/pages/about.html",
        "src/pages/coffees.html",
        "src/pages/contact.html",
        "src/pages/faq.html",
        "src/pages/gallery.html",
        "src/pages/menu.html",
        "src/pages/subscription.html",
      ],
    },
  },
});
