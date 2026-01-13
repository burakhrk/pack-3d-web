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

  const dragStartOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, initialScale: 1 });

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
        // Calculate new scale based on drag distance
        // Dragging down/right increases scale, up/left decreases
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;

        // Use the larger delta to drive scaling for smoother feel, or average them
        const sensitivity = 0.005; // 1 pixel = 0.005 scale change
        const delta = deltaX + deltaY; // Bias towards X for width, or allow both

        let newScale = resizeStart.current.initialScale + delta * sensitivity;

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
    setIsResizing(true);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      initialScale: scale
    };
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

  return (
    <Card
      className="p-6 w-80 shadow-xl border-primary/20 backdrop-blur-sm bg-background/95 supports-[backdrop-filter]:bg-background/60 origin-top-left transition-transform duration-75"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 40,
        cursor: isDragging ? 'grabbing' : 'auto',
        userSelect: 'none',
        transform: `scale(${scale})`
      }}
    >
      {/* Drag Handle (Move) */}
      <div
        className="absolute top-2 right-2 p-1.5 cursor-grab active:cursor-grabbing hover:bg-muted rounded-md transition-colors group z-50"
        onMouseDown={handleMouseDown}
        title="Drag position"
      >
        <Move className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      {/* Resize Handle (Scale) */}
      <div
        className="absolute bottom-2 right-2 p-1.5 cursor-nwse-resize hover:bg-muted rounded-md transition-colors group z-50"
        onMouseDown={handleResizeMouseDown}
        title="Drag to scale"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
        >
          <path d="M15 3h6v6" />
          <path d="M14 10l6.1-6.1" />
          <path d="M9 21H3v-6" />
          <path d="M10 14l-6.1 6.1" />
        </svg>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2 pr-6"> {/* pr-6 to avoid overlap with handle */}
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
