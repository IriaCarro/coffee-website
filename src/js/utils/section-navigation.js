import sectionNavigationTemplate from '../../components/section-navigation.html?raw';

class SectionNavigation extends HTMLElement {
  constructor() {
    super();
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  connectedCallback() {
    if (!this.querySelector('.section-nav-link')) {
      this.innerHTML = sectionNavigationTemplate;
    }

    this.links = this.querySelectorAll('.section-nav-link');
    this.addEventListener('click', this.handleLinkClick);
    this.sections = [...this.links]
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    this.syncHeaderHeight();
    const headerHeight = this.getHeaderHeight();
    const rootMargin = `${-headerHeight}px 0px -50% 0px`;

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);
        if (!visibleSection) return;

        this.links.forEach((link) => {
          if (link.hash === `#${visibleSection.target.id}`) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      },
      { rootMargin },
    );

    this.sections.forEach((section) => this.sectionObserver.observe(section));
  }

  getHeaderHeight() {
    const header = document.querySelector('.site-header');
    if (header) return header.offsetHeight;
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0;
  }

  syncHeaderHeight() {
    const attach = (header) => {
      this.headerObserver = new ResizeObserver(() => {
        document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
      });
      this.headerObserver.observe(header);
    };

    const header = document.querySelector('.site-header');
    if (header) return attach(header);

    this.headerWatcher = new MutationObserver(() => {
      const found = document.querySelector('.site-header');
      if (!found) return;
      this.headerWatcher.disconnect();
      attach(found);
    });
    this.headerWatcher.observe(document.body, { childList: true, subtree: true });
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleLinkClick);
    this.sectionObserver?.disconnect();
    this.headerObserver?.disconnect();
    this.headerWatcher?.disconnect();
  }

  handleLinkClick(event) {
    const link = event.target.closest('.section-nav-link');
    if (
      !link ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const section = document.querySelector(link.getAttribute('href'));
    if (!section) return;

    event.preventDefault();
    if (window.location.hash !== link.hash) {
      window.history.pushState(null, '', link.hash);
    }
    section.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
}

customElements.define('section-navigation', SectionNavigation);
