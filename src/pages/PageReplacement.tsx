import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fifoPageReplacement, PageReplacementResult } from "@/lib/pageReplacement";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PageReplacement = () => {
  const [framesCount, setFramesCount] = useState<number>(3);
  const [pageString, setPageString] = useState<string>("7,0,1,2,0,3,0,4,2,3,0,3,2");
  const [result, setResult] = useState<PageReplacementResult | null>(null);

  const handleSimulate = () => {
    const pages = pageString.split(",").map(p => parseInt(p.trim())).filter(p => !isNaN(p));
    
    if (pages.length === 0) {
      alert("Please enter valid page numbers");
      return;
    }
    
    if (framesCount < 1) {
      alert("Number of frames must be at least 1");
      return;
    }

    const fifoResult = fifoPageReplacement(pages, framesCount);
    setResult(fifoResult);
  };

  const handleReset = () => {
    setResult(null);
    setFramesCount(3);
    setPageString("7,0,1,2,0,3,0,4,2,3,0,3,2");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Page Replacement Simulator
            </h1>
            <p className="text-muted-foreground mt-2">
              Visualize virtual memory page replacement using FIFO algorithm
            </p>
          </div>
        </div>

        {/* Input Section */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle>Simulation Parameters</CardTitle>
            <CardDescription>Configure the page replacement simulation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frames">Number of Frames</Label>
                <Input
                  id="frames"
                  type="number"
                  min="1"
                  max="10"
                  value={framesCount}
                  onChange={(e) => setFramesCount(parseInt(e.target.value) || 1)}
                  placeholder="e.g., 3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pages">Page Reference String (comma-separated)</Label>
                <Input
                  id="pages"
                  type="text"
                  value={pageString}
                  onChange={(e) => setPageString(e.target.value)}
                  placeholder="e.g., 7,0,1,2,0,3,0,4"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSimulate} className="flex-1">
                Run FIFO Simulation
              </Button>
              <Button onClick={handleReset} variant="outline">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <>
            {/* Statistics */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Page Faults</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-destructive">
                    {result.pageFaults}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Page Hits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {result.pageHits}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20 bg-accent/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Hit Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent-foreground">
                    {result.hitRate.toFixed(1)}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Visualization */}
            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle>FIFO Page Replacement Process</CardTitle>
                <CardDescription>Step-by-step visualization of page replacement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-primary/20">
                        <th className="p-3 text-left font-semibold">Step</th>
                        <th className="p-3 text-left font-semibold">Page</th>
                        <th className="p-3 text-left font-semibold">Frames State</th>
                        <th className="p-3 text-left font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.steps.map((step, index) => (
                        <tr 
                          key={index}
                          className={`border-b border-border/50 transition-colors ${
                            step.fault ? 'bg-destructive/5' : 'bg-primary/5'
                          }`}
                        >
                          <td className="p-3 font-mono">{step.step}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="font-mono text-base px-3 py-1">
                              {step.page}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              {step.frames.map((frame, idx) => (
                                <div
                                  key={idx}
                                  className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-mono font-semibold ${
                                    frame === step.page && step.fault
                                      ? 'border-destructive bg-destructive/10 text-destructive'
                                      : 'border-primary/30 bg-primary/5 text-primary'
                                  }`}
                                >
                                  {frame}
                                </div>
                              ))}
                              {/* Empty frame slots */}
                              {Array.from({ length: framesCount - step.frames.length }).map((_, idx) => (
                                <div
                                  key={`empty-${idx}`}
                                  className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30"
                                >
                                  -
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge 
                              variant={step.fault ? "destructive" : "default"}
                              className="font-medium"
                            >
                              {step.fault ? "Page Fault" : "Page Hit"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default PageReplacement;
