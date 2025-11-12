import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Save, Trash2, Plus, BookmarkPlus } from "lucide-react";
import { toast } from "sonner";

interface ItemPrefab {
  id: string;
  name: string;
  width: number;
  height: number;
  depth: number;
  weight?: number;
}

interface ItemPrefabsProps {
  onLoadPrefab: (prefab: Omit<ItemPrefab, "id">) => void;
  currentItem: {
    name: string;
    width: number;
    height: number;
    depth: number;
    weight: number;
  };
}

const STORAGE_KEY = "packing_item_prefabs";

export function ItemPrefabs({ onLoadPrefab, currentItem }: ItemPrefabsProps) {
  const [prefabs, setPrefabs] = useState<ItemPrefab[]>([]);
  const [prefabName, setPrefabName] = useState("");

  // Load prefabs from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPrefabs(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to load prefabs:", error);
      }
    }
  }, []);

  // Save prefabs to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefabs));
  }, [prefabs]);

  const handleSavePrefab = () => {
    if (!prefabName.trim()) {
      toast.error("Please enter a name for this prefab");
      return;
    }

    if (!currentItem.name.trim()) {
      toast.error("Please fill in item details before saving");
      return;
    }

    if (currentItem.width <= 0 || currentItem.height <= 0 || currentItem.depth <= 0) {
      toast.error("Item dimensions must be greater than 0");
      return;
    }

    const newPrefab: ItemPrefab = {
      id: `prefab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: prefabName.trim(),
      width: currentItem.width,
      height: currentItem.height,
      depth: currentItem.depth,
      weight: currentItem.weight > 0 ? currentItem.weight : undefined,
    };

    setPrefabs([...prefabs, newPrefab]);
    setPrefabName("");
    toast.success(`Prefab "${newPrefab.name}" saved`);
  };

  const handleDeletePrefab = (id: string) => {
    setPrefabs(prefabs.filter((p) => p.id !== id));
    toast.success("Prefab deleted");
  };

  const handleLoadPrefab = (prefab: ItemPrefab) => {
    onLoadPrefab({
      name: prefab.name,
      width: prefab.width,
      height: prefab.height,
      depth: prefab.depth,
      weight: prefab.weight,
    });
    toast.success(`Loaded prefab "${prefab.name}"`);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <BookmarkPlus className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Box Prefabs</h3>
          <span className="ml-auto text-sm text-muted-foreground">
            {prefabs.length} saved
          </span>
        </div>
      </div>

      {/* Save Current Item as Prefab */}
      <div className="p-4 border-b border-border bg-muted/30 flex-shrink-0">
        <div className="space-y-2">
          <Label htmlFor="prefab-name" className="text-xs text-muted-foreground">
            Save Current Item as Prefab
          </Label>
          <div className="flex gap-2">
            <Input
              id="prefab-name"
              placeholder="Prefab name (e.g., 'Small Box')"
              value={prefabName}
              onChange={(e) => setPrefabName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSavePrefab();
                }
              }}
            />
            <Button onClick={handleSavePrefab} size="sm">
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Prefabs List */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-2">
          {prefabs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookmarkPlus className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No prefabs saved</p>
              <p className="text-xs">Save frequently used box sizes for quick access</p>
            </div>
          ) : (
            prefabs.map((prefab) => (
              <div
                key={prefab.id}
                className="p-3 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{prefab.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {prefab.width} × {prefab.height} × {prefab.depth}
                      {prefab.weight && ` • ${prefab.weight}kg`}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLoadPrefab(prefab)}
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete prefab?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the "{prefab.name}" prefab. This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePrefab(prefab.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
