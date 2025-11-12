import { PackedItem, Item } from "@/types/packing";

export interface Box {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
}

/**
 * Check if two boxes collide in 3D space
 */
export function checkCollision(box1: Box, box2: Box): boolean {
  return (
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.y + box1.height > box2.y &&
    box1.z < box2.z + box2.depth &&
    box1.z + box1.depth > box2.z
  );
}

/**
 * Check if a box fits within container bounds
 */
export function fitsInContainer(
  item: Item,
  position: { x: number; y: number; z: number },
  containerDimensions: { width: number; height: number; depth: number }
): boolean {
  return (
    position.x >= 0 &&
    position.y >= 0 &&
    position.z >= 0 &&
    position.x + item.width <= containerDimensions.width &&
    position.y + item.height <= containerDimensions.height &&
    position.z + item.depth <= containerDimensions.depth
  );
}

/**
 * Check if an item at a position collides with any packed items
 */
export function hasCollision(
  item: Item,
  position: { x: number; y: number; z: number },
  packedItems: PackedItem[]
): boolean {
  const newBox: Box = {
    x: position.x,
    y: position.y,
    z: position.z,
    width: item.width,
    height: item.height,
    depth: item.depth,
  };

  return packedItems.some((packed) => {
    const packedBox: Box = {
      x: packed.position.x,
      y: packed.position.y,
      z: packed.position.z,
      width: packed.width,
      height: packed.height,
      depth: packed.depth,
    };
    return checkCollision(newBox, packedBox);
  });
}

/**
 * Calculate volume utilization percentage
 */
export function calculateUtilization(
  containerVolume: number,
  usedVolume: number
): number {
  if (containerVolume === 0) return 0;
  return (usedVolume / containerVolume) * 100;
}

/**
 * Calculate volume of a box
 */
export function calculateVolume(dimensions: {
  width: number;
  height: number;
  depth: number;
}): number {
  return dimensions.width * dimensions.height * dimensions.depth;
}
