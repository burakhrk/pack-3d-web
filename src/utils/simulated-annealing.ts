import { Item, PackedItem, Container, PackingResult } from "@/types/packing";
import { packItems } from "./packing-algorithm";
import { calculateVolume } from "./collision";

/**
 * Simulated Annealing Algorithm for 3D Packing
 * 
 * Strategy:
 * 1. Start with an initial sequence of items.
 * 2. Pack them using a heuristic (First-Fit Decreasing via packItems).
 * 3. Calculate "Energy" (Wasted Volume).
 * 4. Iterate (cool down):
 *    a. Swap two random items in the sequence.
 *    b. Repack and measure new Energy.
 *    c. If new Energy is lower (better), accept.
 *    d. If new Energy is higher (worse), accept with probability P = exp(-(dE) / T).
 *    e. Lower Temperature.
 */

interface SAParameters {
    initialTemperature: number;
    coolingRate: number;
    iterations: number;
    gridResolution?: number;
}

export function packItemsSimulatedAnnealing(
    container: Container,
    items: Item[],
    params: SAParameters,
    onProgress?: (progress: number) => void
): PackingResult {
    const { initialTemperature, coolingRate, iterations, gridResolution = 5 } = params;

    // 1. Initial State
    // Sort by volume descending as a good starting point (FFD is usually strong)
    let currentSequence = [...items].sort((a, b) => calculateVolume(b) - calculateVolume(a));
    let bestSequence = [...currentSequence];

    let currentResult = packItems(container, currentSequence, gridResolution);
    let bestResult = currentResult;

    // Minimize wasted volume (Maximize used volume)
    // Energy = Total Volume - Used Volume
    // Lower Energy is Better.
    const totalContainerVolume = calculateVolume(container);

    let currentEnergy = totalContainerVolume - currentResult.usedVolume;
    let bestEnergy = currentEnergy;

    let temperature = initialTemperature;

    for (let i = 0; i < iterations; i++) {
        // Progress update
        if (i % 5 === 0 && onProgress) {
            onProgress(Math.round((i / iterations) * 100));
        }

        // 2. Generate Neighbor (Swap 2 random items)
        // We only swap if we have at least 2 items
        const neighborSequence = [...currentSequence];
        if (neighborSequence.length >= 2) {
            const idx1 = Math.floor(Math.random() * neighborSequence.length);
            const idx2 = Math.floor(Math.random() * neighborSequence.length);
            [neighborSequence[idx1], neighborSequence[idx2]] = [neighborSequence[idx2], neighborSequence[idx1]];
        }

        // 3. Evaluate Neighbor
        const neighborResult = packItems(container, neighborSequence, gridResolution);
        const neighborEnergy = totalContainerVolume - neighborResult.usedVolume;

        // 4. Acceptance Probability
        const deltaEnergy = neighborEnergy - currentEnergy;

        if (deltaEnergy < 0) {
            // Improvement: Always accept
            currentSequence = neighborSequence;
            currentEnergy = neighborEnergy;
            currentResult = neighborResult;

            // Check global best
            if (neighborEnergy < bestEnergy) {
                bestSequence = neighborSequence;
                bestEnergy = neighborEnergy;
                bestResult = neighborResult;
            }
        } else {
            // Worsening: Accept with probability
            const probability = Math.exp(-deltaEnergy / temperature);
            if (Math.random() < probability) {
                currentSequence = neighborSequence;
                currentEnergy = neighborEnergy;
                currentResult = neighborResult;
            }
        }

        // 5. Cool Down
        temperature *= coolingRate;

        // Safety break if temp is too low
        if (temperature < 0.0001) break;
    }

    if (onProgress) onProgress(100);

    return bestResult;
}
