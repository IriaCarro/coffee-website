// Replaces {{path.to.value}} placeholders in an HTML template with data values.
export const renderTemplate = (template, data) =>
  template.replace(
    /\{\{\s*([\w.-]+)\s*\}\}/g,
    (_, path) =>
      path.split(".").reduce((value, key) => value?.[key], data) ?? "",
  );

export const formatPrice = (price) => `${price.toFixed(2).replace(".", ",")} €`;

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
  packImage200: imageVariant(coffee.packImage, 200),
  packImage300: imageVariant(coffee.packImage, 300),
  packImage400: imageVariant(coffee.packImage, 400),
  formattedPrice: formatPrice(coffee.price),
});

// The first image of a list is the LCP element: load it right away
export const lcpPriority = (index) =>
  index === 0
    ? { loading: "eager", priority: "high" }
    : { loading: "lazy", priority: "auto" };
