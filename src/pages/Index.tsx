import { useState } from "react";
import { MemoryInputSimple } from "@/components/MemoryInputSimple";
import { AlgorithmResult } from "@/components/AlgorithmResult";
import { MemoryVisualization } from "@/components/MemoryVisualization";
import {
  firstFit,
  bestFit,
  worstFit,
  nextFit,
  compareResults,
  AllocationResult,
} from "@/lib/memoryAlgorithms";
import { Cpu, Settings, Layers, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ComparisonResults {
  firstFit: AllocationResult;
  bestFit: AllocationResult;
  worstFit: AllocationResult;
  nextFit: AllocationResult;
  bestAlgorithm: string;
  blocks: number[];
  processes: number[];
}

const Index = () => {
  const [results, setResults] = useState<ComparisonResults | null>(null);

  const handleRunComparison = (blocks: number[], processes: number[]) => {
    const firstFitResult = firstFit(blocks, processes);
    const bestFitResult = bestFit(blocks, processes);
    const worstFitResult = worstFit(blocks, processes);
    const nextFitResult = nextFit(blocks, processes);

    const bestAlgorithm = compareResults(
      firstFitResult,
      bestFitResult,
      worstFitResult,
      nextFitResult
    );

    setResults({
      firstFit: firstFitResult,
      bestFit: bestFitResult,
      worstFit: worstFitResult,
      nextFit: nextFitResult,
      bestAlgorithm,
      blocks,
      processes,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Cpu className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Memory Management Comparison</h1>
                <p className="text-muted-foreground">
                  Compare First Fit, Best Fit, Worst Fit, and Next Fit algorithms
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/custom">
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Custom Selection
                </Button>
              </Link>
              <Link to="/paging">
                <Button variant="outline" className="gap-2">
                  <Layers className="h-4 w-4" />
                  Paging Simulation
                </Button>
              </Link>
              <Link to="/page-replacement">
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Page Replacement
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Input Section */}
          <div>
            <MemoryInputSimple onRunComparison={handleRunComparison} />
          </div>

          {/* Results Section */}
          {results && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Algorithm Comparison */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Algorithm Comparison</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <AlgorithmResult
                    name="First Fit"
                    result={results.firstFit}
                    blocks={results.blocks}
                    processes={results.processes}
                    isBest={results.bestAlgorithm === "First Fit"}
                  />
                  <AlgorithmResult
                    name="Best Fit"
                    result={results.bestFit}
                    blocks={results.blocks}
                    processes={results.processes}
                    isBest={results.bestAlgorithm === "Best Fit"}
                  />
                  <AlgorithmResult
                    name="Worst Fit"
                    result={results.worstFit}
                    blocks={results.blocks}
                    processes={results.processes}
                    isBest={results.bestAlgorithm === "Worst Fit"}
                  />
                  <AlgorithmResult
                    name="Next Fit"
                    result={results.nextFit}
                    blocks={results.blocks}
                    processes={results.processes}
                    isBest={results.bestAlgorithm === "Next Fit"}
                  />
                </div>
              </div>

              {/* Memory Visualizations */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Memory Layout</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MemoryVisualization
                    blocks={results.blocks}
                    processes={results.processes}
                    allocation={results.firstFit.allocation}
                    title="First Fit"
                  />
                  <MemoryVisualization
                    blocks={results.blocks}
                    processes={results.processes}
                    allocation={results.bestFit.allocation}
                    title="Best Fit"
                  />
                  <MemoryVisualization
                    blocks={results.blocks}
                    processes={results.processes}
                    allocation={results.worstFit.allocation}
                    title="Worst Fit"
                  />
                  <MemoryVisualization
                    blocks={results.blocks}
                    processes={results.processes}
                    allocation={results.nextFit.allocation}
                    title="Next Fit"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
