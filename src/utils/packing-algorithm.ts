import { Item, PackedItem, Container, PackingResult } from "@/types/packing";
import {
  fitsInContainer,
  hasCollision,
  calculateVolume,
  calculateUtilization,
} from "./collision";

import { getAllOrientations } from "./rotation";

const ITEM_COLORS = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#14B8A6", // teal
  "#F97316", // orange
  "#6366F1", // indigo
  "#84CC16", // lime
];

/**
 * 3D First-Fit Decreasing (FFD) Algorithm
 * Sort items by volume (largest first), then try to place each item
 * at the first available position that doesn't collide
 */
export function packItems(container: Container, items: Item[], gridResolution: number = 5): PackingResult {
  // Sort items by volume in descending order (largest first)
  const sortedItems = [...items].sort((a, b) => {
    const volumeA = calculateVolume(a);
    const volumeB = calculateVolume(b);
    return volumeB - volumeA;
  });

  return packPreSortedItems(container, sortedItems, gridResolution);
}

/**
 * Packs items in the exact order provided without re-sorting.
 * Useful for Simulated Annealing or Genetic Algorithms where order matters.
 */
export function packPreSortedItems(container: Container, items: Item[], gridResolution: number = 5): PackingResult {
  const packedItems: PackedItem[] = [];
  const unpackedItems: Item[] = [];

  // Try to pack each item
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const result = findFirstFitPosition(item, container, packedItems, gridResolution);

    if (result) {
      packedItems.push({
        ...result.item, // Use dimensions from the fitted permutation
        position: result.position,
        color: ITEM_COLORS[i % ITEM_COLORS.length],
      });
    } else {
      unpackedItems.push(item);
    }
  }

  // Calculate utilization
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
 * Find the first position where an item can fit without collision
 * Checks all 6 possible orientations
 */
function findFirstFitPosition(
  item: Item,
  container: Container,
  packedItems: PackedItem[],
  gridResolution: number = 0.5
): { position: { x: number; y: number; z: number }; item: Item } | null {
  const step = gridResolution;
  const orientations = getAllOrientations(item);

  // Try each orientation
  for (const orientation of orientations) {
    // Start from bottom (y=0), try positions layer by layer
    for (let y = 0; y <= container.height - orientation.height; y += step) {
      for (let z = 0; z <= container.depth - orientation.depth; z += step) {
        for (let x = 0; x <= container.width - orientation.width; x += step) {
          const position = { x, y, z };

          if (
            fitsInContainer(orientation, position, container) &&
            !hasCollision(orientation, position, packedItems)
          ) {
            return { position, item: orientation };
          }
        }
      }
    }
  }

  return null;
}
