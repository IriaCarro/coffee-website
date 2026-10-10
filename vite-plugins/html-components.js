import fs from "node:fs";
import path from "node:path";
import {
  coffeeFields,
  formatPrice,
  imageVariants,
  lcpPriority,
  renderTemplate,
} from "../src/js/lib/template.js";
import { localeFromPath, localizeItem } from "./locales.js";

// Build-time components: <name attr="...">slot</name> is replaced by
// src/components/<group>/<name>.html, so pages ship as plain static HTML.
// Attributes fill {{attr}} placeholders and the inner HTML fills {{slot}}.
// Each entry is a component and the attribute values used when a page leaves
// them out.
const COMPONENTS = {
  "app-footer": { class: "", year: String(new Date().getFullYear()) },
  "app-header": {},
  "back-link": { href: "/", label: "{{t:common.backHome}}" },
  "contact-item": {},
  "cta-card": {},
  "form-field": { type: "text", autocomplete: "off", class: "", extra: "" },
  "form-textarea": { rows: "5", class: "" },
  "gallery-lightbox": {},
  "home-section": { class: "" },
  "page-header": { class: "mb-8 text-center sm:mb-12" },
  "section-body": { class: "max-w-6xl" },
  "section-navigation-links": {},
  "social-links": {},
  "spec-item": {},
  "theme-selector-menu": {},
};

// <repeat data="menu" component="menu-item"></repeat> renders the component
// once per item of src/data/<data>.json; COLLECTIONS adds the derived fields.
const COLLECTIONS = {
  // "checked" pre-selects the first coffee of the subscription wizard
  coffees: (item, index, { lcp }) => ({
    ...coffeeFields(item),
    ...(lcp ? lcpPriority(index) : { loading: "lazy", priority: "auto" }),
    checked: index === 0 ? "checked" : "",
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
    // Rendered width of the tile per breakpoint: the featured tile spans 2 of
    // the 3 columns from lg (1024px) and 1 of 2 from sm (640px)
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
    `<(${Object.keys(COMPONENTS).join("|")})\\b([^>]*)>([\\s\\S]*?)<\\/\\1\\s*>`,
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
  // lazy when the list sits below the fold (otherwise the first one loads
  // eagerly as the page's LCP candidate). Items are translated to the page's
  // locale before the derived fields are added.
  const repeat = (html, locale) =>
    html.replace(repeatPattern, (_, attributes) => {
      const { data, component, limit, lcp } = parseAttributes(attributes);
      const template = readComponent(component);
      const options = { lcp: lcp !== "false", read: readCollection };
      return readCollection(data)
        .slice(0, limit ? Number(limit) : undefined)
        .map((item) => localizeItem(root, locale, data, item))
        .map((item, index) =>
          renderTemplate(template, COLLECTIONS[data](item, index, options)),
        )
        .join("");
    });

  const expandOnce = (html, locale) =>
    repeat(html, locale).replace(pattern, (_, name, attributes, slot) =>
      renderTemplate(readComponent(name), {
        ...COMPONENTS[name],
        ...parseAttributes(attributes),
        slot,
      }),
    );

  // Components may contain other components, so expand until nothing changes
  const expand = (html, locale) => {
    for (let pass = 0; pass < 5; pass += 1) {
      const next = expandOnce(html, locale);
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
    transformIndexHtml: {
      order: "pre",
      handler: (html, ctx) => expand(html, localeFromPath(ctx.path)),
    },
  };
}
