import { SuitcaseItem } from '../types/activities';

export const SUITCASES_DATA: SuitcaseItem[] = [
  {
    id: 'suitcase-blue-circle',
    color: '#2563eb', // Blue
    shape: 'circle',
    colorEn: 'blue',
    shapeEn: 'circle',
    x: 210,
    y: 200, // Near the central fountain
    isCorrect: true,
    feedbackEs: '¡Excelente! Esta es la maleta azul con un círculo en el centro ("blue backpack with a circle"). ¡Has encontrado la pertenencia de John!'
  },
  {
    id: 'suitcase-red-square',
    color: '#dc2626', // Red
    shape: 'square',
    colorEn: 'red',
    shapeEn: 'square',
    x: 55,
    y: 300, // Near the artisan stall
    isCorrect: false,
    feedbackEs: '¡Atención! Esta es una maleta roja con un cuadrado ("red backpack with a square"). Recuerda que John te pidió: "blue backpack with a circle".'
  },
  {
    id: 'suitcase-green-triangle',
    color: '#16a34a', // Green
    shape: 'triangle',
    colorEn: 'green',
    shapeEn: 'triangle',
    x: 330,
    y: 280, // Near the east trees
    isCorrect: false,
    feedbackEs: '¡Casi! Esta es una mochila verde con un triángulo ("green backpack with a triangle"). Fíjate en los colores: "green" no es "blue".'
  },
  {
    id: 'suitcase-yellow-star',
    color: '#eab308', // Yellow
    shape: 'star',
    colorEn: 'yellow',
    shapeEn: 'star',
    x: 130,
    y: 430, // Near the south benches
    isCorrect: false,
    feedbackEs: '¡No es esta! Esta es una maleta amarilla con una estrella ("yellow backpack with a star"). Busca una que sea "blue" y tenga "circle".'
  }
];
