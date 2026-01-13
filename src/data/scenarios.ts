import { PackingInput, Item } from "@/types/packing";

interface Scenario {
    name: string;
    description: string;
    data: PackingInput;
}

const generateItems = (baseId: string, name: string, count: number, w: number, h: number, d: number, weight?: number, color?: string): Item[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `${baseId}-${i}`,
        name: name,
        width: w,
        height: h,
        depth: d,
        weight: weight || 0,
        color: color
    }));
};

export const scenarios: Scenario[] = [

    {
        name: "Warehouse Transfer (Multi-Container)",
        description: "Large scale transfer requiring multiple 40ft containers due to high volume.",
        data: {
            container: { id: "cont-40ft", width: 1203, height: 239, depth: 235 }, // 40ft
            items: [
                ...generateItems("crate", "Industrial Crate", 60, 100, 100, 100, 150, "#4B5563"),
                ...generateItems("drum", "Oil Drum", 40, 60, 90, 60, 50, "#DC2626"),
                ...generateItems("pallet-stack", "Pallet Stack", 10, 120, 100, 80, 200, "#F59E0B"),
            ],
            parameters: { containerCount: 2 }
        }
    },

    {
        name: "The Tetris Paradox",
        description: "The 'Bad Shelf' Trap (Small Batch). 10 layers of A+B+C. Depth 1300 provides 30% slack for optimal packing (Needs 1000). Greedy algorithms fall into the double-packing trap, wasting 30% width and requiring 1500 depth, forcing a 2nd container. GA should easily fit 1 box.",
        data: {
            container: { id: "cont-tetris-trap", width: 100, height: 100, depth: 1300 },
            items: [
                ...Array.from({ length: 10 }).map((_, i) => ({ id: `block-a-${i}`, name: "Base Block A (100x60)", width: 100, height: 60, depth: 100, weight: 10, color: "#1E293B" })),
                ...Array.from({ length: 10 }).map((_, i) => ({ id: `block-b-${i}`, name: "Filler Block B (35x40)", width: 35, height: 40, depth: 100, weight: 10, color: "#334155" })),
                ...Array.from({ length: 10 }).map((_, i) => ({ id: `block-c-${i}`, name: "Filler Block C (65x40)", width: 65, height: 40, depth: 100, weight: 10, color: "#475569" })),
            ],
            parameters: { containerCount: 2 }
        }
    }
];
