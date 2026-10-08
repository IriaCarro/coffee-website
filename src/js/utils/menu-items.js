import menu from "../../data/menu.json";
import menuItemTemplate from "../../components/menu-item.html?raw";
import { renderTemplate } from "./template.js";

const formatPrice = (price) => `${price.toFixed(2).replace(".", ",")} €`;

// Each photo ships in 400 and 800 px widths next to the full-size file
const resized = (image, width) => image.replace(".webp", `-${width}.webp`);

const list = document.getElementById("menu-list");
if (list) {
  list.innerHTML = menu
    .map((item) =>
      renderTemplate(menuItemTemplate, {
        ...item,
        image400: resized(item.image, 400),
        image800: resized(item.image, 800),
        formattedPrice: formatPrice(item.price),
      }),
    )
    .join("");
}
