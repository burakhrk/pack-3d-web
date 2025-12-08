import { useState, useCallback, useEffect, useRef } from "react";
import { PackingInput, PackingResult, ComparisonResult } from "@/types/packing";
import { toast } from "sonner";

export function usePackingWorker() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PackingResult | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [progress, setProgress] = useState(0);
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
        error?: string;
        progress?: number;
      }>
    ) => {
      // Don't set isProcessing to false until result/error comes
      if (event.data.progress !== undefined) {
        setProgress(event.data.progress);
      }

      if (event.data.success) {
        if (event.data.result) {
          setResult(event.data.result);
          setComparison(null);
          setIsProcessing(false);
          setProgress(100);
          toast.success("Packing completed successfully!");
        } else if (event.data.comparison) {
          setComparison(event.data.comparison);
          setResult(event.data.comparison.results[0]);
          setIsProcessing(false);
          setProgress(100);
          toast.success(`Best algorithm: ${event.data.comparison.bestAlgorithm}`);
        }
      } else if (event.data.error) {
        setIsProcessing(false);
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
    setProgress(0);
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
    setProgress(0);
    setResult(null);
    setComparison(null);
    workerRef.current.postMessage({
      ...input,
      mode: 'compare',
      algorithms
    });
  }, []);

  return { runPacking, runComparison, isProcessing, progress, result, comparison, setResult };
}
