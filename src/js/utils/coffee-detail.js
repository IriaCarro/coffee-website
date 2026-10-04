import coffees from '../../data/coffees.json';

const getCoffeeById = (id) => coffees.find((coffee) => coffee.id === id);

export function initCoffeeDetail() {
  const params = new URLSearchParams(window.location.search);
  const coffeeId = params.get('id');

  if (!coffeeId) {
    console.error('No coffee ID provided');
    return;
  }

  const coffee = getCoffeeById(coffeeId);

  if (!coffee) {
    console.error('Coffee not found:', coffeeId);
    return;
  }

  renderCoffeeDetail(coffee);
}

function renderCoffeeDetail(coffee) {
  // Update page title
  document.title = `${coffee.name} - Café Rico`;

  // Update coffee image
  const coffeeImage = document.querySelector('figure img');
  if (coffeeImage) {
    coffeeImage.src = coffee.image;
    coffeeImage.alt = coffee.name;
  }

  // Update coffee name and info
  const coffeeTitle = document.querySelector('main h1');
  if (coffeeTitle) coffeeTitle.textContent = coffee.name;

  const coffeeDescription = document.querySelector('main > section > div > div > div:nth-child(2) > p:nth-child(2)');
  if (coffeeDescription) coffeeDescription.textContent = coffee.description;

  const coffeePrice = document.querySelector('main > section > div > div > div:nth-child(2) > p:nth-child(3)');
  if (coffeePrice) {
    coffeePrice.innerHTML = `${coffee.price.toFixed(2)} € <span class="detail-price-unit">/mes</span>`;
  }

  // Update rating
  const ratingContainer = document.querySelector('main > section > div > div > div:nth-child(2) > div:nth-child(4)');
  if (ratingContainer) {
    const stars = '★'.repeat(coffee.rating);
    ratingContainer.innerHTML = `
      <div class="detail-stars">
        <span class="detail-stars-text">${stars}</span>
      </div>
      <p class="detail-reviews">${coffee.reviews} reseñas</p>
    `;
  }

  // Update main description
  const mainDescription = document.querySelectorAll('main > section > div > div > div > p')[1];
  if (mainDescription) mainDescription.textContent = coffee.detailedDescription;

  // Update coffee details grid
  const detailsGrid = document.querySelector('main > section > div > div > div:nth-child(4)');
  if (detailsGrid) {
    detailsGrid.innerHTML = `
      <article class="detail-spec-card">
        <h3 class="detail-spec-title">Origen</h3>
        <p class="detail-spec-text">${coffee.origin}</p>
      </article>

      <article class="detail-spec-card">
        <h3 class="detail-spec-title">Tueste</h3>
        <p class="detail-spec-text">${coffee.roast}</p>
      </article>

      <article class="detail-spec-card">
        <h3 class="detail-spec-title">Altitud</h3>
        <p class="detail-spec-text">${coffee.altitude}</p>
      </article>

      <article class="detail-spec-card">
        <h3 class="detail-spec-title">Producción</h3>
        <p class="detail-spec-text">${coffee.production}</p>
      </article>
    `;
  }

  // Update flavor profile
  const flavorProfile = document.querySelector('main > section > div > div > div:nth-child(5) .detail-list');
  if (flavorProfile) {
    flavorProfile.innerHTML = coffee.flavorProfile.map(flavor => `
      <article class="detail-flavor">
        <h3 class="detail-flavor-title">${flavor.title}</h3>
        <p class="detail-spec-text">${flavor.description}</p>
      </article>
    `).join('');
  }

  // Update brewing recommendations
  const brewingContainer = document.querySelector('main > section > div > div > div:nth-child(6)');
  if (brewingContainer) {
    brewingContainer.innerHTML = `
      <h2 class="detail-block-title-lg">Recomendaciones de Preparación</h2>
      <div class="detail-list">
        <article class="detail-spec-card">
          <h3 class="detail-spec-title">Temperatura</h3>
          <p class="detail-spec-text">${coffee.brewing.temperature}</p>
        </article>

        <article class="detail-spec-card">
          <h3 class="detail-spec-title">Molienda</h3>
          <p class="detail-spec-text">${coffee.brewing.grind}</p>
        </article>

        <article class="detail-spec-card">
          <h3 class="detail-spec-title">Proporción</h3>
          <p class="detail-spec-text">${coffee.brewing.ratio}</p>
        </article>

        <article class="detail-spec-card">
          <h3 class="detail-spec-title">Métodos Recomendados</h3>
          <p class="detail-spec-text">${coffee.brewing.methods}</p>
        </article>
      </div>
    `;
  }
}
