const HEADER_SELECTOR = "[data-site-header]";

// Mirrors the sticky header height into --header-height (used by sections to
// size themselves and by the menu panel). A constructed stylesheet avoids
// writing an inline style attribute.
export const syncHeaderHeight = () => {
  const header = document.querySelector(HEADER_SELECTOR);
  if (!header) return () => {};

  const sheet = new CSSStyleSheet();
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  const observer = new ResizeObserver(() => {
    sheet.replaceSync(`:root { --header-height: ${header.offsetHeight}px; }`);
  });
  observer.observe(header);
  return () => observer.disconnect();
};

export const getHeaderHeight = () =>
  document.querySelector(HEADER_SELECTOR)?.offsetHeight ?? 0;
