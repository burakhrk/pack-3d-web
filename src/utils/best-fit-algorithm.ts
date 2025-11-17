import { Item, PackedItem, Container, PackingResult } from "@/types/packing";
import {
  fitsInContainer,
  hasCollision,
  calculateVolume,
  calculateUtilization,
} from "./collision";

const ITEM_COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16",
];

/**
 * Best-Fit Algorithm
 * For each item, find the position that minimizes wasted space
 */
export function packItemsBestFit(container: Container, items: Item[], gridResolution: number = 0.5): PackingResult {
  const packedItems: PackedItem[] = [];
  const unpackedItems: Item[] = [];

  // Sort items by volume in descending order
  const sortedItems = [...items].sort((a, b) => {
    return calculateVolume(b) - calculateVolume(a);
  });

  for (let i = 0; i < sortedItems.length; i++) {
    const item = sortedItems[i];
    const position = findBestFitPosition(item, container, packedItems, gridResolution);

    if (position) {
      packedItems.push({
        ...item,
        position,
        color: ITEM_COLORS[i % ITEM_COLORS.length],
      });
    } else {
      unpackedItems.push(item);
    }
  }

  const containerVolume = calculateVolume(container);
  const usedVolume = packedItems.reduce(
    (sum, item) => sum + calculateVolume(item),
    0
  );
  const utilization = calculateUtilization(containerVolume, usedVolume);

  return {
    container,
    packedItems,
    unpackedItems,
    utilization,
    totalVolume: containerVolume,
    usedVolume,
  };
}

/**
 * Find position that minimizes wasted space (best fit)
 */
function findBestFitPosition(
  item: Item,
  container: Container,
  packedItems: PackedItem[],
  gridResolution: number = 0.5
): { x: number; y: number; z: number } | null {
  const step = gridResolution;
  let bestPosition: { x: number; y: number; z: number } | null = null;
  let minWaste = Infinity;

  for (let y = 0; y <= container.height - item.height; y += step) {
    for (let z = 0; z <= container.depth - item.depth; z += step) {
      for (let x = 0; x <= container.width - item.width; x += step) {
        const position = { x, y, z };

        if (
          fitsInContainer(item, position, container) &&
          !hasCollision(item, position, packedItems)
        ) {
          // Calculate wasted space (distance from edges and other items)
          const waste = calculateWaste(item, position, container, packedItems);
          
          if (waste < minWaste) {
            minWaste = waste;
            bestPosition = position;
          }
        }
      }
    }
  }

  return bestPosition;
}

/**
 * Calculate wasted space for a position
 */
function calculateWaste(
  item: Item,
  position: { x: number; y: number; z: number },
  container: Container,
  packedItems: PackedItem[]
): number {
  // Prefer positions closer to origin and existing items
  let waste = position.x + position.y + position.z;

  // Add penalty for distance from existing items
  if (packedItems.length > 0) {
    const minDistance = Math.min(
      ...packedItems.map((packed) => {
        const dx = Math.abs(packed.position.x - position.x);
        const dy = Math.abs(packed.position.y - position.y);
        const dz = Math.abs(packed.position.z - position.z);
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
      })
    );
    waste += minDistance * 2;
  }

  return waste;
}
