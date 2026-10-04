import themeSelectorTemplate from '../../components/theme-selector.html?raw';
import sunIcon from '../../assets/icons/theme/sun.svg';
import moonIcon from '../../assets/icons/theme/moon.svg';
import matchaIcon from '../../assets/icons/theme/matcha.svg';
import coffeeIcon from '../../assets/icons/theme/coffee.svg';
import blueIcon from '../../assets/icons/theme/blue.svg';
import violetIcon from '../../assets/icons/theme/violet.svg';
import chevronIcon from '../../assets/icons/theme/chevron-down.svg';

const THEME_KEY = 'theme-preference';

const THEMES = {
  light: { label: 'Light', icon: sunIcon },
  dark: { label: 'Dark', icon: moonIcon },
  matcha: { label: 'Matcha', icon: matchaIcon },
  cafe: { label: 'Café', icon: coffeeIcon },
  blue: { label: 'Blue', icon: blueIcon },
  violet: { label: 'Violet', icon: violetIcon },
};

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY);
}

function storeTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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
    if (!this.querySelector('[data-theme-toggle]')) {
      this.render();
    }

    this.toggle = this.querySelector('[data-theme-toggle]');
    this.menu = this.querySelector('[data-theme-menu]');
    this.chevron = this.querySelector('[data-theme-chevron]');
    this.chevron.src = chevronIcon;
    this.querySelectorAll('[data-theme-icon-option]').forEach((icon) => {
      icon.src = THEMES[icon.dataset.themeIconOption].icon;
    });

    const stored = getStoredTheme();
    this.applyTheme(stored && THEMES[stored] ? stored : getSystemTheme());

    this.toggle.addEventListener('click', this.handleToggle);
    this.addEventListener('click', this.handleOptionClick);
    document.addEventListener('click', this.handleOutsideClick);
    document.addEventListener('keydown', this.handleKeydown);
  }

  disconnectedCallback() {
    this.toggle?.removeEventListener('click', this.handleToggle);
    this.removeEventListener('click', this.handleOptionClick);
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleKeydown);
  }

  render() {
    this.innerHTML = themeSelectorTemplate;
  }

  applyTheme(theme) {
    const themeData = THEMES[theme];
    document.documentElement.dataset.theme = theme;
    this.querySelector('[data-theme-icon]').src = themeData.icon;
    this.querySelector('[data-theme-label]').textContent = themeData.label;

    this.querySelectorAll('[role="option"]').forEach((option) => {
      const isSelected = option.dataset.theme === theme;
      option.setAttribute('aria-selected', String(isSelected));
      option.setAttribute('aria-disabled', String(isSelected));
    });
  }

  setMenuOpen(isOpen) {
    this.menu.classList.toggle('hidden', !isOpen);
    this.toggle.setAttribute('aria-expanded', String(isOpen));
    this.chevron.style.transform = isOpen ? 'rotate(180deg)' : '';
  }

  handleToggle(event) {
    event.stopPropagation();
    this.setMenuOpen(this.menu.classList.contains('hidden'));
  }

  handleOptionClick(event) {
    const option = event.target.closest('[role="option"][data-theme]');
    if (!option || !this.contains(option)) return;
    if (option.getAttribute('aria-disabled') === 'true') return;

    const selected = option.dataset.theme;
    if (!THEMES[selected]) return;

    storeTheme(selected);
    this.applyTheme(selected);
    this.setMenuOpen(false);
  }

  handleOutsideClick(event) {
    if (!this.menu.classList.contains('hidden') && !this.contains(event.target)) {
      this.setMenuOpen(false);
    }
  }

  handleKeydown(event) {
    if (event.key === 'Escape' && !this.menu.classList.contains('hidden')) {
      this.setMenuOpen(false);
      this.toggle.focus();
    }
  }
}

customElements.define('theme-selector', ThemeSelector);