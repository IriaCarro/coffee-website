// Replaces {{path.to.value}} placeholders in an HTML template with data values.
export const renderTemplate = (template, data) =>
  template.replace(
    /\{\{\s*([\w.-]+)\s*\}\}/g,
    (_, path) =>
      path.split(".").reduce((value, key) => value?.[key], data) ?? "",
  );

// Photos ship next to their resized copies: pack.webp, pack-400.webp...
export const imageVariant = (src, width) =>
  src.replace(".webp", `-${width}.webp`);

export const formatPrice = (price) => `${price.toFixed(2).replace(".", ",")} €`;
