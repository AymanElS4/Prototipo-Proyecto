export interface SuitcaseItem {
  id: string;
  color: string;
  shape: 'cross' | 'square' | 'triangle' | 'star';
  colorEn: string;
  shapeEn: string;
  x: number;
  y: number;
  isCorrect: boolean;
  feedbackEs: string;
  spriteImg: string;
  spriteLargeImg: string;
}

// 4 backpacks with dedicated authentic RPG pixel art sprites
export const SUITCASES_DATA: SuitcaseItem[] = [
  {
    id: 'suitcase-blue-cross',
    color: '#2563eb', // Blue
    shape: 'cross',
    colorEn: 'blue',
    shapeEn: 'cross',
    x: 290,
    y: 320, // Centered right on the airport baggage carousel
    isCorrect: true,
    feedbackEs: '¡Correct! This is the blue backpack with a white cross.',
    spriteImg: '/assets/backpacks/backpack_blue_cross.png',
    spriteLargeImg: '/assets/backpacks/backpack_blue_cross_128.png'
  },
  {
    id: 'suitcase-red-square',
    color: '#dc2626', // Red
    shape: 'square',
    colorEn: 'red',
    shapeEn: 'square',
    x: 130,
    y: 310, // Left side of conveyor belt
    isCorrect: false,
    feedbackEs: 'This is a red backpack with a square. Remember: "blue backpack with a cross".',
    spriteImg: '/assets/backpacks/backpack_red_square.png',
    spriteLargeImg: '/assets/backpacks/backpack_red_square_128.png'
  },
  {
    id: 'suitcase-green-triangle',
    color: '#16a34a', // Green
    shape: 'triangle',
    colorEn: 'green',
    shapeEn: 'triangle',
    x: 430,
    y: 310, // Right side of conveyor belt
    isCorrect: false,
    feedbackEs: 'This is a green backpack with a triangle. "Green" is not "blue".',
    spriteImg: '/assets/backpacks/backpack_green_triangle.png',
    spriteLargeImg: '/assets/backpacks/backpack_green_triangle_128.png'
  },
  {
    id: 'suitcase-yellow-star',
    color: '#eab308', // Yellow
    shape: 'star',
    colorEn: 'yellow',
    shapeEn: 'star',
    x: 230,
    y: 365, // Bottom rim of conveyor belt
    isCorrect: false,
    feedbackEs: 'This is a yellow backpack with a star. Look for a blue backpack with a cross.',
    spriteImg: '/assets/backpacks/backpack_yellow_star.png',
    spriteLargeImg: '/assets/backpacks/backpack_yellow_star_128.png'
  }
];
