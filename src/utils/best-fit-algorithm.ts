import { Item, PackedItem, Container, PackingResult } from "@/types/packing";
import {
  fitsInContainer,
  hasCollision,
  calculateVolume,
  calculateUtilization,
} from "./collision";

import { getAllOrientations } from "./rotation";

const ITEM_COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16",
];

/**
 * Best-Fit Algorithm
 * For each item, find the position that minimizes wasted space
 */
export function packItemsBestFit(container: Container, items: Item[], gridResolution: number = 5): PackingResult {
  const packedItems: PackedItem[] = [];
  const unpackedItems: Item[] = [];

  // Sort items by volume in descending order
  const sortedItems = [...items].sort((a, b) => {
    return calculateVolume(b) - calculateVolume(a);
  });

  for (let i = 0; i < sortedItems.length; i++) {
    const item = sortedItems[i];
    const result = findBestFitPosition(item, container, packedItems, gridResolution);

    if (result) {
      packedItems.push({
        ...result.item, // Use rotated dimensions
        position: result.position,
        color: item.color || ITEM_COLORS[i % ITEM_COLORS.length],
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

  // Log detailed verification data
  console.log(`[Best-Fit] First 3 Items:`);
  packedItems.slice(0, 3).forEach((item, idx) => {
    console.log(`  ${idx + 1}. ${item.name} at (${item.position.x}, ${item.position.y}, ${item.position.z})`);
  });

  console.log(`[Best-Fit] Packed ${packedItems.length}/${items.length} items. Utilization: ${utilization.toFixed(2)}%`);

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
 * Checks all 6 orientations
 */
function findBestFitPosition(
  item: Item,
  container: Container,
  packedItems: PackedItem[],
  gridResolution: number = 0.5
): { position: { x: number; y: number; z: number }; item: Item } | null {
  const step = gridResolution;
  let bestFit: { position: { x: number; y: number; z: number }; item: Item } | null = null;
  let minWaste = Infinity;

  // Helper function to find lowest valid Y (gravity)
  const findLowestValidY = (x: number, z: number, width: number, depth: number): number => {
    let maxY = 0;
    for (const packed of packedItems) {
      const xOverlap = x < packed.position.x + packed.width && x + width > packed.position.x;
      const zOverlap = z < packed.position.z + packed.depth && z + depth > packed.position.z;
      if (xOverlap && zOverlap) {
        maxY = Math.max(maxY, packed.position.y + packed.height);
      }
    }
    return maxY;
  };

  const orientations = getAllOrientations(item);

  for (const orientation of orientations) {
    // Try positions on X-Z plane (footprint)
    for (let z = 0; z <= container.depth - orientation.depth; z += step) {
      for (let x = 0; x <= container.width - orientation.width; x += step) {
        // Find lowest valid Y using gravity
        const y = findLowestValidY(x, z, orientation.width, orientation.depth);

        if (y + orientation.height <= container.height) {
          const position = { x, y, z };

          if (
            fitsInContainer(orientation, position, container) &&
            !hasCollision(orientation, position, packedItems)
          ) {
            // Calculate wasted space (distance from edges and other items)
            const waste = calculateWaste(orientation, position, container, packedItems);

            if (waste < minWaste) {
              minWaste = waste;
              bestFit = { position, item: orientation };
            }
          }
        }
      }
    }
  }

  return bestFit;
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
