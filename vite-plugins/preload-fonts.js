// Preloads the fonts every page paints with (Playfair Display 700 for the
// headings, Roboto variable for the body text) so they arrive with the
// stylesheet and the first paint already uses them. Without it the page
// paints with the fallback fonts, which have other widths: long titles such
// as "Configura tu Suscripción" wrap to two lines on mobile and jump back to
// one when the font swaps in (a 0.074 layout shift). The file names carry a
// build hash, so the tags are written from the bundle. Only the latin subset
// is preloaded: the other subsets are never downloaded for Spanish text.
const FONT_PATTERN =
  /(playfair-display-latin-700-normal|roboto-latin-wght-normal)-[\w-]+\.woff2$/;

export default function preloadFonts() {
  return {
    name: "preload-fonts",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler: (html, { bundle }) => {
        const preloads = Object.keys(bundle ?? {})
          .filter((file) => FONT_PATTERN.test(file))
          .map(
            (file) =>
              `<link rel="preload" as="font" type="font/woff2" crossorigin href="/${file}">\n    `,
          )
          .join("");
        return html.replace(
          '<link rel="stylesheet"',
          `${preloads}<link rel="stylesheet"`,
        );
      },
    },
  };
}
