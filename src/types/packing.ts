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
  algorithmName?: string;

  // Multi-container support
  containers?: ContainerResult[];
  totalUtilization?: number;
  isMultiContainer?: boolean;
}

export interface ContainerResult {
  id: string; // To distinguish between containers of the same dimensions
  container: Container;
  packedItems: PackedItem[];
  utilization: number;
  totalVolume: number;
  usedVolume: number;
}

export interface ComparisonResult {
  results: PackingResult[];
  bestAlgorithm: string;
}

export interface AlgorithmParameters {
  gridResolution?: number;
  geneticGenerations?: number;
  mutationRate?: number;
  algorithm?: string;
  containerCount?: number;
}

export interface PackingInput {
  container: Container;
  containers?: Container[]; // If provided, uses these specific containers
  items: Item[];
  parameters?: AlgorithmParameters;
}
