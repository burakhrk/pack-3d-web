import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, FileText } from "lucide-react";
import { scenarios } from "@/data/scenarios";
import { PackingInput } from "@/types/packing";
import { toast } from "sonner";

interface ScenarioSelectorProps {
    onLoadScenario: (data: PackingInput) => void;
}

export function ScenarioSelector({ onLoadScenario }: ScenarioSelectorProps) {
    console.log("ScenarioSelector rendered");

    const handleSelect = (scenario: typeof scenarios[0]) => {
        onLoadScenario(scenario.data);
        toast.success(`Loaded scenario: ${scenario.name}`);
    };

    return (
        <Card className="flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-border flex-shrink-0 bg-muted/20">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Test Scenarios</h3>
                    <span className="ml-auto text-sm text-muted-foreground">
                        {scenarios.length} presets
                    </span>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                    {scenarios.map((scenario) => (
                        <div
                            key={scenario.name}
                            className="p-3 rounded-lg border border-border bg-card hover:border-primary/50 transition-all hover:shadow-sm"
                        >
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className="font-medium text-sm">{scenario.name}</h4>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-7 w-7 p-0"
                                        onClick={() => handleSelect(scenario)}
                                        title="Load Scenario"
                                    >
                                        <Play className="h-3 w-3" />
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {scenario.description}
                                </p>
                                <div className="text-xs font-mono text-muted-foreground/70 pt-1">
                                    {scenario.data.items.length} Items • Container: {scenario.data.container.width}x{scenario.data.container.height}x{scenario.data.container.depth}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </Card>
    );
}
