import menu from "../../data/menu.json";
import menuItemTemplate from "../../components/menu-item.html?raw";
import { renderTemplate } from "./template.js";

const formatPrice = (price) => `${price.toFixed(2).replace(".", ",")} €`;

const list = document.getElementById("menu-list");
if (list) {
  list.innerHTML = menu
    .map((item) =>
      renderTemplate(menuItemTemplate, {
        ...item,
        formattedPrice: formatPrice(item.price),
      }),
    )
    .join("");
}
