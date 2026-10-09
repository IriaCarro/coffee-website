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
// src/components/<group>/<name>.html, so pages ship as plain static HTML.
// Attributes fill {{attr}} placeholders and the inner HTML fills {{slot}}.
const COMPONENTS = [
  "app-footer",
  "app-header",
  "back-link",
  "contact-item",
  "cta-card",
  "form-field",
  "form-textarea",
  "home-section",
  "page-header",
  "section-body",
  "social-links",
  "spec-item",
];

// Attribute values used when a page leaves them out
const DEFAULTS = {
  "app-footer": { class: "", year: String(new Date().getFullYear()) },
  "back-link": { href: "/", label: "Volver al inicio" },
  "form-field": { type: "text", autocomplete: "off", class: "", extra: "" },
  "form-textarea": { rows: "5", class: "" },
  "home-section": { class: "" },
  "section-body": { class: "max-w-6xl" },
  "page-header": { class: "mb-8 text-center sm:mb-12" },
};

// <repeat data="menu" component="menu-item"></repeat> renders the component
// once per item of src/data/<data>.json; COLLECTIONS adds the derived fields.
const COLLECTIONS = {
  coffees: (item, index, { lcp }) => ({
    ...coffeeFields(item),
    ...(lcp ? lcpPriority(index) : { loading: "lazy", priority: "auto" }),
  }),
  faq: (item) => item,
  // Prices follow the coffee: "from" uses the cheapest one, "default" the
  // first one, which is the pre-selected option of the subscription wizard
  plans: (item, index, { read }) => {
    const prices = read("coffees").map(({ price }) => price);
    return {
      ...item,
      fromPrice: formatPrice(Math.min(...prices) * item.bags),
      defaultPrice: formatPrice(prices[0] * item.bags),
      checked: item.featured ? "checked" : "",
    };
  },
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

  // Components live in subfolders by area; the tag name is the file name
  let componentFiles = {};
  const indexComponents = () => {
    const dir = path.resolve(root, "src/components");
    componentFiles = Object.fromEntries(
      fs
        .readdirSync(dir, { recursive: true })
        .filter((file) => file.endsWith(".html"))
        .map((file) => [path.basename(file, ".html"), path.join(dir, file)]),
    );
  };

  const readComponent = (name) => {
    if (!componentFiles[name]) indexComponents();
    return fs.readFileSync(componentFiles[name], "utf-8");
  };

  const readCollection = (name) =>
    JSON.parse(
      fs.readFileSync(path.resolve(root, "src/data", `${name}.json`), "utf-8"),
    );

  // limit="3" renders only the first items; lcp="false" keeps their images
  // lazy when the list sits below the fold
  const repeat = (html) =>
    html.replace(repeatPattern, (_, attributes) => {
      const { data, component, limit, lcp } = parseAttributes(attributes);
      const template = readComponent(component);
      const options = { lcp: lcp !== "false", read: readCollection };
      return readCollection(data)
        .slice(0, limit ? Number(limit) : undefined)
        .map((item, index) =>
          renderTemplate(template, COLLECTIONS[data](item, index, options)),
        )
        .join("");
    });

  const expandOnce = (html) =>
    repeat(html).replace(pattern, (_, name, attributes, slot) =>
      renderTemplate(readComponent(name), {
        ...DEFAULTS[name],
        ...parseAttributes(attributes),
        slot,
      }),
    );

  // Components may contain other components, so expand until nothing changes
  const expand = (html) => {
    for (let pass = 0; pass < 5; pass += 1) {
      const next = expandOnce(html);
      if (next === html) break;
      html = next;
    }
    return html;
  };

  return {
    name: "html-components",
    configResolved(config) {
      root = config.root;
    },
    transformIndexHtml: { order: "pre", handler: expand },
  };
}
