import { Item } from "@/types/packing";

/**
 * Returns all 6 possible orientation permutations of an item.
 * Note: For a cube, these are all identical, but for a general cuboid (l != w != h),
 * there are at most 6 unique bounding box dimensions.
 * 
 * Dimensions (Width, Height, Depth) permutations:
 * 1. w, h, d (original)
 * 2. w, d, h
 * 3. h, w, d
 * 4. h, d, w
 * 5. d, w, h
 * 6. d, h, w
 */
export function getAllOrientations(item: Item): Item[] {
    const { width: w, height: h, depth: d } = item;

    // Define all 6 permutations of dimensions
    const permutations = [
        { width: w, height: h, depth: d },
        { width: w, height: d, depth: h },
        { width: h, height: w, depth: d },
        { width: h, height: d, depth: w },
        { width: d, height: w, depth: h },
        { width: d, height: h, depth: w },
    ];

    // Map to distinct items marked as rotated if they differ from original
    return permutations.map((perm) => ({
        ...item,
        ...perm,
        rotated: perm.width !== w || perm.height !== h || perm.depth !== d
    }));
}
