import { setAttributeOrRemove } from "../lib/aria.js";

const renderIndicators = (currentStep) => {
  document
    .querySelectorAll("#subscription__progress-steps [data-step]")
    .forEach((indicator) => {
      const stepNumber = Number(indicator.dataset.step);
      indicator.toggleAttribute("data-completed", stepNumber < currentStep);
      setAttributeOrRemove(
        indicator,
        "aria-current",
        stepNumber === currentStep ? "step" : null,
      );
    });
};

const renderBar = (currentStep, totalSteps) => {
  // Width comes from the data-[step=N]: utilities on the bar
  const bar = document.getElementById("subscription__progress-bar");
  if (bar) bar.dataset.step = String(currentStep);

  const track = document.getElementById("subscription__progress-track");
  if (!track) return;
  track.setAttribute("aria-valuemax", String(totalSteps));
  track.setAttribute("aria-valuenow", String(currentStep));
  // "Paso {step} de {total}", translated at build in data-step-text
  track.setAttribute(
    "aria-valuetext",
    track.dataset.stepText
      .replace("{step}", currentStep)
      .replace("{total}", totalSteps),
  );
};

const renderControls = (currentStep, totalSteps) => {
  const previous = document.getElementById("subscription__btn-prev");
  const next = document.getElementById("subscription__btn-next");
  const label = document.getElementById("subscription__current-step");
  if (previous) previous.disabled = currentStep === 1;
  if (next) {
    const isLast = currentStep === totalSteps;
    // Both labels come translated from data-* attributes on the button
    next.querySelector("[data-next-label]").textContent = isLast
      ? next.dataset.finishText
      : next.dataset.nextText;
    next.querySelector("[data-next-icon]").hidden = isLast;
  }
  if (label) label.textContent = currentStep;
};

// Shows the fieldset of the current step and syncs the progress UI with it
export const renderProgress = (steps, currentStep) => {
  const totalSteps = steps.length;
  steps.forEach((step) => {
    step.hidden = Number(step.dataset.wizardStep) !== currentStep;
  });
  renderIndicators(currentStep);
  renderBar(currentStep, totalSteps);
  renderControls(currentStep, totalSteps);
};
