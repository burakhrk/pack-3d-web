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
        name: "The Tetris Paradox (Dual Modulo Trap)",
        description: "Mixed Trap. Set 1: [34, 33, 33]=100. Set 2: [40, 30, 30]=100. Greedy mixes them (40+34=74) leaving unfillable 26 gaps. GA should separate sets.",
        data: {
            container: { id: "cont-dual-trap", width: 100, height: 100, depth: 500 },
            items: [
                ...Array.from({ length: 9 }).map((_, i) => ({ id: `trap1-a-${i}`, name: "Trap1 A (34)", width: 34, height: 34, depth: 100, weight: 34, color: "#EF4444" })),
                ...Array.from({ length: 18 }).map((_, i) => ({ id: `trap1-b-${i}`, name: "Trap1 B (33)", width: 33, height: 33, depth: 100, weight: 33, color: "#3B82F6" })),
                ...Array.from({ length: 6 }).map((_, i) => ({ id: `trap2-c-${i}`, name: "Trap2 C (40)", width: 40, height: 40, depth: 100, weight: 40, color: "#10B981" })),
                ...Array.from({ length: 12 }).map((_, i) => ({ id: `trap2-d-${i}`, name: "Trap2 D (30)", width: 30, height: 30, depth: 100, weight: 30, color: "#F59E0B" })),
            ],
            parameters: { containerCount: 1 }
        }
    },

    {
        name: "The Leftover Stress Test",
        description: "High volume overflow test. Best algorithms pack 30 items (leave 15). Greedy packs fewer (leaves ~21). Uses 1 container.",
        data: {
            container: { id: "cont-overflow", width: 100, height: 100, depth: 1200 },
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
