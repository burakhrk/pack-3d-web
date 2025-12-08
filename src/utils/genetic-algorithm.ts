import { Item, PackedItem, Container, PackingResult } from "@/types/packing";
import {
  fitsInContainer,
  hasCollision,
  calculateVolume,
  calculateUtilization,
} from "./collision";
import { getAllOrientations } from "./rotation";

const ITEM_COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16",
];

interface Chromosome {
  sequence: number[];
  fitness: number;
}

/**
 * Genetic Algorithm for bin packing
 * Uses evolution to find optimal item ordering
 */
export function packItemsGenetic(
  container: Container,
  items: Item[],
  gridResolution: number = 5,
  generations: number = 30,
  mutationRate: number = 0.1,
  onProgress?: (percent: number) => void
): PackingResult {
  const POPULATION_SIZE = 20;

  let population = initializePopulation(items.length, POPULATION_SIZE);

  for (let gen = 0; gen < generations; gen++) {
    // Report progress
    if (onProgress) {
      // Calculate percentage (0 to 100)
      onProgress(Math.round((gen / generations) * 100));
    }

    // Evaluate fitness
    population.forEach(chromosome => {
      chromosome.fitness = evaluateFitness(chromosome, items, container, gridResolution);
    });

    // Selection and reproduction
    population = evolvePopulation(population, mutationRate);
  }

  if (onProgress) onProgress(100);

  // Get best solution
  population.sort((a, b) => b.fitness - a.fitness);
  const bestSequence = population[0].sequence;

  return packWithSequence(container, items, bestSequence, gridResolution);
}

function initializePopulation(itemCount: number, populationSize: number): Chromosome[] {
  const population: Chromosome[] = [];

  for (let i = 0; i < populationSize; i++) {
    const sequence = Array.from({ length: itemCount }, (_, idx) => idx);
    // Shuffle
    for (let j = sequence.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [sequence[j], sequence[k]] = [sequence[k], sequence[j]];
    }
    population.push({ sequence, fitness: 0 });
  }

  return population;
}

function evaluateFitness(chromosome: Chromosome, items: Item[], container: Container, gridResolution: number): number {
  const result = packWithSequence(container, items, chromosome.sequence, gridResolution);
  return result.utilization;
}

function evolvePopulation(population: Chromosome[], mutationRate: number): Chromosome[] {
  const newPopulation: Chromosome[] = [];

  // Keep best 20%
  population.sort((a, b) => b.fitness - a.fitness);
  const eliteCount = Math.floor(population.length * 0.2);
  newPopulation.push(...population.slice(0, eliteCount));

  // Crossover and mutation
  while (newPopulation.length < population.length) {
    const parent1 = selectParent(population);
    const parent2 = selectParent(population);

    let child = crossover(parent1, parent2);

    if (Math.random() < mutationRate) {
      child = mutate(child);
    }

    newPopulation.push(child);
  }

  return newPopulation;
}

function selectParent(population: Chromosome[]): Chromosome {
  // Tournament selection
  const tournamentSize = 3;
  let best = population[Math.floor(Math.random() * population.length)];

  for (let i = 1; i < tournamentSize; i++) {
    const candidate = population[Math.floor(Math.random() * population.length)];
    if (candidate.fitness > best.fitness) {
      best = candidate;
    }
  }

  return best;
}

function crossover(parent1: Chromosome, parent2: Chromosome): Chromosome {
  const length = parent1.sequence.length;
  const point = Math.floor(Math.random() * length);

  const childSequence = [...parent1.sequence.slice(0, point)];

  parent2.sequence.forEach(gene => {
    if (!childSequence.includes(gene)) {
      childSequence.push(gene);
    }
  });

  return { sequence: childSequence, fitness: 0 };
}

function mutate(chromosome: Chromosome): Chromosome {
  const sequence = [...chromosome.sequence];
  const i = Math.floor(Math.random() * sequence.length);
  const j = Math.floor(Math.random() * sequence.length);

  [sequence[i], sequence[j]] = [sequence[j], sequence[i]];

  return { sequence, fitness: 0 };
}

function packWithSequence(container: Container, items: Item[], sequence: number[], gridResolution: number = 0.5): PackingResult {
  const packedItems: PackedItem[] = [];
  const unpackedItems: Item[] = [];
  const step = gridResolution;

  sequence.forEach((idx, colorIdx) => {
    const item = items[idx];
    let placed = false;
    const orientations = getAllOrientations(item);

    // Try each orientation
    for (const orientation of orientations) {
      if (placed) break; // Skip other orientations if already placed

      for (let y = 0; y <= container.height - orientation.height && !placed; y += step) {
        for (let z = 0; z <= container.depth - orientation.depth && !placed; z += step) {
          for (let x = 0; x <= container.width - orientation.width && !placed; x += step) {
            const position = { x, y, z };

            if (
              fitsInContainer(orientation, position, container) &&
              !hasCollision(orientation, position, packedItems)
            ) {
              packedItems.push({
                ...orientation,
                position,
                color: ITEM_COLORS[colorIdx % ITEM_COLORS.length],
              });
              placed = true;
            }
          }
        }
      }
    }

    if (!placed) {
      unpackedItems.push(item);
    }
  });

  const containerVolume = calculateVolume(container);
  const usedVolume = packedItems.reduce(
    (sum, item) => sum + calculateVolume(item),
    0
  );
  const utilization = calculateUtilization(containerVolume, usedVolume);

  return {
    container,
    packedItems,
    unpackedItems,
    utilization,
    totalVolume: containerVolume,
    usedVolume,
  };
}
