import { describe, it, expect } from "vitest";
import { packItems } from "./packing-algorithm";
import { Item, Container } from "@/types/packing";

describe("Rotation Support", () => {
    it("should pack an item that only fits when rotated", () => {
        // Container: 10x5x5
        const container: Container = {
            id: "c1",
            width: 10,
            height: 5,
            depth: 5,
        };

        // Item: 4x9x4
        // Original (4x9x4) -> Height 9 > Container Height 5 -> Fails
        // Rotated (9x4x4) -> Fits!
        const item: Item = {
            id: "i1",
            name: "Rotatable Item",
            width: 4,
            height: 9,
            depth: 4,
        };

        const result = packItems(container, [item]);

        expect(result.packedItems.length).toBe(1);
        expect(result.unpackedItems.length).toBe(0);

        const packed = result.packedItems[0];

        // Verify dimensions were swapped to fit
        // Should be 9x4x4 or 4x4x9 (if width/depth swap matters? 9 fits in width 10)
        // Actually, our permutation logic tries all.
        // 9x4x4 fits (w=9 <= 10, h=4 <= 5, d=4 <= 5)

        // Check that it fits within bounds
        expect(packed.position.x + packed.width).toBeLessThanOrEqual(container.width);
        expect(packed.position.y + packed.height).toBeLessThanOrEqual(container.height);
        expect(packed.position.z + packed.depth).toBeLessThanOrEqual(container.depth);
    });

    it("should pack multiple items with rotation", () => {
        // Container: 10x10x10
        const container: Container = {
            id: "c1",
            width: 10,
            height: 10,
            depth: 10,
        };

        // Item 1: 12x2x2 (needs rotation to fit in 10x10x10? No, 12 > 10. Wait.)
        // My logic: If ANY dimension > max container dimension, it fails even with rotation unless it fits in diagonal?
        // No, box packing is axis-aligned. So if max(item_dim) > max(container_dim), it never fits.
        // But if max(item_dim) <= max(container_dim), it MIGHT fit.

        // Case: Container 10x5x5.
        // Item A: 2x9x2. Needs rotation to (9x2x2) or (2x2x9 - fails).
        // Item B: 9x2x2. Fits as is.
        const items: Item[] = [
            { id: "i1", name: "A", width: 2, height: 9, depth: 2 },
            { id: "i2", name: "B", width: 9, height: 2, depth: 2 },
        ];

        const result = packItems(container, items);
        expect(result.packedItems.length).toBe(2);
    });
});
