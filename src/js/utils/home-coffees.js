import coffees from "../../data/coffees.json";
import coffeeCardTemplate from "../../components/coffee-card.html?raw";
import { renderTemplate } from "./template.js";

const formatPrice = (price) => `${price.toFixed(2).replace(".", ",")} €`;

const renderCoffeeCard = (coffee) =>
  renderTemplate(coffeeCardTemplate, {
    ...coffee,
    formattedPrice: formatPrice(coffee.price),
  });

const grid = document.getElementById("coffee-grid");
if (grid) {
  grid.innerHTML = coffees.map(renderCoffeeCard).join("");
}
