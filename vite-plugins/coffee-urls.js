// URL of each coffee's detail page. coffee-pages.js generates the pages,
// html-components.js links the cards to them and i18n.js keeps links to them
// in the page's locale, so the shape is defined only here.
export const coffeeUrl = (id) => `/coffees/${id}/`;

const COFFEE_URL = new RegExp(`^${coffeeUrl("[\\w-]+")}$`);
export const isCoffeeUrl = (url) => COFFEE_URL.test(url);
