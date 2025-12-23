import { PackingResult } from "@/types/packing";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Box, Package, Weight } from "lucide-react";

interface StatsPanelProps {
  result: PackingResult | null;
}

export function StatsPanel({ result }: StatsPanelProps) {
  if (!result) {
    return (
      <Card className="p-6">
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
    <Card className="p-6">
      <div className="space-y-6">
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
              <span className="text-sm">Total Volume (m³)</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{(totalVolume / 1000000).toFixed(3)} m³</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Box className="h-4 w-4" />
              <span className="text-sm">Used Volume (m³)</span>
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
