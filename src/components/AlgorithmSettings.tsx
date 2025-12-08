import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Settings } from "lucide-react";
import { useState } from "react";

interface AlgorithmSettingsProps {
  gridResolution: number;
  geneticGenerations: number;
  mutationRate: number;
  onGridResolutionChange: (value: number) => void;
  onGeneticGenerationsChange: (value: number) => void;
  onMutationRateChange: (value: number) => void;
}

export function AlgorithmSettings({
  gridResolution,
  geneticGenerations,
  mutationRate,
  onGridResolutionChange,
  onGeneticGenerationsChange,
  onMutationRateChange,
}: AlgorithmSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Algorithm Settings
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 space-y-4 rounded-lg border border-border bg-card p-4">
        <div className="space-y-2">
          <Label htmlFor="gridResolution" className="text-sm font-medium">
            Grid Resolution (step size)
          </Label>
          <Input
            id="gridResolution"
            type="number"
            min="1"
            max="50"
            step="1"
            value={gridResolution}
            onChange={(e) => onGridResolutionChange(parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Smaller values = more precise but slower (1-50)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="geneticGenerations" className="text-sm font-medium">
            GA Generations / SA Iterations
          </Label>
          <Input
            id="geneticGenerations"
            type="number"
            min="5"
            max="100"
            step="5"
            value={geneticGenerations}
            onChange={(e) => onGeneticGenerationsChange(parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            More generations = better results but slower (5-100)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mutationRate" className="text-sm font-medium">
            Mutation Rate
          </Label>
          <Input
            id="mutationRate"
            type="number"
            min="0.01"
            max="0.5"
            step="0.01"
            value={mutationRate}
            onChange={(e) => onMutationRateChange(parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Probability of mutation (0.01-0.5)
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
