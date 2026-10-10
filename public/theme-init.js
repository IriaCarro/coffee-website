// Runs before first paint so the stored theme is applied without a flash.
// Keep the key in sync with src/js/utils/theme.js and the theme names with
// the options in src/components/layout/theme-selector-menu.html.
try {
  var theme = localStorage.getItem("theme-preference");
  if (["light", "dark", "matcha", "cafe", "blue", "violet"].includes(theme)) {
    document.documentElement.dataset.theme = theme;
  }
} catch (e) {
  console.log("Error reading theme preference from localStorage:", e);
}
