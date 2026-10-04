import headerTemplate from '../../components/header.html?raw';
import logoUrl from '../../assets/icons/logo.png';

class HeaderComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = headerTemplate;
    this.querySelector('[data-brand-logo]').src = logoUrl;
  }
}

customElements.define('app-header', HeaderComponent);
