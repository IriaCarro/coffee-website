import fs from "node:fs";
import path from "node:path";
import { coffeeFields, renderTemplate } from "../src/js/lib/template.js";
import { coffeeUrl } from "./coffee-urls.js";
import {
  DEFAULT_LOCALE,
  EXTRA_LOCALES,
  localizeItem,
  localizedUrl,
} from "./locales.js";

const LOCALES = [DEFAULT_LOCALE, ...EXTRA_LOCALES];

const escapeAttribute = (text) =>
  text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Generates one static page per coffee in coffees.json at /coffees/<id>/,
// plus its translated copies at /<locale>/coffees/<id>/
export default function coffeePages() {
  let root = process.cwd();

  const read = (file) => fs.readFileSync(path.resolve(root, file), "utf-8");
  // Parsed once per build and again after coffees.json changes in dev
  let coffees;
  const getCoffees = () =>
    (coffees ??= JSON.parse(read("src/data/coffees.json")));
  const pageFile = (locale, id) =>
    path.join(root, localizedUrl(coffeeUrl(id), locale), "index.html");
  const pages = () =>
    LOCALES.flatMap((locale) =>
      getCoffees().map((coffee) => ({ locale, coffee })),
    );
  const findPage = (id) =>
    pages().find(({ locale, coffee }) => pageFile(locale, coffee.id) === id);

  const renderPage = (source, locale) => {
    const coffee = localizeItem(root, locale, "coffees", source);
    const flavorProfileHtml = coffee.flavorProfile
      .map((flavor) =>
        renderTemplate(
          read("src/components/coffee/coffee-detail-flavor.html"),
          flavor,
        ),
      )
      .join("");
    const detail = renderTemplate(
      read("src/components/coffee/coffee-detail.html"),
      {
        ...coffeeFields(coffee),
        stars:
          '<span class="icon mask-[url(/icons/ui/star.svg)]"></span>'.repeat(
            coffee.rating,
          ),
        flavorProfileHtml,
      },
    );
    return renderTemplate(read("src/pages/coffee-page.html"), {
      name: coffee.name,
      metaDescription: escapeAttribute(
        `${coffee.name}: ${coffee.description}. ${coffee.origin}, ${coffee.roast}.`,
      ),
      detail,
    });
  };

  return {
    name: "coffee-pages",

    config(config) {
      root = path.resolve(config.root ?? process.cwd());
      return {
        build: {
          rollupOptions: {
            input: pages().map(({ locale, coffee }) =>
              pageFile(locale, coffee.id),
            ),
          },
        },
      };
    },

    resolveId(id) {
      return findPage(id) ? id : null;
    },

    load(id) {
      const page = findPage(id);
      return page ? renderPage(page.coffee, page.locale) : null;
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const page = pages().find(({ locale, coffee }) =>
          new RegExp(
            `^${localizedUrl(coffeeUrl(coffee.id), locale)}?(?:[?#].*)?$`,
          ).test(req.url ?? ""),
        );
        if (!page) return next();

        const html = await server.transformIndexHtml(
          req.url,
          renderPage(page.coffee, page.locale),
        );
        res.setHeader("Content-Type", "text/html");
        res.end(html);
      });
    },

    handleHotUpdate({ file, server }) {
      coffees = undefined;
      if (
        /src\/(pages\/coffee-page|components\/coffee\/|data\/coffees\.json|locales\/)/.test(
          file,
        )
      ) {
        server.ws.send({ type: "full-reload" });
      }
    },
  };
}
