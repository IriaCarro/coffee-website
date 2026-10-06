import coffees from "../../data/coffees.json";
import detailTemplate from "../../components/coffee-detail.html?raw";
import errorTemplate from "../../components/coffee-detail-error.html?raw";
import flavorTemplate from "../../components/coffee-detail-flavor.html?raw";
import { renderTemplate } from "./template.js";

const getCoffeeById = (id) => coffees.find((coffee) => coffee.id === id);

function initCoffeeDetail() {
  const params = new URLSearchParams(window.location.search);
  const coffeeId = params.get("id");

  if (!coffeeId) {
    renderError("Falta el café", "No has indicado qué café quieres ver.");
    return;
  }

  const coffee = getCoffeeById(coffeeId);

  if (!coffee) {
    renderError(
      "Café no encontrado",
      "No existe ningún café con ese identificador.",
    );
    return;
  }

  renderCoffeeDetail(coffee);
}

function renderError(title, message) {
  document.title = `${title} - Café Rico`;

  const container = document.getElementById("coffee-detail");
  if (!container) return;

  container.innerHTML = renderTemplate(errorTemplate, { title, message });
}

function renderCoffeeDetail(coffee) {
  document.title = `${coffee.name} - Café Rico`;

  const container = document.getElementById("coffee-detail");
  if (!container) return;

  container.innerHTML = renderTemplate(detailTemplate, {
    ...coffee,
    formattedPrice: coffee.price.toFixed(2),
    stars: "★".repeat(coffee.rating),
    flavorProfileHtml: coffee.flavorProfile
      .map((flavor) => renderTemplate(flavorTemplate, flavor))
      .join(""),
  });
}

initCoffeeDetail();
