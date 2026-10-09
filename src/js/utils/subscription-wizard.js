import coffees from "../../data/coffees.json";
import coffeeOptionTemplate from "../../components/subscription-coffee-option.html?raw";
import { formatPrice, imageVariant, renderTemplate } from "./template.js";
import { validateFields } from "./form-validation.js";

const renderCoffeeOptions = () => {
  const list = document.getElementById("subscription__coffee-options");
  if (!list) return;
  list.innerHTML = coffees
    .map((coffee, index) =>
      renderTemplate(coffeeOptionTemplate, {
        ...coffee,
        packImage400: imageVariant(coffee.packImage, 400),
        formattedPrice: formatPrice(coffee.price),
        checked: index === 0 ? "checked" : "",
      }),
    )
    .join("");
};

function initSubscriptionWizard() {
  const form = document.getElementById("subscription__form");
  if (!form) return;

  const steps = form.querySelectorAll(".wizard__step");
  const indicators = document.querySelectorAll(
    "#subscription__progress-steps [data-step]",
  );
  const progressBar = document.getElementById("subscription__progress-bar");
  const progressTrack = document.getElementById("subscription__progress-track");
  const btnPrev = document.getElementById("subscription__btn-prev");
  const btnNext = document.getElementById("subscription__btn-next");
  const currentStepLabel = document.getElementById(
    "subscription__current-step",
  );

  let currentStep = 1;
  const totalSteps = steps.length;

  const updateUI = () => {
    steps.forEach((step) => {
      const stepNum = parseInt(step.dataset.step);
      step.classList.toggle("wizard__step--active", stepNum === currentStep);
      step.classList.toggle("hidden", stepNum !== currentStep);
    });

    indicators.forEach((indicator) => {
      const stepNum = parseInt(indicator.dataset.step);
      const isActive = stepNum === currentStep;
      const isCompleted = stepNum < currentStep;

      indicator.toggleAttribute("data-completed", isCompleted);
      if (isActive) {
        indicator.setAttribute("aria-current", "step");
      } else {
        indicator.removeAttribute("aria-current");
      }
    });

    // Width comes from the data-[step=N]: utilities on the bar
    if (progressBar) progressBar.dataset.step = String(currentStep);
    if (progressTrack) {
      progressTrack.setAttribute("aria-valuemax", String(totalSteps));
      progressTrack.setAttribute("aria-valuenow", String(currentStep));
      progressTrack.setAttribute(
        "aria-valuetext",
        `Paso ${currentStep} de ${totalSteps}`,
      );
    }

    if (btnPrev) {
      btnPrev.disabled = currentStep === 1;
    }
    if (btnNext) {
      btnNext.textContent =
        currentStep === totalSteps ? "Finalizar" : "Siguiente →";
    }

    if (currentStepLabel) {
      currentStepLabel.textContent = currentStep;
    }
  };

  // Move focus to the new step's legend so screen readers announce the change
  const focusCurrentStep = () => {
    const legend = form.querySelector(
      `.wizard__step[data-step="${currentStep}"] legend`,
    );
    if (!legend) return;
    legend.tabIndex = -1;
    legend.focus();
  };

  const goToStep = (step) => {
    if (step < 1 || step > totalSteps) return;
    currentStep = step;
    updateUI();
    focusCurrentStep();
  };

  const showConfirmation = (email) => {
    const wizard = document.getElementById("wizard");
    const confirmation = document.getElementById("subscription__confirmation");
    const emailLabel = document.getElementById(
      "subscription__confirmation-email",
    );
    if (!wizard || !confirmation) return;

    if (email && emailLabel) emailLabel.textContent = email;
    wizard
      .querySelectorAll(":scope > :not(#subscription__confirmation)")
      .forEach((el) => el.classList.add("hidden"));
    confirmation.classList.remove("hidden");
    document.getElementById("subscription__confirmation-title")?.focus();
  };

  // There is no backend yet: log the data instead of sending it
  const submitForm = () => {
    const data = Object.fromEntries(new FormData(form));
    console.info(
      "[Suscripción] Aún no se gestiona el envío del formulario. Datos recogidos:",
      data,
    );
    showConfirmation(data.email);
  };

  const isCurrentStepValid = () =>
    validateFields(
      form.querySelector(`.wizard__step[data-step="${currentStep}"]`),
    );

  const nextStep = () => {
    if (!isCurrentStepValid()) return;
    if (currentStep < totalSteps) {
      goToStep(currentStep + 1);
    } else {
      submitForm();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  if (btnNext) {
    btnNext.addEventListener("click", nextStep);
  }
  if (btnPrev) {
    btnPrev.addEventListener("click", prevStep);
  }

  updateUI();
}

const updatePlanPrices = (form) => {
  const coffee = coffees.find(({ id }) => id === form.coffee.value);
  if (!coffee) return;
  form.querySelectorAll("[data-plan-price]").forEach((el) => {
    el.textContent = formatPrice(coffee.price * Number(el.dataset.planPrice));
  });
};

const initPlanPrices = () => {
  const form = document.getElementById("subscription__form");
  if (!form) return;
  form.addEventListener("change", (event) => {
    if (event.target.name === "coffee") updatePlanPrices(form);
  });
  updatePlanPrices(form);
};

renderCoffeeOptions();
initPlanPrices();
initSubscriptionWizard();
