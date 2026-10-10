import fs from "node:fs";
import path from "node:path";

// Shared by the i18n, html-components and coffee-pages plugins. Spanish is
// the source language: it lives at the site root and in src/data/*.json;
// every other locale gets its own /<locale>/ copy of the pages.
export const DEFAULT_LOCALE = "es";
export const EXTRA_LOCALES = ["gl", "ca"];
export const LOCALE_PREFIX = new RegExp(`^/(${EXTRA_LOCALES.join("|")})(?=/)`);

export const localeFromPath = (requestPath = "/") =>
  requestPath.match(LOCALE_PREFIX)?.[1] ?? DEFAULT_LOCALE;

export const localizedUrl = (url, locale) =>
  locale === DEFAULT_LOCALE ? url : `/${locale}${url}`;

export const readLocale = (root, locale) =>
  JSON.parse(
    fs.readFileSync(
      path.resolve(root, "src/locales", `${locale}.json`),
      "utf-8",
    ),
  );

export const lookup = (dictionary, key) =>
  key.split(".").reduce((value, part) => value?.[part], dictionary);

// Overlays a translation on the Spanish value: objects merge by key and
// arrays by position, so a translation only lists the fields it changes
const overlay = (base, translation) => {
  if (translation === undefined) return base;
  if (Array.isArray(base))
    return base.map((item, index) => overlay(item, translation[index]));
  if (base && typeof base === "object")
    return Object.fromEntries(
      Object.entries(base).map(([key, value]) => [
        key,
        overlay(value, translation[key]),
      ]),
    );
  return translation;
};

// Translations of src/data/<collection>.json live in each locale file under
// data.<collection>.<item id>
export const localizeItem = (root, locale, collection, item) =>
  locale === DEFAULT_LOCALE
    ? item
    : overlay(item, readLocale(root, locale).data?.[collection]?.[item.id]);
