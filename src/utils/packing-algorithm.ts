import { Item, PackedItem, Container, PackingResult } from "@/types/packing";
import {
  fitsInContainer,
  hasCollision,
  calculateVolume,
  calculateUtilization,
} from "./collision";

// Generate vibrant colors for visualization
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
export function packItems(container: Container, items: Item[], gridResolution: number = 0.5): PackingResult {
  const packedItems: PackedItem[] = [];
  const unpackedItems: Item[] = [];

  // Sort items by volume in descending order (largest first)
  const sortedItems = [...items].sort((a, b) => {
    const volumeA = calculateVolume(a);
    const volumeB = calculateVolume(b);
    return volumeB - volumeA;
  });

  // Try to pack each item
  for (let i = 0; i < sortedItems.length; i++) {
    const item = sortedItems[i];
    const position = findFirstFitPosition(item, container, packedItems, gridResolution);

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
 * Using a grid-based search starting from bottom-left-front corner
 */
function findFirstFitPosition(
  item: Item,
  container: Container,
  packedItems: PackedItem[],
  gridResolution: number = 0.5
): { x: number; y: number; z: number } | null {
  const step = gridResolution; // Grid resolution for position searching

  // Start from bottom (y=0), try positions layer by layer
  for (let y = 0; y <= container.height - item.height; y += step) {
    for (let z = 0; z <= container.depth - item.depth; z += step) {
      for (let x = 0; x <= container.width - item.width; x += step) {
        const position = { x, y, z };

        if (
          fitsInContainer(item, position, container) &&
          !hasCollision(item, position, packedItems)
        ) {
          return position;
        }
      }
    }
  }

  return null;
}
