import footerTemplate from "../components/footer.html?raw";
class FooterComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = footerTemplate;
    this.querySelector("[data-brand-logo]").src = "/icons/logo.png";
  }
}

customElements.define("app-footer", FooterComponent);
