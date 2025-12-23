import { Item, PackedItem, Container, PackingResult, ContainerResult } from "@/types/packing";
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
 * Packs items into multiple containers.
 * @param container The base container template
 * @param items Items to pack
 * @param containerCount Number of containers available
 * @param packFn The packing function to use for a single container
 */
export function packItemsMultiContainer(
  container: Container,
  items: Item[],
  containerCount: number = 1,
  packFn: (container: Container, items: Item[]) => PackingResult
): PackingResult {
  const containers: ContainerResult[] = [];
  let remainingItems = [...items];
  let totalUsedVolume = 0;
  let totalContainerVolume = 0;

  for (let i = 0; i < containerCount; i++) {
    if (remainingItems.length === 0) break;

    const currentContainer = { ...container, id: `${container.id}-${i}` };
    const result = packFn(currentContainer, remainingItems);

    containers.push({
      id: currentContainer.id,
      container: currentContainer,
      packedItems: result.packedItems,
      utilization: result.utilization,
      totalVolume: result.totalVolume,
      usedVolume: result.usedVolume,
    });

    totalUsedVolume += result.usedVolume;
    totalContainerVolume += result.totalVolume;
    remainingItems = result.unpackedItems;
  }

  // Return a PackingResult that is compatible with single-container UI by default (showing the first container)
  const firstResult = containers[0] || {
    container,
    packedItems: [],
    utilization: 0,
    totalVolume: calculateVolume(container),
    usedVolume: 0,
  };

  return {
    ...firstResult,
    container: firstResult.container,
    packedItems: firstResult.packedItems,
    unpackedItems: remainingItems,
    utilization: firstResult.utilization,
    totalVolume: firstResult.totalVolume,
    usedVolume: firstResult.usedVolume,
    containers,
    totalUtilization: totalContainerVolume > 0 ? (totalUsedVolume / totalContainerVolume) * 100 : 0,
    isMultiContainer: containerCount > 1,
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
