import { validateFields } from "../lib/form-validation.js";

// Forms with a data-success-message (the footer newsletter and the contact
// form) have no backend yet: on submit they validate, log the data instead of
// sending it and show the message (translated at build in data-* attributes)
// in their role="status" element
const handleSubmit = (event) => {
  const form = event.currentTarget;
  const status = form.querySelector('[role="status"]');
  event.preventDefault();
  if (!validateFields(form)) {
    status.textContent = form.dataset.invalidMessage;
    return;
  }
  console.info(
    "[Formulario] Aún no se gestiona el envío. Datos recogidos:",
    Object.fromEntries(new FormData(form)),
  );
  status.textContent = form.dataset.successMessage;
  form.reset();
};

document
  .querySelectorAll("form[data-success-message]")
  .forEach((form) => form.addEventListener("submit", handleSubmit));
