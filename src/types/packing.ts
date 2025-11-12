export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Container extends Dimensions {
  id: string;
}

export interface Item extends Dimensions {
  id: string;
  name: string;
  weight?: number;
}

export interface PackedItem extends Item {
  position: {
    x: number;
    y: number;
    z: number;
  };
  color: string;
  rotated?: boolean;
}

export interface PackingResult {
  container: Container;
  packedItems: PackedItem[];
  unpackedItems: Item[];
  utilization: number;
  totalVolume: number;
  usedVolume: number;
}

export interface PackingInput {
  container: Container;
  items: Item[];
}
