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
        name: "The Tetris Paradox (Complex Trap)",
        description: "Complex Geometric Trap. Set A (Square+Strip): [65x65, 35x100, 65x35]. Set B (Twin Rects): [55x100, 45x55, 45x45]. Varied shapes require perfect 2D layer planning. Greedy fails geometry.",
        data: {
            container: { id: "cont-complex-trap", width: 100, height: 100, depth: 500 },
            items: [
                // Set A (3 Layers): High-volume Square lead
                ...Array.from({ length: 3 }).map((_, i) => ({ id: `trapA-sq-${i}`, name: "A-Square (65x65)", width: 65, height: 65, depth: 100, weight: 42, color: "#DC2626" })), // Red
                ...Array.from({ length: 3 }).map((_, i) => ({ id: `trapA-col-${i}`, name: "A-Column (35x100)", width: 35, height: 100, depth: 100, weight: 35, color: "#F87171" })), // Light Red
                ...Array.from({ length: 3 }).map((_, i) => ({ id: `trapA-row-${i}`, name: "A-Row (65x35)", width: 65, height: 35, depth: 100, weight: 22, color: "#FECACA" })), // Pale Red

                // Set B (2 Layers): High-volume Rect lead
                ...Array.from({ length: 2 }).map((_, i) => ({ id: `trapB-main-${i}`, name: "B-Main (55x100)", width: 55, height: 100, depth: 100, weight: 55, color: "#2563EB" })), // Blue
                ...Array.from({ length: 2 }).map((_, i) => ({ id: `trapB-sub1-${i}`, name: "B-Sub1 (45x55)", width: 45, height: 55, depth: 100, weight: 24, color: "#60A5FA" })), // Light Blue
                ...Array.from({ length: 2 }).map((_, i) => ({ id: `trapB-sub2-${i}`, name: "B-Sub2 (45x45)", width: 45, height: 45, depth: 100, weight: 20, color: "#BFDBFE" })), // Pale Blue
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
