import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import coffeePages from "./vite-plugins/coffee-pages.js";

export default defineConfig({
  plugins: [tailwindcss(), coffeePages()],
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
