import fs from "node:fs";
import path from "node:path";
import {
  DEFAULT_LOCALE,
  EXTRA_LOCALES,
  LOCALE_PREFIX,
  localeFromPath,
  localizedUrl,
  lookup,
  readLocale,
} from "./locales.js";
import { isCoffeeUrl } from "./coffee-urls.js";

// Build-time translations. Every page listed in build.rollupOptions.input is
// also generated at /<locale>/<same path> for each extra locale, so each
// language ships as its own static HTML (no client-side i18n).
//
// In the markup:
// - {{t:about.title}} is replaced by that key of src/locales/<locale>.json
//   (falling back to Spanish while a key is missing);
// - {{lang-url:gl}} is the current page's URL in that locale and
//   {{lang-current:gl}} becomes aria-current="page" on the current locale.
// Internal links to translated pages are rewritten to the same locale, and
// <html lang> is set to the page's locale. The coffee detail pages get their
// /<locale>/ copies from coffee-pages.js.

const escapeQuotes = (text) => text.replace(/"/g, "&quot;");

export default function i18n() {
  let root = process.cwd();
  let pages = []; // source pages relative to root, e.g. "src/pages/about.html"
  const warned = new Set();

  // index.html is served at "/"; every other page keeps its file path
  const pageUrl = (file) => (file === "index.html" ? "/" : `/${file}`);
  const isTranslated = (url) =>
    pages.some((file) => pageUrl(file) === url) || isCoffeeUrl(url);
  const virtualId = (locale, file) => path.resolve(root, locale, file);

  // Splits a request path into its locale and the page URL it points to
  const parsePath = (requestPath) => {
    const clean = requestPath.split(/[?#]/)[0];
    const locale = localeFromPath(clean);
    const base = clean.replace(LOCALE_PREFIX, "").replace(/index\.html$/, "");
    return { locale, base: base || "/" };
  };

  const translate = (html, requestPath) => {
    const { locale, base } = parsePath(requestPath);
    const dictionary = readLocale(root, locale);
    const fallback =
      locale === DEFAULT_LOCALE ? dictionary : readLocale(root, DEFAULT_LOCALE);

    html = html.replace(/\{\{\s*t:([\w.-]+)\s*\}\}/g, (_, key) => {
      const value = lookup(dictionary, key) ?? lookup(fallback, key);
      if (value === undefined && !warned.has(key)) {
        warned.add(key);
        console.warn(`[i18n] missing key "${key}"`);
      }
      return escapeQuotes(value ?? key);
    });

    html = html.replace(/<html lang="[^"]*"/, `<html lang="${locale}"`);

    // Internal links stay in the page's locale. This runs before the language
    // switcher is filled in, so its links to the other locales are kept.
    if (locale !== DEFAULT_LOCALE) {
      html = html.replace(
        /href="(\/[^"#?]*)([#?][^"]*)?"/g,
        (match, url, rest = "") =>
          isTranslated(url)
            ? `href="${localizedUrl(url, locale)}${rest}"`
            : match,
      );
    }

    return (
      html
        // A page without translated copies links to the other locales' home
        .replace(/\{\{\s*lang-url:(\w+)\s*\}\}/g, (_, target) =>
          localizedUrl(isTranslated(base) ? base : "/", target),
        )
        .replace(/\{\{\s*lang-current:(\w+)\s*\}\}/g, (_, target) =>
          target === locale ? 'aria-current="page"' : "",
        )
    );
  };

  const findPage = (locale, id) =>
    pages.find((file) => virtualId(locale, file) === id);

  return {
    name: "i18n",

    configResolved(config) {
      root = config.root;
      const input = config.build.rollupOptions.input ?? [];
      pages = (Array.isArray(input) ? input : Object.values(input))
        .map((file) => path.relative(root, path.resolve(root, file)))
        // Only source pages: not files outside the root, not the coffee
        // pages (coffee-pages.js translates those) and not translated copies
        .filter(
          (file) =>
            !file.startsWith("..") &&
            !isCoffeeUrl(`/${path.dirname(file)}/`) &&
            !LOCALE_PREFIX.test(`/${file}`),
        );
    },

    // Adds /gl/... and /ca/... copies of every page to the build
    options(options) {
      const input = options.input ?? [];
      return {
        ...options,
        input: [
          ...(Array.isArray(input) ? input : Object.values(input)),
          ...EXTRA_LOCALES.flatMap((locale) =>
            pages.map((file) => virtualId(locale, file)),
          ),
        ],
      };
    },

    resolveId(id) {
      return EXTRA_LOCALES.some((locale) => findPage(locale, id)) ? id : null;
    },

    load(id) {
      for (const locale of EXTRA_LOCALES) {
        const file = findPage(locale, id);
        if (file) return fs.readFileSync(path.resolve(root, file), "utf-8");
      }
      return null;
    },

    transformIndexHtml: {
      order: "pre",
      handler: (html, ctx) => translate(html, ctx.path),
    },

    // Serves /gl/... and /ca/... in dev from the same source pages
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const { locale, base } = parsePath(req.url ?? "/");
        const file = pages.find((page) => pageUrl(page) === base);
        if (locale === DEFAULT_LOCALE || !file) return next();

        const html = await server.transformIndexHtml(
          req.url,
          fs.readFileSync(path.resolve(root, file), "utf-8"),
        );
        res.setHeader("Content-Type", "text/html");
        res.end(html);
      });
    },

    handleHotUpdate({ file, server }) {
      if (/src\/locales\/[\w-]+\.json$/.test(file)) {
        server.ws.send({ type: "full-reload" });
      }
    },
  };
}
