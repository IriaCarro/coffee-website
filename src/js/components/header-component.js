import headerTemplate from '../../components/header.html?raw';
class HeaderComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = headerTemplate;
    this.querySelector('[data-brand-logo]').src = '/icons/logo.png';
  }
}

customElements.define('app-header', HeaderComponent);
