import { useState, useEffect, useRef } from "react";
import { PackingResult } from "@/types/packing";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Box, Package, Weight, Move } from "lucide-react";

interface StatsPanelProps {
  result: PackingResult | null;
}

export function StatsPanel({ result }: StatsPanelProps) {
  // Drag and Scale functionality states
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 450 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

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

  if (!result) {
    return (
      <Card
        className="p-6 w-80 shadow-lg backdrop-blur-sm bg-background/95 supports-[backdrop-filter]:bg-background/60"
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 40,
        }}
      >
        <div
          className="absolute top-2 right-2 p-1.5 cursor-grab active:cursor-grabbing hover:bg-muted rounded-md transition-colors"
          onMouseDown={handleMouseDown}
          title="Drag to move"
        >
          <Move className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-center text-muted-foreground">
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
      className="p-6 w-80 shadow-xl border-primary/20 backdrop-blur-sm bg-background/95 supports-[backdrop-filter]:bg-background/60 transition-transform duration-75"
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
      {/* Drag Handle (Move) */}
      <div
        className="absolute top-2 left-1/2 -translate-x-1/2 p-1.5 cursor-grab active:cursor-grabbing hover:bg-muted rounded-md transition-colors group z-50"
        onMouseDown={handleMouseDown}
        title="Drag position"
      >
        <Move className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      {/* 4 Corner Resize Handles */}
      <ResizeHandle className="-top-1 -left-1" cursor="nwse-resize" />
      <ResizeHandle className="-top-1 -right-1" cursor="nesw-resize" />
      <ResizeHandle className="-bottom-1 -left-1" cursor="nesw-resize" />
      <ResizeHandle className="-bottom-1 -right-1" cursor="nwse-resize" />

      <div className="space-y-6 pt-2"> {/* Added pt-2 for top handle space */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Container Utilization</h3>
            <span className="text-2xl font-bold text-foreground">{utilization.toFixed(1)}%</span>
          </div>
          <Progress value={utilization} className="h-3" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span className="text-sm">Packed Items</span>
            </div>
            <p className="text-2xl font-bold text-success">{packedItems.length}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span className="text-sm">Unpacked Items</span>
            </div>
            <p className="text-2xl font-bold text-destructive">{unpackedItems.length}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Box className="h-4 w-4" />
              <span className="text-sm">Total Volume</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{(totalVolume / 1000000).toFixed(3)} m³</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Box className="h-4 w-4" />
              <span className="text-sm">Used Volume</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{(usedVolume / 1000000).toFixed(3)} m³</p>
          </div>

          {hasWeightData && (
            <>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Weight className="h-4 w-4" />
                  <span className="text-sm">Total Weight</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{totalWeight.toFixed(1)} kg</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Weight className="h-4 w-4" />
                  <span className="text-sm">Packed Weight</span>
                </div>
                <p className="text-lg font-semibold text-success">{packedWeight.toFixed(1)} kg</p>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
