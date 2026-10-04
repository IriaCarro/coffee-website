import footerTemplate from '../../components/footer.html?raw';
import logoUrl from '../../assets/icons/logo.png';

class FooterComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = footerTemplate;
    this.querySelector('[data-brand-logo]').src = logoUrl;
  }
}

customElements.define('app-footer', FooterComponent);
