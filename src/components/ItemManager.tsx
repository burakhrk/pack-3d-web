import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Item } from "@/types/packing";
import { Package, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ItemManagerProps {
  items: Item[];
  onAdd: (item: Item) => void;
  onRemove: (itemId: string) => void;
  disabled?: boolean;
}

export function ItemManager({ items, onAdd, onRemove, disabled }: ItemManagerProps) {
  const [newItem, setNewItem] = useState({
    name: "",
    width: 1,
    height: 1,
    depth: 1,
  });

  const handleAdd = () => {
    if (!newItem.name.trim()) {
      toast.error("Please enter a name for the item");
      return;
    }

    if (newItem.width <= 0 || newItem.height <= 0 || newItem.depth <= 0) {
      toast.error("Dimensions must be greater than 0");
      return;
    }

    const item: Item = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newItem.name.trim(),
      width: newItem.width,
      height: newItem.height,
      depth: newItem.depth,
    };

    onAdd(item);
    setNewItem({ name: "", width: 1, height: 1, depth: 1 });
    toast.success(`Added "${item.name}"`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled) {
      handleAdd();
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Manage Items</h3>
          <span className="ml-auto text-sm text-muted-foreground">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Add Item Form */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="item-name" className="text-xs text-muted-foreground">
              Item Name
            </Label>
            <Input
              id="item-name"
              placeholder="e.g., Box A"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              onKeyPress={handleKeyPress}
              disabled={disabled}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-2">
              <Label htmlFor="item-width" className="text-xs text-muted-foreground">
                Width
              </Label>
              <Input
                id="item-width"
                type="number"
                min="0.1"
                step="0.5"
                value={newItem.width}
                onChange={(e) =>
                  setNewItem({ ...newItem, width: parseFloat(e.target.value) || 0 })
                }
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-height" className="text-xs text-muted-foreground">
                Height
              </Label>
              <Input
                id="item-height"
                type="number"
                min="0.1"
                step="0.5"
                value={newItem.height}
                onChange={(e) =>
                  setNewItem({ ...newItem, height: parseFloat(e.target.value) || 0 })
                }
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-depth" className="text-xs text-muted-foreground">
                Depth
              </Label>
              <Input
                id="item-depth"
                type="number"
                min="0.1"
                step="0.5"
                value={newItem.depth}
                onChange={(e) =>
                  setNewItem({ ...newItem, depth: parseFloat(e.target.value) || 0 })
                }
                disabled={disabled}
              />
            </div>
          </div>

          <Button onClick={handleAdd} className="w-full" size="sm" disabled={disabled}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Items List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No items yet</p>
              <p className="text-xs">Add items to pack in the container</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.width} × {item.height} × {item.depth}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(item.id)}
                    disabled={disabled}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
