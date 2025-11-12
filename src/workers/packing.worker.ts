import { PackingInput, PackingResult } from "@/types/packing";
import { packItems } from "@/utils/packing-algorithm";

// Web Worker message handler
self.onmessage = (event: MessageEvent<PackingInput>) => {
  const { container, items } = event.data;

  try {
    const result: PackingResult = packItems(container, items);
    self.postMessage({ success: true, result });
  } catch (error) {
    self.postMessage({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
