import fs from "node:fs";
import path from "node:path";

// Writes public/theme-init.js into each page instead of linking it: it must
// run before the first paint, and inline it costs no extra request. The
// stylesheet stays a separate file: inlining it too (about 85 kB per page)
// removed the render-blocking request but did not improve the Lighthouse
// scores, and some pages got slower.
export default function inlineThemeScript() {
  let root = process.cwd();

  return {
    name: "inline-theme-script",
    configResolved(config) {
      root = config.root;
    },
    transformIndexHtml: {
      order: "post",
      handler: (html) =>
        html.replace(/<script src="\/theme-init\.js"><\/script>/, () => {
          const code = fs.readFileSync(
            path.resolve(root, "public/theme-init.js"),
            "utf-8",
          );
          return `<script>${code}</script>`;
        }),
    },
  };
}
