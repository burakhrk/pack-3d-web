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
        name: "Standard Pallet Run",
        description: "14 Euro Pallets attempting to fit into a 20ft Container.",
        data: {
            container: { id: "cont-20ft", width: 590, height: 239, depth: 235 }, // 20ft
            items: [
                ...generateItems("pallet", "Euro Pallet", 14, 120, 14, 80, 25, "#8B4513"),
            ]
        }
    },
    {
        name: "E-Commerce Delivery",
        description: "A delivery truck packed with mixed parcel sizes.",
        data: {
            container: { id: "truck", width: 420, height: 220, depth: 210 }, // Delivery Truck
            items: [
                ...generateItems("large-box", "Large Move Box", 10, 60, 50, 50, 15, "#2563EB"),
                ...generateItems("med-box", "Medium Box", 30, 50, 40, 40, 10, "#3B82F6"),
                ...generateItems("small-parcel", "Small Parcel", 50, 30, 20, 20, 2, "#93C5FD"),
            ]
        }
    },
    {
        name: "Warehouse Transfer (40ft)",
        description: "Large scale transfer using a 40ft container.",
        data: {
            container: { id: "cont-40ft", width: 1203, height: 239, depth: 235 }, // 40ft
            items: [
                ...generateItems("crate", "Industrial Crate", 20, 100, 100, 100, 150, "#4B5563"),
                ...generateItems("drum", "Oil Drum", 40, 60, 90, 60, 50, "#DC2626"),
                ...generateItems("pallet-stack", "Pallet Stack", 10, 120, 100, 80, 200, "#F59E0B"),
            ]
        }
    },
    {
        name: "Fragmentation Stress Test",
        description: "Hundreds of small items to test packing efficiency and performance.",
        data: {
            container: { id: "cont-20ft-stress", width: 590, height: 239, depth: 235 },
            items: [
                ...generateItems("brick", "Brick", 500, 20, 10, 10, 2, "#EF4444"),
            ]
        }
    }
];
