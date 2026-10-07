import fs from "node:fs";
import path from "node:path";
import { renderTemplate } from "../src/js/utils/template.js";

const escapeAttribute = (text) =>
  text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Generates one static page per coffee in coffees.json at /coffees/<id>/
export default function coffeePages() {
  let root = process.cwd();

  const read = (file) => fs.readFileSync(path.resolve(root, file), "utf-8");
  const getCoffees = () => JSON.parse(read("src/data/coffees.json"));
  const pageFile = (id) => path.resolve(root, "coffees", id, "index.html");

  const renderPage = (coffee) => {
    const flavorProfileHtml = coffee.flavorProfile
      .map((flavor) =>
        renderTemplate(
          read("src/components/coffee-detail-flavor.html"),
          flavor,
        ),
      )
      .join("");
    const detail = renderTemplate(read("src/components/coffee-detail.html"), {
      ...coffee,
      formattedPrice: coffee.price.toFixed(2).replace(".", ","),
      stars: "★".repeat(coffee.rating),
      flavorProfileHtml,
    });
    return renderTemplate(read("src/templates/coffee-page.html"), {
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
            input: getCoffees().map(({ id }) => pageFile(id)),
          },
        },
      };
    },

    resolveId(id) {
      return getCoffees().some((coffee) => pageFile(coffee.id) === id)
        ? id
        : null;
    },

    load(id) {
      const coffee = getCoffees().find((item) => pageFile(item.id) === id);
      return coffee ? renderPage(coffee) : null;
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const id = req.url?.match(/^\/coffees\/([^/?#]+)\/?(?:[?#].*)?$/)?.[1];
        const coffee = getCoffees().find((item) => item.id === id);
        if (!coffee) return next();

        const html = await server.transformIndexHtml(
          req.url,
          renderPage(coffee),
        );
        res.setHeader("Content-Type", "text/html");
        res.end(html);
      });
    },

    handleHotUpdate({ file, server }) {
      if (
        /src\/(templates\/coffee-page|components\/coffee-detail[^/]*|data\/coffees\.json)/.test(
          file,
        )
      ) {
        server.ws.send({ type: "full-reload" });
      }
    },
  };
}
