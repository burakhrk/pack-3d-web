import { ComparisonResult, PackingResult } from "@/types/packing";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Package, AlertCircle } from "lucide-react";

interface ComparisonPanelProps {
  comparison: ComparisonResult | null;
  onShowResult?: (result: PackingResult) => void;
  selectedAlgorithm?: string;
}

export function ComparisonPanel({ comparison, onShowResult, selectedAlgorithm }: ComparisonPanelProps) {
  if (!comparison) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">
          Run comparison to see results
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Algorithm Comparison</h3>
        </div>

        <div className="space-y-4">
          {comparison.results.map((result, index) => {
            const isBest = index === 0;
            const isSelected = selectedAlgorithm === result.algorithmName;

            return (
              <div
                key={result.algorithmName}
                className={`p-4 rounded-lg border-2 transition-all ${isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-background hover:bg-muted/50"
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {result.algorithmName}
                    </span>
                    {isBest && (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                        Best
                      </Badge>
                    )}
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {result.utilization}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Package className="w-3 h-3" />
                      <span>Packed</span>
                    </div>
                    <p className="font-semibold">{result.packedItems.length}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Unpacked</span>
                    </div>
                    <p className="font-semibold">{result.unpackedItems.length}</p>
                  </div>

                  <div>
                    <div className="text-muted-foreground mb-1">Volume Used</div>
                    <p className="font-semibold">
                      {result.usedVolume.toFixed(1)} / {result.totalVolume.toFixed(1)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${isBest ? "bg-primary" : "bg-muted-foreground"
                        }`}
                      style={{ width: `${result.utilization}%` }}
                    />
                  </div>

                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className="w-full"
                    onClick={() => onShowResult?.(result)}
                    size="sm"
                  >
                    {isSelected ? "Currently Viewing" : "View 3D Result"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">{comparison.bestAlgorithm}</strong> achieved the highest utilization rate of{" "}
            <strong className="text-foreground">{comparison.results[0].utilization}%</strong>
          </p>
        </div>
      </div>
    </Card>
  );
}
