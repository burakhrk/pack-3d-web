import { PackingInput, Item } from "@/types/packing";

interface Scenario {
    name: string;
    description: string;
    data: PackingInput;
}

const generateItems = (baseId: string, name: string, count: number, w: number, h: number, d: number, color?: string): Item[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `${baseId}-${i}`,
        name: name,
        width: w,
        height: h,
        depth: d,
        weight: 0,
        color: color // Optional, helper will need to handle this if we want specific colors
    }));
};

export const scenarios: Scenario[] = [
    {
        name: "Classic Heterogeneous",
        description: "A standard mix of different sized boxes.",
        data: {
            container: { id: "cont-1", width: 10, height: 10, depth: 10 },
            items: [
                ...generateItems("large", "Large Box", 2, 5, 5, 5),
                ...generateItems("medium", "Medium Box", 5, 3, 3, 3),
                ...generateItems("small", "Small Box", 10, 2, 2, 2),
                ...generateItems("long", "Long Box", 4, 8, 2, 2),
            ]
        }
    },
    {
        name: "Fragmentation Test",
        description: "Many small items that are hard to pack efficiently without gaps.",
        data: {
            container: { id: "cont-2", width: 15, height: 10, depth: 5 },
            items: [
                ...generateItems("cube", "Cube", 50, 2, 2, 2),
                ...generateItems("slab", "Slab", 10, 4, 4, 1),
                ...generateItems("stick", "Stick", 20, 1, 1, 5),
            ]
        }
    },
    {
        name: "Perfect Fit Challenge",
        description: "Items should theoretically fill the container 100%.",
        data: {
            container: { id: "cont-3", width: 4, height: 4, depth: 4 },
            items: [
                ...generateItems("2x2x2", "2x2 Cube", 8, 2, 2, 2),
            ]
        }
    },
    {
        name: "Golden Ratio Spiral",
        description: "A sequence of decreasing sizes, challenging for greedy algorithms.",
        data: {
            container: { id: "cont-4", width: 10, height: 10, depth: 10 },
            items: [
                { id: "fib-1", name: "G1", width: 8, height: 8, depth: 8 },
                { id: "fib-2", name: "G2", width: 5, height: 5, depth: 5 },
                { id: "fib-3", name: "G3", width: 3, height: 3, depth: 3 },
                { id: "fib-4", name: "G4", width: 2, height: 2, depth: 2 },
                { id: "fib-5", name: "G5", width: 1, height: 1, depth: 1 },
                // Fillers
                ...generateItems("filler", "Filler", 20, 1, 1, 1)
            ]
        }
    }
];
