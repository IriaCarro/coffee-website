// Marks the page's module scripts and the chunks Vite preloads for them with
// fetchpriority="low". They are deferred, so they never block the first
// paint, but Chrome still requests them at high priority, and Lighthouse's
// mobile simulation counts high-priority requests made before the first paint
// (about 0.3 s of FCP on the pages with several modules). The pages render and
// apply the theme without them (theme-init.js is inline).
export default function lowPriorityScripts() {
  return {
    name: "low-priority-scripts",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler: (html) =>
        html.replace(
          /<(script type="module"|link rel="modulepreload")(?![^>]*fetchpriority)/g,
          '<$1 fetchpriority="low"',
        ),
    },
  };
}
