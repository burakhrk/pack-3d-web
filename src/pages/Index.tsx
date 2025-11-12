import { useState, useRef } from "react";
import { JsonInput } from "@/components/JsonInput";
import { ContainerForm } from "@/components/ContainerForm";
import { ItemManager } from "@/components/ItemManager";
import { ItemPrefabs } from "@/components/ItemPrefabs";
import { Scene3D } from "@/components/Scene3D";
import { ItemPanel } from "@/components/ItemPanel";
import { StatsPanel } from "@/components/StatsPanel";
import { usePackingWorker } from "@/hooks/usePackingWorker";
import { PackedItem, Container, Item, PackingInput } from "@/types/packing";
import { Box as BoxIcon, PlayCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Index = () => {
  const { runPacking, isProcessing, result } = usePackingWorker();
  const [hoveredItem, setHoveredItem] = useState<PackedItem | null>(null);
  const [currentItemForm, setCurrentItemForm] = useState({
    name: "",
    width: 1,
    height: 1,
    depth: 1,
    weight: 0,
  });
  const loadPrefabRef = useRef<((prefab: any) => void) | null>(null);
  
  // State for container and items
  const [container, setContainer] = useState<Container>({
    id: "container-1",
    width: 10,
    height: 10,
    depth: 10,
  });
  
  const [items, setItems] = useState<Item[]>([
    { id: "item-1", name: "Box A", width: 3, height: 3, depth: 3 },
    { id: "item-2", name: "Box B", width: 2, height: 4, depth: 2 },
    { id: "item-3", name: "Box C", width: 5, height: 2, depth: 3 },
    { id: "item-4", name: "Box D", width: 2, height: 2, depth: 2 },
    { id: "item-5", name: "Box E", width: 4, height: 3, depth: 2 },
  ]);

  const handleAddItem = (itemOrItems: Item | Item[]) => {
    if (Array.isArray(itemOrItems)) {
      setItems([...items, ...itemOrItems]);
    } else {
      setItems([...items, itemOrItems]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
    toast.success("Item removed");
  };

  const handleClearAllItems = () => {
    setItems([]);
  };

  const handleImportJson = (data: PackingInput) => {
    setContainer(data.container);
    setItems(data.items);
  };

  const handleExportJson = (): PackingInput => {
    return { container, items };
  };

  const handleRunPacking = () => {
    if (items.length === 0) {
      toast.error("Please add at least one item to pack");
      return;
    }
    runPacking({ container, items });
  };

  const handleLoadPrefab = (prefab: any) => {
    if (loadPrefabRef.current) {
      loadPrefabRef.current(prefab);
    }
  };

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
            <Tabs defaultValue="visual" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="visual">Visual Editor</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="json">JSON Import</TabsTrigger>
              </TabsList>
              
              <TabsContent value="visual" className="space-y-6 mt-4">
                <ContainerForm container={container} onUpdate={setContainer} />
                <ItemPrefabs
                  currentItem={currentItemForm}
                  onLoadPrefab={handleLoadPrefab}
                />
                <div className="h-[600px]">
                  <ItemManager
                    items={items}
                    onAdd={handleAddItem}
                    onRemove={handleRemoveItem}
                    onClearAll={handleClearAllItems}
                    disabled={isProcessing}
                    onItemFormChange={setCurrentItemForm}
                    onLoadPrefab={(fn) => {
                      loadPrefabRef.current = fn;
                    }}
                  />
                </div>
                <Button
                  onClick={handleRunPacking}
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  {isProcessing ? "Processing..." : "Run Packing Algorithm"}
                </Button>
              </TabsContent>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="h-[400px]">
                  {result ? (
                    <ItemPanel
                      packedItems={result.packedItems}
                      unpackedItems={result.unpackedItems}
                      hoveredItem={hoveredItem}
                    />
                  ) : (
                    <Card className="h-full flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No packing results yet</p>
                        <p className="text-xs">Run the algorithm to see packed items</p>
                      </div>
                    </Card>
                  )}
                </div>
                <StatsPanel result={result} />
              </TabsContent>
              
              <TabsContent value="json" className="mt-4">
                <JsonInput
                  onImport={handleImportJson}
                  onExport={handleExportJson}
                  isProcessing={isProcessing}
                />
              </TabsContent>
            </Tabs>
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

            {/* Item List Panel below 3D canvas */}
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
