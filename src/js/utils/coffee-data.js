export const coffees = [
  {
    id: 'etiopia',
    emoji: '🌸',
    name: 'Etiopía Floral',
    description: 'Notas florales, cítricas y dulces',
    price: 14.90,
    image: '/photos/cafe-1.jpg',
    origin: 'Etiopía - Yirgacheffe',
    roast: 'Tueste Medio',
    altitude: '1800 - 2200 m',
    production: '250g por bolsa',
    detailedDescription: 'Este café etíope presenta notas florales delicadas combinadas con toques cítricos frescos y un dulzor natural. Proveniente de las montañas de Etiopía, cada taza es una experiencia sensorial única. Perfecto para los amantes de los cafés con carácter, este grano es ideal para preparar con métodos de filtración como pour-over o prensa francesa.',
    flavorProfile: [
      { title: 'Notas Florales', description: 'Aromas delicados de jazín y lavanda' },
      { title: 'Notas Cítricas', description: 'Toques de limón y naranja fresca' },
      { title: 'Dulzor Natural', description: 'Notas de miel y caramelo suave' }
    ],
    brewing: {
      temperature: '90-96°C',
      grind: 'Media a fina (similar al azúcar de mesa)',
      ratio: '1:16 (1 parte café por 16 partes agua)',
      methods: 'Pour Over, Prensa Francesa, AeroPress'
    },
    rating: 5,
    reviews: 127
  },
  {
    id: 'colombia',
    emoji: '🍫',
    name: 'Colombia Caramelo',
    description: 'Caramelo, chocolate y frutos secos',
    price: 12.90,
    image: '/photos/cafe-2.jpeg',
    origin: 'Colombia - Huila',
    roast: 'Tueste Medio-Oscuro',
    altitude: '1600 - 2000 m',
    production: '250g por bolsa',
    detailedDescription: 'Un café colombiano de cuerpo pleno con notas de caramelo y chocolate. Este grano es perfectamente equilibrado, ofreciendo una experiencia suave y agradable. Ideal para disfrutar a cualquier hora del día, tanto solo como en bebidas con leche.',
    flavorProfile: [
      { title: 'Chocolate', description: 'Aromas profundos de cacao oscuro' },
      { title: 'Caramelo', description: 'Dulzor natural y notas toffee' },
      { title: 'Frutos Secos', description: 'Toques sutiles de almendra y nuez' }
    ],
    brewing: {
      temperature: '93-96°C',
      grind: 'Media (similar al café molido comercial)',
      ratio: '1:16 (1 parte café por 16 partes agua)',
      methods: 'Espresso, Prensa Francesa, Pour Over'
    },
    rating: 5,
    reviews: 89
  },
  {
    id: 'kenia',
    emoji: '🫐',
    name: 'Kenia Frutos Rojos',
    description: 'Frutos rojos, acidez brillante',
    price: 15.50,
    image: '/photos/cafe-3.jpeg',
    origin: 'Kenia - Mount Kenya',
    roast: 'Tueste Ligero',
    altitude: '1900 - 2300 m',
    production: '250g por bolsa',
    detailedDescription: 'Un café keniata vibrante con notas jugosas de frutos rojos. Su acidez brillante y compleja lo hace perfecto para los que buscan un café con personalidad. Cada sorbo revela nuevas capas de sabor, haciendo de esta una experiencia verdaderamente memorable.',
    flavorProfile: [
      { title: 'Frutos Rojos', description: 'Notas de fresa, frambuesa y cereza' },
      { title: 'Acidez Brillante', description: 'Sensación vivaz y fresca en la boca' },
      { title: 'Complejidad', description: 'Capas sutiles de arándano y té negro' }
    ],
    brewing: {
      temperature: '90-95°C',
      grind: 'Fina a media (para realzar la acidez)',
      ratio: '1:16 (1 parte café por 16 partes agua)',
      methods: 'Pour Over, AeroPress, Filtro de papel'
    },
    rating: 5,
    reviews: 156
  }
];

export function getCoffeeById(id) {
  return coffees.find(coffee => coffee.id === id);
}
