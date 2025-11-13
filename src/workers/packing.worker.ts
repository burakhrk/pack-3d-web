import { PackingInput, PackingResult, ComparisonResult } from "@/types/packing";
import { packItems } from "@/utils/packing-algorithm";
import { packItemsBestFit } from "@/utils/best-fit-algorithm";
import { packItemsGenetic } from "@/utils/genetic-algorithm";

interface WorkerInput extends PackingInput {
  mode?: 'single' | 'compare';
  algorithms?: string[];
}

// Web Worker message handler
self.onmessage = (event: MessageEvent<WorkerInput>) => {
  const { container, items, mode = 'single', algorithms = ['ffd'] } = event.data;

  try {
    if (mode === 'compare') {
      const results: PackingResult[] = [];
      
      if (algorithms.includes('ffd')) {
        const result = packItems(container, items);
        results.push({ ...result, algorithmName: 'First-Fit Decreasing' });
      }
      
      if (algorithms.includes('bestfit')) {
        const result = packItemsBestFit(container, items);
        results.push({ ...result, algorithmName: 'Best-Fit' });
      }
      
      if (algorithms.includes('genetic')) {
        const result = packItemsGenetic(container, items);
        results.push({ ...result, algorithmName: 'Genetic Algorithm' });
      }
      
      results.sort((a, b) => b.utilization - a.utilization);
      
      const comparisonResult: ComparisonResult = {
        results,
        bestAlgorithm: results[0]?.algorithmName || 'Unknown'
      };
      
      self.postMessage({ success: true, comparison: comparisonResult });
    } else {
      const result: PackingResult = packItems(container, items);
      self.postMessage({ success: true, result });
    }
  } catch (error) {
    self.postMessage({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
