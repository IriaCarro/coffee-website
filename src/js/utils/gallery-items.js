import galleryImages from "../../data/gallery.json";
import galleryItemTemplate from "../../components/gallery-item.html?raw";
import { imageVariant, renderTemplate } from "./template.js";

const gallery = document.querySelector("[data-gallery]");
if (gallery) {
  gallery.innerHTML = galleryImages
    .map((item, index) =>
      renderTemplate(galleryItemTemplate, {
        ...item,
        image400: imageVariant(item.image, 400),
        image800: imageVariant(item.image, 800),
        sizes: item.featured
          ? "(min-width: 1024px) 66vw, (min-width: 640px) 50vw, 100vw"
          : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
        // The first photo is the LCP element: load it right away
        loading: index === 0 ? "eager" : "lazy",
        priority: index === 0 ? "high" : "auto",
        modifier: item.featured ? " gallery__item--featured" : "",
      }),
    )
    .join("");
}
