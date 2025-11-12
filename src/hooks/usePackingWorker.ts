import { useState, useCallback, useEffect, useRef } from "react";
import { PackingInput, PackingResult } from "@/types/packing";
import { toast } from "sonner";

export function usePackingWorker() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PackingResult | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create worker on mount
    workerRef.current = new Worker(
      new URL("../workers/packing.worker.ts", import.meta.url),
      { type: "module" }
    );

    // Handle worker messages
    workerRef.current.onmessage = (
      event: MessageEvent<{ success: boolean; result?: PackingResult; error?: string }>
    ) => {
      setIsProcessing(false);
      
      if (event.data.success && event.data.result) {
        setResult(event.data.result);
        toast.success("Packing completed successfully!");
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
    workerRef.current.postMessage(input);
  }, []);

  return { runPacking, isProcessing, result };
}
