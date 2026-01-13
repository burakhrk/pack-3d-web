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
        description: "Standard 20ft ISO container shipment. High volume mixed cargo requiring multiple containers.",
        data: {
            container: { id: "cont-20ft", width: 590, height: 239, depth: 235 }, // 20ft Standard
            items: [
                ...generateItems("crate", "Industrial Crate", 32, 100, 100, 100, 150, "#4B5563"),
                ...generateItems("drum", "Oil Drum", 25, 60, 90, 60, 50, "#DC2626"),
                ...generateItems("pallet-stack", "Pallet Stack", 8, 120, 100, 80, 200, "#F59E0B"),
            ],
            parameters: { containerCount: 2 }
        }
    },

    {
        name: "The Tetris Paradox (Modulo Trap)",
        description: "Items A(34) and B(33) pack perfectly as [34, 33, 33] (Sum 100). But Greedy sorts A(34) first, packing [34, 34], leaving a 32 gap where 33 can't fit.",
        data: {
            container: { id: "cont-modulo", width: 100, height: 100, depth: 100 },
            items: [
                ...Array.from({ length: 9 }).map((_, i) => ({ id: `mod-a-${i}`, name: "Block A (34)", width: 34, height: 34, depth: 100, weight: 34, color: "#EF4444" })),
                ...Array.from({ length: 18 }).map((_, i) => ({ id: `mod-b-${i}`, name: "Block B (33)", width: 33, height: 33, depth: 100, weight: 33, color: "#3B82F6" })),
            ],
            parameters: { containerCount: 2 }
        }
    },

    {
        name: "The Leftover Stress Test",
        description: "High volume overflow test. Best algorithms pack 30 items (leave 15). Greedy packs fewer (leaves ~21). Uses 1 container.",
        data: {
            container: { id: "cont-overflow", width: 100, height: 100, depth: 1000 },
            items: [
                ...Array.from({ length: 12 }).map((_, i) => ({ id: `over-a-${i}`, name: "Block A (36)", width: 36, height: 100, depth: 100, weight: 36, color: "#EF4444" })),
                ...Array.from({ length: 24 }).map((_, i) => ({ id: `over-b-${i}`, name: "Block B (32)", width: 32, height: 100, depth: 100, weight: 32, color: "#3B82F6" })),
                ...Array.from({ length: 24 }).map((_, i) => ({ id: `over-c-${i}`, name: "Filler C (18)", width: 18, height: 50, depth: 50, weight: 5, color: "#10B981" })),
                ...Array.from({ length: 6 }).map((_, i) => ({ id: `over-d-${i}`, name: "Awkward D (52)", width: 52, height: 50, depth: 50, weight: 15, color: "#F59E0B" })),
            ],
            parameters: { containerCount: 1 }
        }
    },
];
