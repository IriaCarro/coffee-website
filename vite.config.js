import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: [
        "index.html",
        "src/pages/about.html",
        "src/pages/coffee-detail.html",
        "src/pages/coffees.html",
        "src/pages/contact.html",
        "src/pages/faq.html",
        "src/pages/gallery.html",
        "src/pages/subscription.html",
      ],
    },
  },
});
