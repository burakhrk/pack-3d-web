import { useState, useRef } from "react";
import { JsonInput } from "@/components/JsonInput";
import { ContainerForm } from "@/components/ContainerForm";
import { ItemManager } from "@/components/ItemManager";
import { ItemPrefabs } from "@/components/ItemPrefabs";
import { Scene3D } from "@/components/Scene3D";
import { ItemPanel } from "@/components/ItemPanel";
import { StatsPanel } from "@/components/StatsPanel";
import { AlgorithmSettings } from "@/components/AlgorithmSettings";
import { usePackingWorker } from "@/hooks/usePackingWorker";
import { ComparisonPanel } from "@/components/ComparisonPanel";
import { ScenarioSelector } from "@/components/ScenarioSelector";
import { PackedItem, Container, Item, PackingInput } from "@/types/packing";
import { Box as BoxIcon, PlayCircle, Package, Settings2, Database, FileJson, BarChart3, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Index = () => {
  const { runPacking, runComparison, isProcessing, progress, result, comparison, setResult } = usePackingWorker();
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
    id: "container-default",
    width: 590,
    height: 239,
    depth: 235,
  });

  const [items, setItems] = useState<Item[]>([]);

  // Algorithm parameters
  const [gridResolution, setGridResolution] = useState(10);
  const [geneticGenerations, setGeneticGenerations] = useState(30);
  const [mutationRate, setMutationRate] = useState(0.1);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("ffd");

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

    // Safety check for performance
    const maxDim = Math.max(container.width, container.height, container.depth);
    if (maxDim > 100 && gridResolution < 1) {
      toast.error("Grid resolution is too low for this container size! Please increase it to at least 1 or 5 to prevent freezing.");
      return;
    }

    runPacking({
      container,
      items,
      parameters: { gridResolution, geneticGenerations, mutationRate, algorithm: selectedAlgorithm }
    });
  };

  const handleRunComparison = () => {
    if (items.length === 0) {
      toast.error("Please add at least one item to pack");
      return;
    }
    runComparison(
      {
        container,
        items,
        parameters: { gridResolution, geneticGenerations, mutationRate }
      },
      ['ffd', 'bestfit', 'genetic']
    );
  };

  const handleLoadPrefab = (prefab: any) => {
    if (loadPrefabRef.current) {
      loadPrefabRef.current(prefab);
    }
  };

  const [sidebarTab, setSidebarTab] = useState("editor");

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex-none border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary rounded-lg shadow-sm">
              <BoxIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight leading-none">
                3D Packer
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Workstation
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal">

          {/* LEFT SIDEBAR: CONFIGURATION */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={30} className="bg-muted/10 border-r border-border">
            <Tabs value={sidebarTab} onValueChange={setSidebarTab} className="h-full flex flex-col">
              <div className="p-2 border-b border-border bg-background flex-none">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="editor" title="Editor"><Settings2 className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="scenarios" title="Scenarios"><Database className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="json" title="Data"><FileJson className="h-4 w-4" /></TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 min-h-0 relative">
                <TabsContent value="editor" className="h-full absolute inset-0 m-0 border-0 data-[state=active]:flex flex-col">
                  <ScrollArea className="flex-1">
                    <div className="p-4 space-y-6">
                      <section className="space-y-3">
                        <div className="flex items-center gap-2">
                          <BoxIcon className="h-4 w-4 text-primary" />
                          <h3 className="font-semibold text-sm">Container</h3>
                        </div>
                        <ContainerForm container={container} onUpdate={setContainer} />
                      </section>

                      <div className="h-px bg-border" />

                      <section className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-primary" />
                          <h3 className="font-semibold text-sm">Items & Prefabs</h3>
                        </div>
                        <ItemPrefabs
                          currentItem={currentItemForm}
                          onLoadPrefab={handleLoadPrefab}
                        />
                        <div className="mt-4">
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
                      </section>

                      <div className="h-px bg-border" />

                      <section className="space-y-3">
                        <AlgorithmSettings
                          gridResolution={gridResolution}
                          geneticGenerations={geneticGenerations}
                          mutationRate={mutationRate}
                          onGridResolutionChange={setGridResolution}
                          onGeneticGenerationsChange={setGeneticGenerations}
                          onMutationRateChange={setMutationRate}
                        />
                      </section>
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t border-border bg-background z-10 space-y-2 flex-none">
                    <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Algorithm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ffd">First-Fit Decreasing (Fast)</SelectItem>
                        <SelectItem value="bestfit">Best-Fit (Balanced)</SelectItem>
                        <SelectItem value="genetic">Genetic Algorithm (Slow, High Quality)</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      onClick={handleRunPacking}
                      disabled={isProcessing}
                      className="w-full shadow-md mt-2"
                      size="lg"
                    >
                      <PlayCircle className="mr-2 h-5 w-5" />
                      {isProcessing ? "Processing..." : "Run Packing"}
                    </Button>

                    {isProcessing && (
                      <div className="space-y-1 animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Calculating...</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}
                    <Button
                      onClick={handleRunComparison}
                      disabled={isProcessing}
                      className="w-full"
                      variant="outline"
                      size="sm"
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Compare Algorithms
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="scenarios" className="h-full absolute inset-0 m-0 border-0">
                  <ScenarioSelector onLoadScenario={(data) => {
                    handleImportJson(data);
                    setSidebarTab("editor");
                    toast.success("Scenario loaded!");
                  }} />
                </TabsContent>

                <TabsContent value="json" className="h-full absolute inset-0 m-0 border-0 overflow-auto">
                  <div className="p-4">
                    <JsonInput
                      onImport={handleImportJson}
                      onExport={handleExportJson}
                      isProcessing={isProcessing}
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </ResizablePanel>

          <ResizableHandle />

          {/* MIDDLE PANEL: 3D VISUALIZATION */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full w-full relative bg-gray-50 dark:bg-slate-900 overflow-hidden">
              {result ? (
                <Scene3D
                  container={result.container}
                  packedItems={result.packedItems}
                  onItemHover={setHoveredItem}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-muted-foreground p-8">
                    <BoxIcon className="h-20 w-20 mx-auto mb-4 opacity-20" />
                    <p className="text-xl font-medium">Ready to Pack</p>
                    <p className="text-sm mt-2 opacity-70 max-w-xs mx-auto">
                      Configure your container and items in the sidebar, then click Run.
                    </p>
                  </div>
                </div>
              )}

              {/* Overlay Stats */}
              {result && (
                <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                  <div className="pointer-events-auto inline-block">
                    <StatsPanel result={result} />
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* RIGHT PANEL: RESULTS */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={30} className="bg-muted/10 border-l border-border">
            <div className="h-full flex flex-col">
              <div className="p-3 border-b border-border bg-background font-semibold text-sm flex items-center justify-between">
                <span>Results & Analysis</span>
                {result && (
                  <span className="text-xs text-muted-foreground">
                    {result.algorithmName}
                  </span>
                )}
              </div>
              <div className="flex-1 min-h-0 bg-background/50">
                {comparison ? (
                  <ScrollArea className="h-full">
                    <div className="p-4">
                      <ComparisonPanel
                        comparison={comparison}
                        onShowResult={setResult}
                        selectedAlgorithm={result?.algorithmName}
                      />
                    </div>
                  </ScrollArea>
                ) : result ? (
                  <div className="h-full">
                    <ItemPanel
                      packedItems={result.packedItems}
                      unpackedItems={result.unpackedItems}
                      hoveredItem={hoveredItem}
                    />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center p-6">
                      <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No results yet</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>

    </div>
  );
};

export default Index;
