import { useState } from "react";
import { MemoryInput } from "@/components/MemoryInput";
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
import { Cpu, ArrowLeft, Layers, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ComparisonResults {
  firstFit: AllocationResult | null;
  bestFit: AllocationResult | null;
  worstFit: AllocationResult | null;
  nextFit: AllocationResult | null;
  bestAlgorithm: string;
  blocks: number[];
  processes: number[];
}

const CustomComparison = () => {
  const [results, setResults] = useState<ComparisonResults | null>(null);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);

  const handleRunComparison = (blocks: number[], processes: number[], algorithms: string[]) => {
    const firstFitResult = algorithms.includes("First Fit") ? firstFit(blocks, processes) : null;
    const bestFitResult = algorithms.includes("Best Fit") ? bestFit(blocks, processes) : null;
    const worstFitResult = algorithms.includes("Worst Fit") ? worstFit(blocks, processes) : null;
    const nextFitResult = algorithms.includes("Next Fit") ? nextFit(blocks, processes) : null;

    // Only compare the algorithms that were actually run
    const results = [
      { name: "First Fit", result: firstFitResult },
      { name: "Best Fit", result: bestFitResult },
      { name: "Worst Fit", result: worstFitResult },
      { name: "Next Fit", result: nextFitResult }
    ].filter(item => item.result !== null);

    let bestAlgorithm = "";
    if (results.length > 0) {
      bestAlgorithm = results.reduce((best, current) => {
        const bestScore = best.result!.allocatedCount + (best.result!.utilization / 100);
        const currentScore = current.result!.allocatedCount + (current.result!.utilization / 100);
        return currentScore > bestScore ? current : best;
      }).name;
    }

    setResults({
      firstFit: firstFitResult,
      bestFit: bestFitResult,
      worstFit: worstFitResult,
      nextFit: nextFitResult,
      bestAlgorithm,
      blocks,
      processes,
    });
    setSelectedAlgorithms(algorithms);
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
                <h1 className="text-3xl font-bold">Custom Algorithm Selection</h1>
                <p className="text-muted-foreground">
                  Choose which algorithms to compare
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Compare All
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
            <MemoryInput onRunComparison={handleRunComparison} />
          </div>

          {/* Results Section */}
          {results && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Algorithm Comparison */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Algorithm Comparison</h2>
                <div className={`grid grid-cols-1 ${selectedAlgorithms.length === 2 ? 'md:grid-cols-2' : selectedAlgorithms.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'} gap-6`}>
                  {selectedAlgorithms.includes("First Fit") && results.firstFit && (
                    <AlgorithmResult
                      name="First Fit"
                      result={results.firstFit}
                      blocks={results.blocks}
                      processes={results.processes}
                      isBest={results.bestAlgorithm === "First Fit"}
                    />
                  )}
                  {selectedAlgorithms.includes("Best Fit") && results.bestFit && (
                    <AlgorithmResult
                      name="Best Fit"
                      result={results.bestFit}
                      blocks={results.blocks}
                      processes={results.processes}
                      isBest={results.bestAlgorithm === "Best Fit"}
                    />
                  )}
                  {selectedAlgorithms.includes("Worst Fit") && results.worstFit && (
                    <AlgorithmResult
                      name="Worst Fit"
                      result={results.worstFit}
                      blocks={results.blocks}
                      processes={results.processes}
                      isBest={results.bestAlgorithm === "Worst Fit"}
                    />
                  )}
                  {selectedAlgorithms.includes("Next Fit") && results.nextFit && (
                    <AlgorithmResult
                      name="Next Fit"
                      result={results.nextFit}
                      blocks={results.blocks}
                      processes={results.processes}
                      isBest={results.bestAlgorithm === "Next Fit"}
                    />
                  )}
                </div>
              </div>

              {/* Memory Visualizations */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Memory Layout</h2>
                <div className={`grid grid-cols-1 ${selectedAlgorithms.length === 2 ? 'md:grid-cols-2' : selectedAlgorithms.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'} gap-6`}>
                  {selectedAlgorithms.includes("First Fit") && results.firstFit && (
                    <MemoryVisualization
                      blocks={results.blocks}
                      processes={results.processes}
                      allocation={results.firstFit.allocation}
                      title="First Fit"
                    />
                  )}
                  {selectedAlgorithms.includes("Best Fit") && results.bestFit && (
                    <MemoryVisualization
                      blocks={results.blocks}
                      processes={results.processes}
                      allocation={results.bestFit.allocation}
                      title="Best Fit"
                    />
                  )}
                  {selectedAlgorithms.includes("Worst Fit") && results.worstFit && (
                    <MemoryVisualization
                      blocks={results.blocks}
                      processes={results.processes}
                      allocation={results.worstFit.allocation}
                      title="Worst Fit"
                    />
                  )}
                  {selectedAlgorithms.includes("Next Fit") && results.nextFit && (
                    <MemoryVisualization
                      blocks={results.blocks}
                      processes={results.processes}
                      allocation={results.nextFit.allocation}
                      title="Next Fit"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomComparison;
