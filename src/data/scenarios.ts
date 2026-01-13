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
        description: "Scaled-up version with 48 items. Classic packing problem where greedy placement fails, but an optimal 'Tetris' arrangement fits everything efficiently.",
        data: {
            container: { id: "cont-tetris-large", width: 100, height: 100, depth: 1200 },
            items: Array.from({ length: 12 }).flatMap((_, i) => [
                { id: `block-a-${i}`, name: "Tetris Block A", width: 60, height: 40, depth: 100, weight: 10, color: "#1E293B" },
                { id: `block-b-${i}`, name: "Tetris Block B", width: 40, height: 60, depth: 100, weight: 10, color: "#334155" },
                { id: `block-c-${i}`, name: "Tetris Block C", width: 60, height: 40, depth: 100, weight: 10, color: "#475569" },
                { id: `block-d-${i}`, name: "Tetris Block D", width: 40, height: 60, depth: 100, weight: 10, color: "#64748B" },
            ]),
            parameters: { containerCount: 2 }
        }
    }
];
