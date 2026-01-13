import { useState, useEffect, useRef } from "react";
import { PackingResult } from "@/types/packing";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Box, Package, Weight, Move, ChevronDown, ChevronUp } from "lucide-react";

interface StatsPanelProps {
  result: PackingResult | null;
}

export function StatsPanel({ result }: StatsPanelProps) {
  // Drag and Scale functionality states
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 450 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ initialScale: 1, initialDistance: 0, centerX: 0, centerY: 0 });

  // Handle window resize to keep panel on screen if needed, or just initial init
  useEffect(() => {
    // Ensure initial position is reasonably visible
    setPosition({ x: 20, y: window.innerHeight - 450 });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStartOffset.current.x,
          y: e.clientY - dragStartOffset.current.y
        });
      } else if (isResizing) {
        // Calculate distance from center
        const dx = e.clientX - resizeStart.current.centerX;
        const dy = e.clientY - resizeStart.current.centerY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);

        // Avoid division by zero
        if (resizeStart.current.initialDistance === 0) return;

        // New scale is proportional to distance change relative to start
        const ratio = currentDistance / resizeStart.current.initialDistance;
        let newScale = resizeStart.current.initialScale * ratio;

        // Clamp scale limits
        newScale = Math.min(Math.max(newScale, 0.5), 2.5);

        setScale(newScale);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging from the handle or header area
    setIsDragging(true);
    dragStartOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    e.preventDefault(); // Prevent text selection
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag start

    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      setIsResizing(true);
      resizeStart.current = {
        initialScale: scale,
        initialDistance: distance,
        centerX,
        centerY
      };
    }
    e.preventDefault();
  };

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  if (!result) {
    return (
      <Card
        className={`w-80 shadow-lg backdrop-blur-sm bg-background/95 supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out ${isCollapsed ? 'h-12 overflow-hidden bg-background/80' : 'p-6'}`}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 40,
          transformOrigin: 'center center',
          transform: `scale(${scale})`
        }}
      >
        {/* Header / Remote Control Area */}
        <div
          className={`absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-2 ${isCollapsed ? 'cursor-pointer hover:bg-muted/50' : ''}`}
          onClick={isCollapsed ? toggleCollapse : undefined}
        >
          {/* Drag Handle (Move) - Center */}
          <div
            className="p-1.5 cursor-grab active:cursor-grabbing hover:bg-muted rounded-md transition-colors group mx-auto"
            onMouseDown={handleMouseDown}
            title="Drag position"
          >
            <Move className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>

          {/* Collapse Toggle - Right */}
          <div
            className="absolute right-2 top-2 p-1.5 cursor-pointer hover:bg-muted rounded-md transition-colors group z-50"
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            ) : (
              <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>

          {/* Title when collapsed */}
          {isCollapsed && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
              Stats
            </div>
          )}
        </div>

        {/* Content - Hidden when collapsed */}
        <div className={`text-center text-muted-foreground ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-300 pt-6'}`}>
          <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Run the packing algorithm to see statistics</p>
        </div>
      </Card>
    );
  }

  const { utilization, packedItems, unpackedItems, totalVolume, usedVolume } = result;

  // Calculate weight statistics
  const totalWeight = [...packedItems, ...unpackedItems].reduce(
    (sum, item) => sum + (item.weight || 0),
    0
  );
  const packedWeight = packedItems.reduce((sum, item) => sum + (item.weight || 0), 0);
  const hasWeightData = totalWeight > 0;

  // Resize Handle Component
  const ResizeHandle = ({ className, cursor }: { className: string, cursor: string }) => (
    <div
      className={`absolute p-1.5 hover:bg-primary/20 rounded-full transition-colors z-50 ${className}`}
      style={{ cursor }}
      onMouseDown={handleResizeMouseDown}
      title="Drag to scale"
    >
      <div className="w-2 h-2 bg-primary/50 rounded-full" />
    </div>
  );

  return (
    <Card
      ref={panelRef}
      className={`w-80 shadow-xl border-primary/20 backdrop-blur-sm bg-background/95 supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out ${isCollapsed ? 'h-12 overflow-hidden bg-background/80' : 'p-6'}`}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 40,
        cursor: isDragging ? 'grabbing' : 'auto',
        userSelect: 'none',
        transformOrigin: 'center center',
        transform: `scale(${scale})`
      }}
    >
      {/* Header / Remote Control Area */}
      <div
        className={`absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-2 ${isCollapsed ? 'cursor-pointer hover:bg-muted/50' : ''}`}
        onClick={isCollapsed ? toggleCollapse : undefined}
      >
        {/* Drag Handle (Move) - Center */}
        <div
          className="p-1.5 cursor-grab active:cursor-grabbing hover:bg-muted rounded-md transition-colors group mx-auto"
          onMouseDown={handleMouseDown}
          title="Drag position"
        >
          <Move className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>

        {/* Collapse Toggle - Right */}
        <div
          className="absolute right-2 top-2 p-1.5 cursor-pointer hover:bg-muted rounded-md transition-colors group z-50"
          onClick={toggleCollapse}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </div>

        {/* Title when collapsed */}
        {isCollapsed && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
            Stats
          </div>
        )}
      </div>

      {/* Content - Hidden when collapsed */}
      <div className={`space-y-6 pt-6 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-300'}`}>

        {/* Resize Handles - Only separate when not collapsed */}
        {!isCollapsed && (
          <>
            <ResizeHandle className="-top-1 -left-1" cursor="nwse-resize" />
            <ResizeHandle className="-top-1 -right-1" cursor="nesw-resize" />
            <ResizeHandle className="-bottom-1 -left-1" cursor="nesw-resize" />
            <ResizeHandle className="-bottom-1 -right-1" cursor="nwse-resize" />
          </>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Container Utilization</h3>
            <span className="text-2xl font-bold text-foreground">{utilization.toFixed(1)}%</span>
          </div>
          <Progress value={utilization} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Packed</span>
            </div>
            <p className="text-xl font-bold">{packedItems.length}</p>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Box className="h-4 w-4 text-destructive" />
              <span className="text-xs font-medium text-muted-foreground">Unpacked</span>
            </div>
            <p className="text-xl font-bold text-destructive">{unpackedItems.length}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Box className="h-4 w-4" />
              <span>Volume</span>
            </div>
            <span className="font-mono">
              {(usedVolume / 1000).toFixed(1)}k / {(totalVolume / 1000).toFixed(1)}k
            </span>
          </div>

          {hasWeightData && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Weight className="h-4 w-4" />
                <span>Weight</span>
              </div>
              <span className="font-mono">
                {packedWeight.toFixed(1)} / {totalWeight.toFixed(1)} kg
              </span>
            </div>
          )}

          {/* Detailed Item Breakdown */}
          <div className="pt-4 border-t border-border/50">
            <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Item Details</h4>
            <div className="max-h-48 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              {Object.values(
                [...packedItems, ...unpackedItems].reduce((acc, item) => {
                  if (!acc[item.name]) {
                    acc[item.name] = {
                      name: item.name,
                      width: item.width,
                      height: item.height,
                      depth: item.depth,
                      total: 0,
                      packed: 0
                    };
                  }
                  acc[item.name].total++;
                  return acc;
                  // @ts-ignore
                }, {} as Record<string, { name: string, width: number, height: number, depth: number, total: number, packed: number }>)
              ).map((stat: any) => {
                // Calculate packed count for this specific group
                stat.packed = packedItems.filter(p => p.name === stat.name).length;
                const isComplete = stat.packed === stat.total;

                return (
                  <div key={stat.name} className="bg-muted/30 p-2 rounded text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium truncate max-w-[120px]" title={stat.name}>{stat.name}</span>
                      <span className="text-muted-foreground font-mono">
                        {stat.width}x{stat.height}x{stat.depth}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isComplete ? 'bg-green-500' : 'bg-primary'}`}
                          style={{ width: `${(stat.packed / stat.total) * 100}%` }}
                        />
                      </div>
                      <span className={`font-mono font-medium ${isComplete ? 'text-green-500' : 'text-foreground'}`}>
                        {stat.packed}/{stat.total}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
