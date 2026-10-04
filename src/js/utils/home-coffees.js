import coffees from '../../data/coffees.json';

const formatPrice = (price) =>
  `${price.toFixed(2).replace('.', ',')} €`;

const renderCoffeeCard = (coffee) => `
  <li>
    <a href="/src/pages/coffee-detail.html?id=${coffee.id}" class="card home-coffee-link">
      <article>
        <div class="coffee-card-package">
          <img class="coffee-card-package-image" src="/photos/package-1.png"
            alt="Paquete de café ${coffee.name}, ${coffee.production}">
        </div>
        <div class="coffee-card-content">
          <h3 class="coffee-card-title">${coffee.name}</h3>
          <p class="coffee-card-description">${coffee.description}</p>
          <p class="coffee-card-price">${formatPrice(coffee.price)}</p>
        </div>
      </article>
    </a>
  </li>`;

const grid = document.getElementById('coffee-grid');
if (grid) {
  grid.innerHTML = coffees.map(renderCoffeeCard).join('');
}
