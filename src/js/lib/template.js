// Replaces {{path.to.value}} placeholders in an HTML template with data values.
export const renderTemplate = (template, data) =>
  template.replace(
    /\{\{\s*([\w.-]+)\s*\}\}/g,
    (_, path) =>
      path.split(".").reduce((value, key) => value?.[key], data) ?? "",
  );

export const formatPrice = (price) => `${price.toFixed(2).replace(".", ",")} €`;

// A plan sends `bags` bags of the chosen coffee each month
export const formatPlanPrice = (coffeePrice, bags) =>
  formatPrice(coffeePrice * bags);

// Photos ship next to their resized copies: pack.webp, pack-400.webp...
export const imageVariant = (src, width) =>
  src.replace(".webp", `-${width}.webp`);

export const imageVariants = (src) => ({
  image400: imageVariant(src, 400),
  image800: imageVariant(src, 800),
});

// Fields every coffee card, option and detail page derives from coffees.json
export const coffeeFields = (coffee) => ({
  ...coffee,
  packImage120: imageVariant(coffee.packImage, 120),
  packImage200: imageVariant(coffee.packImage, 200),
  packImage300: imageVariant(coffee.packImage, 300),
  packImage400: imageVariant(coffee.packImage, 400),
  formattedPrice: formatPrice(coffee.price),
});

// The first image of a list is the LCP (largest contentful paint) element:
// load it right away at high priority and keep the rest lazy. A list below
// the fold (lcp false) keeps every image lazy.
export const lcpPriority = (index, lcp = true) =>
  lcp && index === 0
    ? { loading: "eager", priority: "high" }
    : { loading: "lazy", priority: "auto" };
