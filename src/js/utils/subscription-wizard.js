function initSubscriptionWizard() {
  const form = document.getElementById("subscription-wizard-form");
  if (!form) return;

  const steps = form.querySelectorAll(".wizard__step");
  const indicators = document.querySelectorAll(".step-indicator");
  const progressBar = document.getElementById("subscription-progress-bar");
  const progressTrack = document.getElementById("subscription-progress-track");
  const btnPrev = document.getElementById("subscription-btn-prev");
  const btnNext = document.getElementById("subscription-btn-next");
  const currentStepLabel = document.getElementById("subscription-current-step");

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

      indicator.classList.toggle("step-indicator--active", isActive);
      indicator.classList.toggle("step-indicator--completed", isCompleted);
      if (isActive) {
        indicator.setAttribute("aria-current", "step");
      } else {
        indicator.removeAttribute("aria-current");
      }
    });

    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
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

  const goToStep = (step) => {
    if (step < 1 || step > totalSteps) return;
    currentStep = step;
    updateUI();
  };

  // There is no backend yet: log the data instead of sending it
  const submitForm = () => {
    console.info(
      "[Suscripción] Aún no se gestiona el envío del formulario. Datos recogidos:",
      Object.fromEntries(new FormData(form)),
    );
  };

  const nextStep = () => {
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

initSubscriptionWizard();
