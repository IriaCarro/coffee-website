import headerTemplate from "../components/header.html?raw";
class HeaderComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = headerTemplate;
    this.querySelector("[data-brand-logo]").src = "/icons/logo.webp";
  }
}

customElements.define("app-header", HeaderComponent);
