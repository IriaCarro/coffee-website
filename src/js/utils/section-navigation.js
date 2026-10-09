import sectionNavigationTemplate from "../../components/layout/section-navigation.html?raw";
import { setAttributeOrRemove } from "../lib/aria.js";

// The active section is the last one whose top passed a probe line placed
// this fraction of the way down the area below the header
const PROBE_RATIO = 0.25;
// Pixels from the page bottom that still count as "at the bottom"
const BOTTOM_TOLERANCE = 2;

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

  // Reading positions directly (instead of IntersectionObserver entries) keeps the
  // result right after instant jumps, where a section that merely touches
  // the viewport edge used to be picked.
  updateCurrent() {
    const headerHeight =
      document.querySelector("[data-site-header]")?.offsetHeight ?? 0;
    const probe =
      headerHeight + (window.innerHeight - headerHeight) * PROBE_RATIO;
    const atBottom =
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - BOTTOM_TOLERANCE;

    const active = atBottom
      ? this.sections.at(-1)
      : ([...this.sections]
          .reverse()
          .find((section) => section.getBoundingClientRect().top <= probe) ??
        this.sections[0]);

    this.links.forEach((link) => {
      setAttributeOrRemove(
        link,
        "aria-current",
        link.hash === `#${active.id}` ? "location" : null,
      );
    });
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleLinkClick);
    window.removeEventListener("scroll", this.scheduleUpdate);
    window.removeEventListener("resize", this.scheduleUpdate);
    cancelAnimationFrame(this.frame);
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
