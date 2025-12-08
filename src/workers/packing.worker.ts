import { PackingInput, PackingResult, ComparisonResult } from "@/types/packing";
import { packItems } from "@/utils/packing-algorithm";
import { packItemsBestFit } from "@/utils/best-fit-algorithm";
import { packItemsSimulatedAnnealing } from "@/utils/simulated-annealing";
import { packItemsGenetic } from "@/utils/genetic-algorithm";

interface WorkerInput extends PackingInput {
  mode?: 'single' | 'compare';
  algorithms?: string[];
}

// Web Worker message handler
self.onmessage = (event: MessageEvent<WorkerInput>) => {
  const { container, items, mode = 'single', algorithms = ['ffd'], parameters } = event.data;

  try {
    if (mode === 'compare') {
      const results: PackingResult[] = [];
      const totalAlgos = algorithms.length;
      let completedAlgos = 0;

      const updateProgress = (algoProgress: number) => {
        // overarching progress: (completedAlgos / total) * 100 + (currentAlgo / total)
        const base = (completedAlgos / totalAlgos) * 100;
        const current = algoProgress / totalAlgos;
        self.postMessage({ success: true, progress: Math.round(base + current) });
      };

      if (algorithms.includes('ffd')) {
        updateProgress(0);
        const result = packItems(container, items, parameters?.gridResolution);
        results.push({ ...result, algorithmName: 'First-Fit Decreasing' });
        completedAlgos++;
        updateProgress(100);
      }

      if (algorithms.includes('bestfit')) {
        updateProgress(0);
        const result = packItemsBestFit(container, items, parameters?.gridResolution);
        results.push({ ...result, algorithmName: 'Best-Fit' });
        completedAlgos++;
        updateProgress(100);
      }

      if (algorithms.includes('genetic')) {
        const result = packItemsGenetic(
          container,
          items,
          parameters?.gridResolution,
          parameters?.geneticGenerations,
          parameters?.mutationRate,
          (p) => updateProgress(p) // Forward genetic progress
        );
        results.push({ ...result, algorithmName: 'Genetic Algorithm' });
        completedAlgos++;
      }

      results.sort((a, b) => b.utilization - a.utilization);

      const comparisonResult: ComparisonResult = {
        results,
        bestAlgorithm: results[0]?.algorithmName || 'Unknown'
      };

      self.postMessage({ success: true, comparison: comparisonResult, progress: 100 });
    } else {
      // Single mode
      const algo = parameters?.algorithm || 'ffd'; // Use parameter or default
      const onProgress = (p: number) => {
        self.postMessage({ success: true, progress: p });
      };

      const config = parameters || {};
      const res = config.gridResolution || 5;

      self.postMessage({ success: true, progress: 10 });

      let result: PackingResult;

      if (algo === 'genetic') {
        result = packItemsGenetic(
          container,
          items,
          res,
          config.geneticGenerations || 30,
          config.mutationRate || 0.1,
          onProgress
        );
      } else if (algo === 'bestfit') {
        result = packItemsBestFit(container, items, res);
        self.postMessage({ success: true, progress: 100 });
      } else if (algo === 'sa') {
        // Reuse geneticGenerations as iterations count for SA
        const iterations = config.geneticGenerations ? config.geneticGenerations * 10 : 1000;

        result = packItemsSimulatedAnnealing(
          container,
          items,
          {
            initialTemperature: 1000,
            coolingRate: 0.995,
            iterations: iterations,
            gridResolution: res
          },
          onProgress
        );
      } else {
        // Default ffd
        result = packItems(container, items, res);
        self.postMessage({ success: true, progress: 100 });
      }

      // Add algorithm name to result
      let algoName = 'First-Fit Decreasing';
      if (algo === 'genetic') algoName = 'Genetic Algorithm';
      if (algo === 'bestfit') algoName = 'Best-Fit';
      if (algo === 'sa') algoName = 'Simulated Annealing';

      result.algorithmName = algoName;

      self.postMessage({ success: true, result });
    }
  } catch (error) {
    self.postMessage({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
