import coffees from "../../data/coffees.json";
import coffeeOptionTemplate from "../../components/subscription/subscription-coffee-option.html?raw";
import { coffeeFields, formatPrice, renderTemplate } from "../lib/template.js";

const renderCoffeeOptions = () => {
  const list = document.getElementById("subscription__coffee-options");
  if (!list) return;
  list.innerHTML = coffees
    .map((coffee, index) =>
      renderTemplate(coffeeOptionTemplate, {
        ...coffeeFields(coffee),
        checked: index === 0 ? "checked" : "",
      }),
    )
    .join("");
};

const updatePlanPrices = (form) => {
  const coffee = coffees.find(({ id }) => id === form.coffee.value);
  if (!coffee) return;
  form.querySelectorAll("[data-plan-price]").forEach((el) => {
    el.textContent = formatPrice(coffee.price * Number(el.dataset.planPrice));
  });
};

const initPlanPrices = (form) => {
  form.addEventListener("change", (event) => {
    if (event.target.name === "coffee") updatePlanPrices(form);
  });
  updatePlanPrices(form);
};

// /src/pages/subscription.html?plan=weekly pre-selects that plan (the plan
// cards on the home page link here)
const preselectPlan = (form) => {
  const plan = new URLSearchParams(window.location.search).get("plan");
  if (!plan) return;
  form
    .querySelector(`input[name="plan"][value="${CSS.escape(plan)}"]`)
    ?.click();
};

export const initSubscriptionOptions = () => {
  renderCoffeeOptions();
  const form = document.getElementById("subscription__form");
  if (!form) return;
  initPlanPrices(form);
  preselectPlan(form);
};
