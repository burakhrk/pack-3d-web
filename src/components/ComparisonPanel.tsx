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
                    <span className="font-semibold text-sm">
                      {result.algorithmName}
                    </span>
                    {isBest && (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 text-[10px] px-1.5 py-0">
                        Best
                      </Badge>
                    )}
                  </div>
                  <span className="text-lg font-bold text-primary">
                    {(result.totalUtilization ?? result.utilization).toFixed(2)}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
                      <Package className="w-3 h-3" />
                      <span>Count</span>
                    </div>
                    <p className="font-medium">
                      {result.containers?.reduce((sum, c) => sum + c.packedItems.length, 0) ?? result.packedItems.length}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
                      <AlertCircle className="w-3 h-3" />
                      <span>Left</span>
                    </div>
                    <p className="font-medium">{result.unpackedItems.length}</p>
                  </div>

                  <div className="col-span-1">
                    <div className="text-muted-foreground mb-0.5">
                      {result.isMultiContainer ? "Boxes Used" : "Vol. Used"}
                    </div>
                    <p className="font-medium truncate">
                      {result.isMultiContainer
                        ? (result.containers?.filter(c => c.packedItems.length > 0).length ?? 0)
                        : `${Math.round((result.usedVolume / result.totalVolume) * 100)}%`
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all ${isBest ? "bg-primary" : "bg-muted-foreground"
                        }`}
                      style={{ width: `${result.totalUtilization ?? result.utilization}%` }}
                    />
                  </div>

                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className="w-full h-7 text-xs"
                    onClick={() => onShowResult?.(result)}
                  >
                    {isSelected ? "Viewing" : "View Result"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">{comparison.bestAlgorithm}</strong> is most efficient at{" "}
            <strong className="text-foreground">{comparison.results[0].utilization.toFixed(2)}%</strong>
          </p>
        </div>
      </div>
    </Card>
  );
}
