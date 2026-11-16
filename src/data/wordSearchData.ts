import { WordSearchTarget } from '../types/activities';

export const WORD_SEARCH_TARGETS: WordSearchTarget[] = [
  {
    id: 'backpack',
    word: 'BACKPACK',
    translation: 'Mochila / Maleta',
    icon: '🎒',
    description: 'Bolsa con correas usada por los viajeros.',
    found: false
  },
  {
    id: 'blue',
    word: 'BLUE',
    translation: 'Azul',
    icon: '🔵',
    description: 'Color primario, color del cielo despejado.',
    found: false
  },
  {
    id: 'circle',
    word: 'CIRCLE',
    translation: 'Círculo',
    icon: '⭕',
    description: 'Figura geométrica redonda y cerrada.',
    found: false
  },
  {
    id: 'cloudy',
    word: 'CLOUDY',
    translation: 'Nublado',
    icon: '☁️',
    description: 'Estado del clima cubierto de nubes.',
    found: false
  }
];

// An 8x8 grid designed perfectly for mobile readability
// Contains:
// Row 0: B A C K P A C K  (BACKPACK)
// Row 2: B L U E . . . .  (BLUE)
// Col 6, Row 1-6: C I R C L E (CIRCLE downwards)
// Row 5: C L O U D Y . .  (CLOUDY)
export const WORD_SEARCH_GRID = [
  ['B', 'A', 'C', 'K', 'P', 'A', 'C', 'K'],
  ['T', 'O', 'U', 'R', 'S', 'U', 'C', 'O'],
  ['B', 'L', 'U', 'E', 'A', 'N', 'I', 'L'],
  ['P', 'E', 'R', 'U', 'M', 'A', 'R', 'D'],
  ['F', 'I', 'N', 'D', 'O', 'P', 'C', 'S'],
  ['C', 'L', 'O', 'U', 'D', 'Y', 'L', 'U'],
  ['W', 'O', 'R', 'D', 'G', 'U', 'E', 'N'],
  ['S', 'H', 'A', 'P', 'E', 'S', 'K', 'Y']
];

// Word coordinates in the grid: [row, col]
export const WORD_COORDINATES: Record<string, [number, number][]> = {
  BACKPACK: [[0,0], [0,1], [0,2], [0,3], [0,4], [0,5], [0,6], [0,7]],
  BLUE: [[2,0], [2,1], [2,2], [2,3]],
  CIRCLE: [[1,6], [2,6], [3,6], [4,6], [5,6], [6,6]],
  CLOUDY: [[5,0], [5,1], [5,2], [5,3], [5,4], [5,5]]
};
