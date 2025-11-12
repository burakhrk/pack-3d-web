import { useState } from "react";
import { JsonInput } from "@/components/JsonInput";
import { Scene3D } from "@/components/Scene3D";
import { ItemPanel } from "@/components/ItemPanel";
import { StatsPanel } from "@/components/StatsPanel";
import { usePackingWorker } from "@/hooks/usePackingWorker";
import { PackedItem } from "@/types/packing";
import { Box as BoxIcon } from "lucide-react";

const Index = () => {
  const { runPacking, isProcessing, result } = usePackingWorker();
  const [hoveredItem, setHoveredItem] = useState<PackedItem | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BoxIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                3D Container Packing Visualizer
              </h1>
              <p className="text-sm text-muted-foreground">
                First-Fit Decreasing Algorithm with Interactive 3D View
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input & Stats */}
          <div className="space-y-6">
            <JsonInput onSubmit={runPacking} isProcessing={isProcessing} />
            <StatsPanel result={result} />
          </div>

          {/* Middle Column - 3D Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-[600px]">
              {result ? (
                <Scene3D
                  container={result.container}
                  packedItems={result.packedItems}
                  onItemHover={setHoveredItem}
                />
              ) : (
                <div className="w-full h-full bg-visualization rounded-lg flex items-center justify-center border border-border">
                  <div className="text-center text-muted-foreground">
                    <BoxIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No Data Yet</p>
                    <p className="text-sm mt-2">
                      Enter JSON data and run the packing algorithm to visualize
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Item List Panel */}
            {result && (
              <div className="h-[400px]">
                <ItemPanel
                  packedItems={result.packedItems}
                  unpackedItems={result.unpackedItems}
                  hoveredItem={hoveredItem}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with React, TypeScript, Three.js, and Web Workers • 3D First-Fit Decreasing Algorithm
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
