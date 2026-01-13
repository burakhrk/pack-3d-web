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
        name: "Fragmentation Stress Test",
        description: "Hundreds of small items to test packing efficiency and performance.",
        data: {
            container: { id: "cont-20ft-stress", width: 590, height: 239, depth: 235 },
            items: [
                ...generateItems("brick", "Brick", 500, 20, 10, 10, 2, "#EF4444"),
            ],
            parameters: { containerCount: 1 }
        }
    },
    {
        name: "The Tetris Paradox",
        description: "A classic packing problem where greedy placement leaves a hole that's too small for the final item, but a 'Tetris' arrangement fits everything into one container.",
        data: {
            container: { id: "cont-100", width: 100, height: 100, depth: 100 },
            items: [
                ...generateItems("block-a", "Tetris Block A", 1, 60, 40, 100, 10, "#1E293B"),
                ...generateItems("block-b", "Tetris Block B", 1, 40, 60, 100, 10, "#334155"),
                ...generateItems("block-c", "Tetris Block C", 1, 60, 40, 100, 10, "#475569"),
                ...generateItems("block-d", "Tetris Block D", 1, 40, 60, 100, 10, "#64748B"),
            ],
            parameters: { containerCount: 2 }
        }
    }
];
