import fs from "node:fs";
import path from "node:path";
import {
  coffeeFields,
  formatPrice,
  imageVariants,
  lcpPriority,
  renderTemplate,
} from "../src/js/lib/template.js";

// Build-time components: <name attr="...">slot</name> is replaced by
// src/components/<name>.html, so pages ship as plain static HTML.
// Attributes fill {{attr}} placeholders and the inner HTML fills {{slot}}.
const COMPONENTS = [
  "app-footer",
  "app-header",
  "back-link",
  "contact-item",
  "cta-card",
  "faq-item",
  "form-field",
  "form-textarea",
  "home-section",
  "page-header",
];

// Attribute values used when a page leaves them out
const DEFAULTS = {
  "app-footer": { class: "", year: String(new Date().getFullYear()) },
  "back-link": { href: "/", label: "Volver al inicio" },
  "form-field": { type: "text", autocomplete: "off", class: "", extra: "" },
  "form-textarea": { rows: "5", class: "" },
  "home-section": { class: "" },
  "page-header": { class: "mb-8 text-center sm:mb-12" },
};

// <repeat data="menu" component="menu-item"></repeat> renders the component
// once per item of src/data/<data>.json; COLLECTIONS adds the derived fields.
const COLLECTIONS = {
  coffees: (item, index) => ({
    ...coffeeFields(item),
    ...lcpPriority(index),
  }),
  menu: (item) => ({
    ...item,
    ...imageVariants(item.image),
    formattedPrice: formatPrice(item.price),
  }),
  gallery: (item, index) => ({
    ...item,
    ...imageVariants(item.image),
    ...lcpPriority(index),
    sizes: item.featured
      ? "(min-width: 1024px) 66vw, (min-width: 640px) 50vw, 100vw"
      : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
    layout: item.featured ? "lg:col-span-2 lg:row-span-2" : "",
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
    `<(${COMPONENTS.join("|")})\\b([^>]*)>([\\s\\S]*?)<\\/\\1\\s*>`,
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
        ...DEFAULTS[name],
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
