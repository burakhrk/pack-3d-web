import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Item } from "@/types/packing";
import { Package, Plus, Trash2, Trash } from "lucide-react";
import { toast } from "sonner";

interface ItemManagerProps {
  items: Item[];
  onAdd: (items: Item | Item[]) => void;
  onRemove: (itemId: string) => void;
  onClearAll: () => void;
  disabled?: boolean;
  onItemFormChange?: (item: {
    name: string;
    width: number;
    height: number;
    depth: number;
    weight: number;
  }) => void;
  onLoadPrefab?: (fn: (prefab: {
    name: string;
    width: number;
    height: number;
    depth: number;
    weight?: number;
  }) => void) => void;
}

export function ItemManager({ items, onAdd, onRemove, onClearAll, disabled, onItemFormChange, onLoadPrefab }: ItemManagerProps) {
  // Use strings for inputs to handle "empty" and "decimal" states correctly
  const [newItem, setNewItem] = useState({
    name: "",
    width: "1",
    height: "1",
    depth: "1",
    quantity: "1",
    weight: "0",
  });

  // Notify parent when item form changes (converting strings to numbers)
  const notifyParent = (state: typeof newItem) => {
    if (onItemFormChange) {
      onItemFormChange({
        name: state.name,
        width: parseFloat(state.width) || 0,
        height: parseFloat(state.height) || 0,
        depth: parseFloat(state.depth) || 0,
        weight: parseFloat(state.weight) || 0,
      });
    }
  };

  const updateNewItem = (updates: Partial<typeof newItem>) => {
    const updated = { ...newItem, ...updates };
    setNewItem(updated);
    notifyParent(updated);
  };

  // Load prefab into form
  const loadPrefab = React.useCallback((prefab: {
    name: string;
    width: number;
    height: number;
    depth: number;
    weight?: number;
  }) => {
    const updated = {
      name: prefab.name,
      width: prefab.width.toString(),
      height: prefab.height.toString(),
      depth: prefab.depth.toString(),
      weight: (prefab.weight || 0).toString(),
      quantity: "1",
    };
    setNewItem(updated);
    notifyParent(updated);
  }, [notifyParent]);

  // Expose load prefab function on mount
  useEffect(() => {
    if (onLoadPrefab) {
      onLoadPrefab(loadPrefab);
    }
  }, [onLoadPrefab, loadPrefab]);

  const handleAdd = () => {
    if (!newItem.name.trim()) {
      toast.error("Please enter a name for the item");
      return;
    }

    const width = parseFloat(newItem.width);
    const height = parseFloat(newItem.height);
    const depth = parseFloat(newItem.depth);
    const quantity = parseInt(newItem.quantity);
    const weight = parseFloat(newItem.weight);

    if (isNaN(width) || width <= 0 || isNaN(height) || height <= 0 || isNaN(depth) || depth <= 0) {
      toast.error("Dimensions must be greater than 0");
      return;
    }

    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Quantity must be at least 1");
      return;
    }

    // Create all items at once based on quantity
    const itemsToAdd: Item[] = [];
    const timestamp = Date.now();

    for (let i = 0; i < quantity; i++) {
      const item: Item = {
        id: `item-${timestamp}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        name: quantity > 1 ? `${newItem.name.trim()} #${i + 1}` : newItem.name.trim(),
        width,
        height,
        depth,
        weight: weight > 0 ? weight : undefined,
      };
      itemsToAdd.push(item);
    }

    // Add all items at once
    onAdd(itemsToAdd);

    const itemsText = quantity === 1 ? "item" : "items";
    toast.success(`Added ${quantity} ${itemsText}`);
    // Reset form to defaults
    setNewItem({ name: "", width: "1", height: "1", depth: "1", quantity: "1", weight: "0" });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled) {
      handleAdd();
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden border-border/50 shadow-sm">
      <div className="p-4 border-b border-border/50 flex-shrink-0 bg-secondary/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-secondary/10 rounded-md">
            <Package className="h-4 w-4 text-secondary" />
          </div>
          <h3 className="font-semibold text-foreground">Manage Items</h3>
          <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {items.length}
          </span>
          {items.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={disabled}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-1"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all items?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all {items.length} items from the list. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      onClearAll();
                      toast.success("All items cleared");
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Add Item Form */}
      <div className="p-4 border-b border-border/50 bg-card/50 flex-shrink-0 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="item-name" className="text-xs font-medium text-muted-foreground">
            Item Name
          </Label>
          <Input
            id="item-name"
            placeholder="e.g., Box A"
            value={newItem.name}
            onChange={(e) => updateNewItem({ name: e.target.value })}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            className="h-8"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="item-width" className="text-xs font-medium text-muted-foreground">
              Width (cm)
            </Label>
            <Input
              id="item-width"
              type="number"
              min="0.1"
              step="0.5"
              value={newItem.width}
              onChange={(e) => updateNewItem({ width: e.target.value })}
              disabled={disabled}
              className="h-8"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="item-height" className="text-xs font-medium text-muted-foreground">
              Height (cm)
            </Label>
            <Input
              id="item-height"
              type="number"
              min="0.1"
              step="0.5"
              value={newItem.height}
              onChange={(e) => updateNewItem({ height: e.target.value })}
              disabled={disabled}
              className="h-8"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="item-depth" className="text-xs font-medium text-muted-foreground">
              Depth (cm)
            </Label>
            <Input
              id="item-depth"
              type="number"
              min="0.1"
              step="0.5"
              value={newItem.depth}
              onChange={(e) => updateNewItem({ depth: e.target.value })}
              disabled={disabled}
              className="h-8"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="item-weight" className="text-xs font-medium text-muted-foreground">
              Weight (kg)
            </Label>
            <Input
              id="item-weight"
              type="number"
              min="0"
              step="0.1"
              value={newItem.weight}
              onChange={(e) => updateNewItem({ weight: e.target.value })}
              disabled={disabled}
              className="h-8"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="item-quantity" className="text-xs font-medium text-muted-foreground">
              Quantity
            </Label>
            <Input
              id="item-quantity"
              type="number"
              min="1"
              step="1"
              value={newItem.quantity}
              onChange={(e) => updateNewItem({ quantity: e.target.value })}
              disabled={disabled}
              className="h-8"
            />
          </div>
        </div>

        <Button onClick={handleAdd} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="sm" disabled={disabled}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Items List */}
      <ScrollArea className="flex-1 min-h-0 bg-muted/10">
        <div className="p-3 space-y-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div className="p-3 bg-muted rounded-full mb-3">
                <Package className="h-6 w-6 opacity-50" />
              </div>
              <p className="text-sm font-medium">No items yet</p>
              <p className="text-xs opacity-70">Add items to start packing</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="group p-3 rounded-lg border border-border/60 bg-card hover:border-primary/50 transition-all hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-foreground">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono bg-secondary/10 text-secondary-foreground px-1.5 py-0.5 rounded">
                        {item.width} × {item.height} × {item.depth}
                      </span>
                      {item.weight && (
                        <span className="text-xs text-muted-foreground">
                          {item.weight}kg
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(item.id)}
                    disabled={disabled}
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
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
