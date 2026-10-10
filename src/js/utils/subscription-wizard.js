import { validateFields } from "../lib/form-validation.js";
import { initSubscriptionOptions } from "./subscription-options.js";
import { renderProgress } from "./wizard-progress.js";

const stepSelector = (step) => `[data-wizard-step="${step}"]`;

// Move focus to the step's legend so screen readers announce the change
const focusStep = (form, step) => {
  const legend = form.querySelector(`${stepSelector(step)} legend`);
  if (!legend) return;
  legend.tabIndex = -1;
  legend.focus();
};

const showConfirmation = (email) => {
  const wizard = document.getElementById("subscription__wizard");
  const confirmation = document.getElementById("subscription__confirmation");
  const emailLabel = document.getElementById(
    "subscription__confirmation-email",
  );
  if (!wizard || !confirmation) return;

  if (email && emailLabel) emailLabel.textContent = email;
  wizard
    .querySelectorAll(":scope > :not(#subscription__confirmation)")
    .forEach((el) => (el.hidden = true));
  confirmation.hidden = false;
  document.getElementById("subscription__confirmation-title")?.focus();
};

// There is no backend yet: log the data instead of sending it
const submitForm = (form) => {
  const data = Object.fromEntries(new FormData(form));
  console.info(
    "[Suscripción] Aún no se gestiona el envío del formulario. Datos recogidos:",
    data,
  );
  showConfirmation(data.email);
};

const initSubscriptionWizard = () => {
  const form = document.getElementById("subscription__form");
  if (!form) return;

  const steps = form.querySelectorAll("[data-wizard-step]");
  const totalSteps = steps.length;
  let currentStep = 1;

  const goToStep = (step) => {
    if (step < 1 || step > totalSteps) return;
    currentStep = step;
    renderProgress(steps, currentStep);
    focusStep(form, step);
  };

  const nextStep = () => {
    if (!validateFields(form.querySelector(stepSelector(currentStep)))) return;
    if (currentStep < totalSteps) goToStep(currentStep + 1);
    else submitForm(form);
  };

  document
    .getElementById("subscription__btn-next")
    ?.addEventListener("click", nextStep);
  document
    .getElementById("subscription__btn-prev")
    ?.addEventListener("click", () => goToStep(currentStep - 1));

  renderProgress(steps, currentStep);
};

initSubscriptionOptions();
initSubscriptionWizard();
