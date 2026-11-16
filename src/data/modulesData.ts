import { ModuleInfo } from '../types/game';

export const MODULES_DATA: ModuleInfo[] = [
  {
    id: 1,
    title: 'Módulo 1',
    name: 'San Pedro de las Nubes',
    subtitle: 'Primer contacto y objetos perdidos',
    isUnlocked: true,
    stars: 3,
    maxStars: 3,
    description: 'Aprende a comunicarte con turistas en la plaza del pueblo. Identifica objetos cotidianos, colores y formas geométricas para resolver emergencias.',
    thumbnail: '🏛️',
    locationName: 'Plaza Mayor & Calles Andinas',
    topics: ['Saludos y cortesía', 'Colores y formas', 'Objetos de viaje (Luggage)', 'Clima local']
  },
  {
    id: 2,
    title: 'Módulo 2',
    name: 'Mercado de Artesanías',
    subtitle: 'Precios, números y transacciones',
    isUnlocked: false,
    stars: 0,
    maxStars: 3,
    description: 'Ayuda a Doña Rosa a negociar con turistas en inglés. Números, tallas, materiales de alpaca y precios justos.',
    thumbnail: '🧶',
    locationName: 'Pabellón Textil y Cerámica',
    topics: ['Precios en soles/dólares', 'Preguntas: How much is it?', 'Materiales: Wool, Silver']
  },
  {
    id: 3,
    title: 'Módulo 3',
    name: 'Estación del Tren Andino',
    subtitle: 'Horarios, boletos y direcciones',
    isUnlocked: false,
    stars: 0,
    maxStars: 3,
    description: 'Guía a los viajeros sobre andenes, horarios de salida hacia Machu Picchu y compra de boletos.',
    thumbnail: '🚂',
    locationName: 'Andén Central Ferrocarril',
    topics: ['Horas y retrasos', 'Tipos de boleto', 'Direcciones cardinales']
  },
  {
    id: 4,
    title: 'Módulo 4',
    name: 'Restaurante Tradicional',
    subtitle: 'Gastronomía y requerimientos dietéticos',
    isUnlocked: false,
    stars: 0,
    maxStars: 3,
    description: 'Explica los platos peruanos a turistas celíacos, vegetarianos y amantes de la gastronomía.',
    thumbnail: '🍲',
    locationName: 'Casona Gastronómica El Sol',
    topics: ['Ingredientes y alergias', 'Bebidas andinas', 'Cuentas y propinas']
  },
  {
    id: 5,
    title: 'Módulo 5',
    name: 'Mirador del Cóndor',
    subtitle: 'Clima, senderismo y primeros auxilios',
    isUnlocked: false,
    stars: 0,
    maxStars: 3,
    description: 'Instruye sobre mal de altura (soroche), hidratación y rutas seguras de trekking en la montaña.',
    thumbnail: '🏔️',
    locationName: 'Ruta Alta del Apu Kuntur',
    topics: ['Altitude sickness & remedies', 'Equipamiento de montaña', 'Números de auxilio']
  },
  {
    id: 6,
    title: 'Módulo 6',
    name: 'El Gran Santuario',
    subtitle: 'Tour guiado final y certificación',
    isUnlocked: false,
    stars: 0,
    maxStars: 3,
    description: 'Demuestra todo tu dominio del inglés turístico guiando un grupo completo en el templo ancestral.',
    thumbnail: '👑',
    locationName: 'Templo del Sol y la Luna',
    topics: ['Historia y arqueología', 'Manejo de grupos grandes', 'Preguntas avanzadas']
  }
];
