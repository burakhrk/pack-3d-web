import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Container } from "@/types/packing";
import { Box, Truck, Container as ContainerIcon } from "lucide-react";

interface ContainerFormProps {
  container: Container;
  onUpdate: (container: Container) => void;
}

const PRESETS = {
  custom: { name: "Custom Size", width: 10, height: 10, depth: 10 },
  "20ft": { name: "20ft Container (Standard)", width: 590, height: 239, depth: 235 },
  "40ft": { name: "40ft Container (Standard)", width: 1203, height: 239, depth: 235 },
  "truck": { name: "Delivery Truck", width: 420, height: 220, depth: 210 },
  "pallet": { name: "Euro Pallet Load", width: 120, height: 180, depth: 80 },
};

export function ContainerForm({ container, onUpdate }: ContainerFormProps) {
  const [dimensions, setDimensions] = useState({
    width: container.width,
    height: container.height,
    depth: container.depth,
  });
  const [preset, setPreset] = useState("custom");

  const handleUpdate = () => {
    onUpdate({
      ...container,
      ...dimensions,
    });
  };

  const handlePresetChange = (value: string) => {
    setPreset(value);
    if (value !== "custom") {
      const p = PRESETS[value as keyof typeof PRESETS];
      const newDims = { width: p.width, height: p.height, depth: p.depth };
      setDimensions(newDims);
      onUpdate({ ...container, ...newDims });
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Box className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Container Dimensions</h3>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Quick Preset</Label>
          <Select value={preset} onValueChange={handlePresetChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a preset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Custom Size</SelectItem>
              <SelectItem value="20ft">
                <div className="flex items-center gap-2">
                  <ContainerIcon className="h-4 w-4" /> 20ft ISO Container
                </div>
              </SelectItem>
              <SelectItem value="40ft">
                <div className="flex items-center gap-2">
                  <ContainerIcon className="h-4 w-4" /> 40ft ISO Container
                </div>
              </SelectItem>
              <SelectItem value="truck">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" /> Delivery Truck
                </div>
              </SelectItem>
              <SelectItem value="pallet">
                <div className="flex items-center gap-2">
                  <Box className="h-4 w-4" /> Pallet Load (Max)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label htmlFor="width" className="text-xs text-muted-foreground">
              Width (cm)
            </Label>
            <Input
              id="width"
              type="number"
              min="1"
              step="0.5"
              value={dimensions.width}
              onChange={(e) => {
                setDimensions({ ...dimensions, width: parseFloat(e.target.value) || 0 });
                setPreset("custom");
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height" className="text-xs text-muted-foreground">
              Height (cm)
            </Label>
            <Input
              id="height"
              type="number"
              min="1"
              step="0.5"
              value={dimensions.height}
              onChange={(e) => {
                setDimensions({ ...dimensions, height: parseFloat(e.target.value) || 0 });
                setPreset("custom");
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="depth" className="text-xs text-muted-foreground">
              Depth (cm)
            </Label>
            <Input
              id="depth"
              type="number"
              min="1"
              step="0.5"
              value={dimensions.depth}
              onChange={(e) => {
                setDimensions({ ...dimensions, depth: parseFloat(e.target.value) || 0 });
                setPreset("custom");
              }}
            />
          </div>
        </div>

        <Button onClick={handleUpdate} className="w-full" size="sm">
          Update Manual Dimensions
        </Button>
      </div>
    </Card>
  );
}
