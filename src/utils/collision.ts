import { NPCS_DATA } from '../data/npcsData';

export interface Box {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

// Solid obstacles inside the Japanese house (furniture, walls, counters, etc.)
// The house sits from y: 125 to 432, centered around x: 212 (width: 424, left: 0 to 424)
export const ROOM_COLLIDERS: Box[] = [
  // Outer perimeter walls (boundaries of the house)
  { minX: 0, maxX: 20, minY: 120, maxY: 440 },       // Left outer wall
  { minX: 405, maxX: 430, minY: 120, maxY: 440 },    // Right outer wall
  { minX: 0, maxX: 430, minY: 120, maxY: 172 },      // Top roof/wall border
  { minX: 0, maxX: 175, minY: 405, maxY: 440 },      // Bottom-left wall
  { minX: 250, maxX: 430, minY: 405, maxY: 440 },    // Bottom-right wall

  // Central dividing walls
  { minX: 180, maxX: 245, minY: 165, maxY: 215 },    // Central partition wall
  { minX: 245, maxX: 265, minY: 220, maxY: 300 },    // Corridor vertical divider

  // Left room furniture (Altar / Kotatsu tea table / stone garden)
  { minX: 20, maxX: 85, minY: 170, maxY: 220 },      // Top-left stone garden
  { minX: 30, maxX: 105, minY: 320, maxY: 360 },     // Low tea table left
  { minX: 170, maxX: 240, minY: 320, maxY: 360 },    // Middle living table

  // Right room furniture (Dining table, kitchen counter, beds)
  { minX: 275, maxX: 335, minY: 205, maxY: 250 },    // Bed 1
  { minX: 345, maxX: 405, minY: 205, maxY: 250 },    // Bed 2 / bath
  { minX: 275, maxX: 345, minY: 340, maxY: 380 },    // Dining table & chairs
  { minX: 30, maxX: 55, minY: 250, maxY: 300 },      // Wall scroll / sword rack
];

/**
 * Checks if a candidate position (x, y) collides with walls, furniture, or NPCs.
 */
export function canMoveTo(nextX: number, nextY: number): boolean {
  // 1. Check screen and general house bounds
  if (nextX < 25 || nextX > 400 || nextY < 175 || nextY > 415) {
    return false;
  }

  // 2. Check room colliders (walls & furniture)
  for (const box of ROOM_COLLIDERS) {
    if (nextX >= box.minX && nextX <= box.maxX && nextY >= box.minY && nextY <= box.maxY) {
      return false;
    }
  }

  // 3. Check NPC collisions (player cannot walk directly into NPCs)
  for (const npc of Object.values(NPCS_DATA)) {
    const dist = Math.hypot(nextX - npc.x, nextY - npc.y);
    // Keep a solid physical radius of 20px around each NPC
    if (dist < 22) {
      return false;
    }
  }

  return true;
}
