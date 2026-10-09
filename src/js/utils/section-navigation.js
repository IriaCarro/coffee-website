import sectionNavigationTemplate from "../../components/section-navigation.html?raw";

class SectionNavigation extends HTMLElement {
  constructor() {
    super();
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.scheduleUpdate = this.scheduleUpdate.bind(this);
  }

  connectedCallback() {
    if (!this.querySelector("[data-section-link]")) {
      this.innerHTML = sectionNavigationTemplate;
    }

    this.links = this.querySelectorAll("[data-section-link]");
    this.addEventListener("click", this.handleLinkClick);
    this.sections = [...this.links]
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    this.syncHeaderHeight();

    window.addEventListener("scroll", this.scheduleUpdate, { passive: true });
    window.addEventListener("resize", this.scheduleUpdate);
    this.updateCurrent();
  }

  scheduleUpdate() {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.updateCurrent();
    });
  }

  // The active section is the last one whose top has passed a probe line
  // placed a quarter of the way down the area below the header. Reading
  // positions directly (instead of IntersectionObserver entries) keeps the
  // result right after instant jumps, where a section that merely touches
  // the viewport edge used to be picked.
  updateCurrent() {
    const headerHeight = this.getHeaderHeight();
    const probe = headerHeight + (window.innerHeight - headerHeight) * 0.25;
    const atBottom =
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 2;

    const active = atBottom
      ? this.sections.at(-1)
      : ([...this.sections]
          .reverse()
          .find((section) => section.getBoundingClientRect().top <= probe) ??
        this.sections[0]);

    this.links.forEach((link) => {
      if (link.hash === `#${active.id}`) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  getHeaderHeight() {
    const header = document.querySelector("[data-site-header]");
    if (header) return header.offsetHeight;
    return (
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height",
        ),
      ) || 0
    );
  }

  syncHeaderHeight() {
    const attach = (header) => {
      // A constructed stylesheet avoids writing an inline style attribute
      const sheet = new CSSStyleSheet();
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
      this.headerObserver = new ResizeObserver(() => {
        sheet.replaceSync(
          `:root { --header-height: ${header.offsetHeight}px; }`,
        );
      });
      this.headerObserver.observe(header);
    };

    const header = document.querySelector("[data-site-header]");
    if (header) return attach(header);

    this.headerWatcher = new MutationObserver(() => {
      const found = document.querySelector("[data-site-header]");
      if (!found) return;
      this.headerWatcher.disconnect();
      attach(found);
    });
    this.headerWatcher.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleLinkClick);
    window.removeEventListener("scroll", this.scheduleUpdate);
    window.removeEventListener("resize", this.scheduleUpdate);
    cancelAnimationFrame(this.frame);
    this.headerObserver?.disconnect();
    this.headerWatcher?.disconnect();
  }

  handleLinkClick(event) {
    const link = event.target.closest("[data-section-link]");
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

    const section = document.querySelector(link.getAttribute("href"));
    if (!section) return;

    event.preventDefault();
    if (window.location.hash !== link.hash) {
      window.history.pushState(null, "", link.hash);
    }
    section.scrollIntoView({ behavior: "instant", block: "start" });
  }
}

customElements.define("section-navigation", SectionNavigation);
