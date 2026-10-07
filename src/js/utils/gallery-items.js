import galleryImages from "../../data/gallery.json";
import galleryItemTemplate from "../../components/gallery-item.html?raw";
import { renderTemplate } from "./template.js";

const gallery = document.querySelector("[data-gallery]");
if (gallery) {
  gallery.innerHTML = galleryImages
    .map((item) =>
      renderTemplate(galleryItemTemplate, {
        ...item,
        modifier: item.featured ? " gallery__item--featured" : "",
      }),
    )
    .join("");
}
