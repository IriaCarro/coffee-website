// Replaces {{path.to.value}} placeholders in an HTML template with data values.
export const renderTemplate = (template, data) =>
  template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path) =>
    path.split('.').reduce((value, key) => value?.[key], data) ?? ''
  );
