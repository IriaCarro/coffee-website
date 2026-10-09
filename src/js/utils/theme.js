import themeSelectorTemplate from "../../components/layout/theme-selector.html?raw";
const THEME_KEY = "theme-preference";

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY);
}

function storeTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

class ThemeSelector extends HTMLElement {
  constructor() {
    super();
    this.handleToggle = this.handleToggle.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  connectedCallback() {
    if (!this.querySelector("[data-theme-toggle]")) {
      this.render();
    }

    this.toggle = this.querySelector("[data-theme-toggle]");
    this.menu = this.querySelector("[data-theme-menu]");

    const stored = getStoredTheme();
    this.applyTheme(this.hasTheme(stored) ? stored : getSystemTheme());

    this.toggle.addEventListener("click", this.handleToggle);
    this.addEventListener("click", this.handleOptionClick);
    document.addEventListener("click", this.handleOutsideClick);
    document.addEventListener("keydown", this.handleKeydown);
  }

  disconnectedCallback() {
    this.toggle?.removeEventListener("click", this.handleToggle);
    this.removeEventListener("click", this.handleOptionClick);
    document.removeEventListener("click", this.handleOutsideClick);
    document.removeEventListener("keydown", this.handleKeydown);
  }

  render() {
    this.innerHTML = themeSelectorTemplate;
  }

  optionFor(theme) {
    return this.querySelector(
      `[data-theme-menu] [data-theme="${CSS.escape(theme)}"]`,
    );
  }

  // The menu options in theme-selector.html are the list of valid themes
  hasTheme(theme) {
    return Boolean(theme) && this.optionFor(theme) !== null;
  }

  applyTheme(theme) {
    const option = this.optionFor(theme);
    document.documentElement.dataset.theme = theme;
    this.querySelector("[data-theme-icon]").src =
      option.querySelector("img").src;
    this.querySelector("[data-theme-label]").textContent =
      option.querySelector("span").textContent;

    this.querySelectorAll("[data-theme-menu] [data-theme]").forEach(
      (option) => {
        option.setAttribute(
          "aria-pressed",
          String(option.dataset.theme === theme),
        );
      },
    );
  }

  setMenuOpen(isOpen) {
    this.menu.classList.toggle("hidden", !isOpen);
    this.toggle.setAttribute("aria-expanded", String(isOpen));
  }

  handleToggle(event) {
    event.stopPropagation();
    this.setMenuOpen(this.menu.classList.contains("hidden"));
  }

  handleOptionClick(event) {
    const option = event.target.closest("[data-theme-menu] [data-theme]");
    if (!option || !this.contains(option)) return;

    const selected = option.dataset.theme;
    if (!this.hasTheme(selected)) return;

    storeTheme(selected);
    this.applyTheme(selected);
    this.setMenuOpen(false);
    this.toggle.focus();
  }

  handleOutsideClick(event) {
    if (
      !this.menu.classList.contains("hidden") &&
      !this.contains(event.target)
    ) {
      this.setMenuOpen(false);
    }
  }

  handleKeydown(event) {
    if (event.key === "Escape" && !this.menu.classList.contains("hidden")) {
      this.setMenuOpen(false);
      this.toggle.focus();
    }
  }
}

customElements.define("theme-selector", ThemeSelector);
