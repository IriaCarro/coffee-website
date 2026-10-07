const FIELD_SELECTOR = "input:not([type=radio]):not([type=checkbox]), textarea";

const getError = (field) =>
  field.closest("label")?.querySelector(".form-error") ?? null;

// aria-invalid drives the error styles and the message (see ui.css); the
// message is only linked to the field while it is shown
export const validateField = (field) => {
  const invalid = !field.checkValidity();
  const error = getError(field);
  field.setAttribute("aria-invalid", String(invalid));
  if (error && invalid) field.setAttribute("aria-describedby", error.id);
  else field.removeAttribute("aria-describedby");
  return !invalid;
};

// Validates every field in the container and focuses the first invalid one
export const validateFields = (container) => {
  const fields = [...container.querySelectorAll(FIELD_SELECTOR)];
  const invalid = fields.filter((field) => !validateField(field));
  invalid[0]?.focus();
  return invalid.length === 0;
};

const initFormValidation = () => {
  document.querySelectorAll("form[data-validated]").forEach((form) => {
    form.addEventListener("focusout", ({ target }) => {
      if (target.matches(FIELD_SELECTOR)) validateField(target);
    });
    form.addEventListener("input", ({ target }) => {
      if (
        target.matches(FIELD_SELECTOR) &&
        target.getAttribute("aria-invalid") === "true"
      ) {
        validateField(target);
      }
    });
  });
};

initFormValidation();
