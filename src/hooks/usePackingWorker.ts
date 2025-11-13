import { useState, useCallback, useEffect, useRef } from "react";
import { PackingInput, PackingResult, ComparisonResult } from "@/types/packing";
import { toast } from "sonner";

export function usePackingWorker() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PackingResult | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create worker on mount
    workerRef.current = new Worker(
      new URL("../workers/packing.worker.ts", import.meta.url),
      { type: "module" }
    );

    // Handle worker messages
    workerRef.current.onmessage = (
      event: MessageEvent<{ 
        success: boolean; 
        result?: PackingResult; 
        comparison?: ComparisonResult;
        error?: string 
      }>
    ) => {
      setIsProcessing(false);
      
      if (event.data.success) {
        if (event.data.result) {
          setResult(event.data.result);
          setComparison(null);
          toast.success("Packing completed successfully!");
        } else if (event.data.comparison) {
          setComparison(event.data.comparison);
          setResult(event.data.comparison.results[0]);
          toast.success(`Best algorithm: ${event.data.comparison.bestAlgorithm}`);
        }
      } else {
        toast.error(`Packing failed: ${event.data.error}`);
      }
    };

    // Cleanup worker on unmount
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const runPacking = useCallback((input: PackingInput) => {
    if (!workerRef.current) {
      toast.error("Worker not initialized");
      return;
    }

    setIsProcessing(true);
    setResult(null);
    setComparison(null);
    workerRef.current.postMessage(input);
  }, []);

  const runComparison = useCallback((input: PackingInput, algorithms: string[]) => {
    if (!workerRef.current) {
      toast.error("Worker not initialized");
      return;
    }

    setIsProcessing(true);
    setResult(null);
    setComparison(null);
    workerRef.current.postMessage({ 
      ...input, 
      mode: 'compare',
      algorithms 
    });
  }, []);

  return { runPacking, runComparison, isProcessing, result, comparison };
}
