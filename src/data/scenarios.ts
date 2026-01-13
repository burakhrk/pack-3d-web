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
                ...generateItems("crate", "Industrial Crate", 15, 100, 100, 100, 150, "#4B5563"),
                ...generateItems("drum", "Oil Drum", 15, 60, 90, 60, 50, "#DC2626"),
                ...generateItems("pallet", "Pallet Stack", 8, 120, 100, 80, 200, "#F59E0B"),
                ...generateItems("long", "Long Box (200)", 8, 200, 50, 50, 80, "#2563EB"), // Blue - Long
                ...generateItems("tall", "Tall Machine (180)", 8, 60, 180, 60, 120, "#7C3AED"), // Purple - Tall
                ...generateItems("small", "Small Parts", 30, 30, 30, 30, 10, "#10B981"), // Green - Filler
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
            parameters: { containerCount: 2, gridResolution: 5 }
        }
    },

    {
        name: "The Diversity Stress Test",
        description: "High Variance. Mix of Giants, Bars, and true 3D Small Cubes. Tests ability to pack small items into gaps left by large ones. Approx 100 items.",
        data: {
            container: { id: "cont-diversity", width: 100, height: 100, depth: 500 },
            items: [
                ...Array.from({ length: 4 }).map((_, i) => ({ id: `giant-${i}`, name: "Giant (70x60)", width: 70, height: 60, depth: 100, weight: 100, color: "#7F1D1D" })),
                ...Array.from({ length: 8 }).map((_, i) => ({ id: `big-${i}`, name: "Big (45x45)", width: 45, height: 45, depth: 100, weight: 50, color: "#C2410C" })),
                ...Array.from({ length: 15 }).map((_, i) => ({ id: `bar-${i}`, name: "Bar (20x20)", width: 20, height: 20, depth: 100, weight: 15, color: "#15803D" })),
                ...Array.from({ length: 40 }).map((_, i) => ({ id: `cube-${i}`, name: "Cube (25)", width: 25, height: 25, depth: 25, weight: 5, color: "#047857" })),
                ...Array.from({ length: 30 }).map((_, i) => ({ id: `tiny-${i}`, name: "Tiny (10)", width: 10, height: 10, depth: 10, weight: 1, color: "#0E7490" })),
            ],
            parameters: { containerCount: 1 }
        }
    },
];
