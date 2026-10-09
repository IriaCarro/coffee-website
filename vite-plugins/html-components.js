import fs from "node:fs";
import path from "node:path";
import {
  formatPrice,
  imageVariant,
  renderTemplate,
} from "../src/js/utils/template.js";

// Build-time components: <name attr="...">slot</name> is replaced by
// src/components/<name>.html, so pages ship as plain static HTML.
// Attributes fill {{attr}} placeholders and the inner HTML fills {{slot}}.
const COMPONENTS = {
  "back-link": { href: "/", label: "Volver al inicio" },
  "page-header": { class: "mb-8 text-center sm:mb-12" },
  "cta-card": {},
  "contact-item": {},
  "faq-item": {},
  "form-field": {
    type: "text",
    autocomplete: "off",
    class: "",
    extra: "",
  },
  "form-textarea": { rows: "5", class: "" },
  "app-header": {},
  "app-footer": { class: "" },
};

// <repeat data="menu" component="menu-item"></repeat> renders the component
// once per item of src/data/<data>.json; COLLECTIONS adds the derived fields.
const COLLECTIONS = {
  coffees: (item, index) => ({
    ...item,
    // The first pack is the LCP element: load it right away
    loading: index === 0 ? "eager" : "lazy",
    priority: index === 0 ? "high" : "auto",
    packImage400: imageVariant(item.packImage, 400),
    formattedPrice: formatPrice(item.price),
  }),
  menu: (item) => ({
    ...item,
    image400: imageVariant(item.image, 400),
    image800: imageVariant(item.image, 800),
    formattedPrice: formatPrice(item.price),
  }),
  gallery: (item, index) => ({
    ...item,
    image400: imageVariant(item.image, 400),
    image800: imageVariant(item.image, 800),
    sizes: item.featured
      ? "(min-width: 1024px) 66vw, (min-width: 640px) 50vw, 100vw"
      : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
    // The first photo is the LCP element: load it right away
    loading: index === 0 ? "eager" : "lazy",
    priority: index === 0 ? "high" : "auto",
    modifier: item.featured ? "lg:col-span-2 lg:row-span-2" : "",
  }),
};

const parseAttributes = (source) =>
  Object.fromEntries(
    [...source.matchAll(/([\w-]+)=(?:"([^"]*)"|'([^']*)')/g)].map(
      ([, name, double, single]) => [name, double ?? single],
    ),
  );

export default function htmlComponents() {
  let root = process.cwd();
  const repeatPattern = /<repeat\b([^>]*)>\s*<\/repeat>/g;
  const pattern = new RegExp(
    `<(${Object.keys(COMPONENTS).join("|")})\\b([^>]*)>([\\s\\S]*?)<\\/\\1\\s*>`,
    "g",
  );

  const readComponent = (name) =>
    fs.readFileSync(
      path.resolve(root, "src/components", `${name}.html`),
      "utf-8",
    );

  const readCollection = (name) =>
    JSON.parse(
      fs.readFileSync(path.resolve(root, "src/data", `${name}.json`), "utf-8"),
    );

  const repeat = (html) =>
    html.replace(repeatPattern, (_, attributes) => {
      const { data, component } = parseAttributes(attributes);
      const template = readComponent(component);
      return readCollection(data)
        .map((item, index) =>
          renderTemplate(template, COLLECTIONS[data](item, index)),
        )
        .join("");
    });

  const expand = (html) =>
    repeat(html).replace(pattern, (_, name, attributes, slot) =>
      renderTemplate(readComponent(name), {
        ...COMPONENTS[name],
        ...parseAttributes(attributes),
        slot,
      }),
    );

  return {
    name: "html-components",
    configResolved(config) {
      root = config.root;
    },
    transformIndexHtml: { order: "pre", handler: expand },
  };
}
