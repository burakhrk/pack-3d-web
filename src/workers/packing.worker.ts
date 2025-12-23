import { PackingInput, PackingResult, ComparisonResult, Container } from "@/types/packing";
import { packItems, packItemsMultiContainer } from "@/utils/packing-algorithm";
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
  const containerCount = parameters?.containerCount || 1;
  const res = parameters?.gridResolution || 5;

  try {
    if (mode === 'compare') {
      const results: PackingResult[] = [];
      const totalAlgos = algorithms.length;
      let completedAlgos = 0;

      const updateProgress = (algoProgress: number) => {
        const base = (completedAlgos / totalAlgos) * 100;
        const current = algoProgress / totalAlgos;
        self.postMessage({ success: true, progress: Math.round(base + current) });
      };

      if (algorithms.includes('ffd')) {
        updateProgress(0);
        const result = packItemsMultiContainer(container, items, containerCount, (c, i) => packItems(c, i, res));
        results.push({ ...result, algorithmName: 'First-Fit Decreasing' });
        completedAlgos++;
        updateProgress(100);
      }

      if (algorithms.includes('bestfit')) {
        updateProgress(0);
        const result = packItemsMultiContainer(container, items, containerCount, (c, i) => packItemsBestFit(c, i, res));
        results.push({ ...result, algorithmName: 'Best-Fit' });
        completedAlgos++;
        updateProgress(100);
      }

      if (algorithms.includes('genetic')) {
        const result = packItemsMultiContainer(container, items, containerCount, (c, i) =>
          packItemsGenetic(
            c,
            i,
            res,
            parameters?.geneticGenerations,
            parameters?.mutationRate,
            (p) => updateProgress(p)
          )
        );
        results.push({ ...result, algorithmName: 'Genetic Algorithm' });
        completedAlgos++;
      }

      if (algorithms.includes('sa')) {
        const iterations = parameters?.geneticGenerations ? parameters.geneticGenerations * 10 : 1000;
        const result = packItemsMultiContainer(container, items, containerCount, (c, i) =>
          packItemsSimulatedAnnealing(
            c,
            i,
            {
              initialTemperature: 1000,
              coolingRate: 0.995,
              iterations: iterations,
              gridResolution: res
            }
          )
        );
        results.push({ ...result, algorithmName: 'Simulated Annealing' });
        completedAlgos++;
      }

      results.sort((a, b) => (b.totalUtilization || b.utilization) - (a.totalUtilization || a.utilization));

      const comparisonResult: ComparisonResult = {
        results,
        bestAlgorithm: results[0]?.algorithmName || 'Unknown'
      };

      self.postMessage({ success: true, comparison: comparisonResult, progress: 100 });
    } else {
      // Single mode
      const algo = parameters?.algorithm || 'ffd';
      const onProgress = (p: number) => {
        self.postMessage({ success: true, progress: p });
      };

      const config = parameters || {};
      self.postMessage({ success: true, progress: 10 });

      let result: PackingResult;

      if (algo === 'genetic') {
        result = packItemsMultiContainer(container, items, containerCount, (c, i) =>
          packItemsGenetic(
            c,
            i,
            res,
            config.geneticGenerations || 30,
            config.mutationRate || 0.1,
            onProgress
          )
        );
      } else if (algo === 'bestfit') {
        result = packItemsMultiContainer(container, items, containerCount, (c, i) => packItemsBestFit(c, i, res));
        self.postMessage({ success: true, progress: 100 });
      } else if (algo === 'sa') {
        const iterations = config.geneticGenerations ? config.geneticGenerations * 10 : 1000;
        result = packItemsMultiContainer(container, items, containerCount, (c, i) =>
          packItemsSimulatedAnnealing(
            c,
            i,
            {
              initialTemperature: 1000,
              coolingRate: 0.995,
              iterations: iterations,
              gridResolution: res
            },
            onProgress
          )
        );
      } else {
        // Default ffd
        result = packItemsMultiContainer(container, items, containerCount, (c, i) => packItems(c, i, res));
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
