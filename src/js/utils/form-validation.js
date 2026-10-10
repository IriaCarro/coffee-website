import { FIELD_SELECTOR, validateField } from "../lib/form-validation.js";

// Live validation for every form[data-validated]: a field is checked when it
// loses focus, and again on each keystroke while it is marked invalid
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
