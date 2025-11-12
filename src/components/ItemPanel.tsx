import { PackedItem } from "@/types/packing";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Package, AlertCircle } from "lucide-react";

interface ItemPanelProps {
  packedItems: PackedItem[];
  unpackedItems: any[];
  hoveredItem: PackedItem | null;
}

export function ItemPanel({
  packedItems,
  unpackedItems,
  hoveredItem,
}: ItemPanelProps) {
  return (
    <Card className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Items</h2>
          </div>
          <Badge variant="secondary">
            {packedItems.length} / {packedItems.length + unpackedItems.length}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Packed Items */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Packed Items
            </h3>
            {packedItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-lg border transition-all ${
                  hoveredItem?.id === item.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    <div
                      className="w-4 h-4 rounded mt-1 flex-shrink-0 border border-border"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.width} × {item.height} × {item.depth}
                        {item.weight && ` • ${item.weight}kg`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Position: ({item.position.x.toFixed(1)}, {item.position.y.toFixed(1)},{" "}
                        {item.position.z.toFixed(1)})
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Unpacked Items */}
          {unpackedItems.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <h3 className="text-sm font-medium text-muted-foreground">
                  Unpacked Items
                </h3>
              </div>
              {unpackedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border border-destructive/50 bg-destructive/5"
                >
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.width} × {item.height} × {item.depth}
                    {item.weight && ` • ${item.weight}kg`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
