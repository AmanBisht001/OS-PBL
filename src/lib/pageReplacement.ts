export interface PageReplacementStep {
  step: number;
  page: number;
  frames: number[];
  fault: boolean;
}

export interface PageReplacementResult {
  pageFaults: number;
  pageHits: number;
  steps: PageReplacementStep[];
  hitRate: number;
}

// FIFO Page Replacement Algorithm
export function fifoPageReplacement(pages: number[], framesCount: number): PageReplacementResult {
  const frames: number[] = [];
  let pageFaults = 0;
  let pageHits = 0;
  const steps: PageReplacementStep[] = [];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const isFault = !frames.includes(page);

    if (isFault) {
      // Page Fault occurs
      if (frames.length < framesCount) {
        frames.push(page);
      } else {
        frames.shift(); // Remove first page (FIFO)
        frames.push(page);
      }
      pageFaults++;
    } else {
      pageHits++;
    }

    steps.push({
      step: i + 1,
      page,
      frames: [...frames],
      fault: isFault
    });
  }

  const hitRate = (pageHits / pages.length) * 100;

  return { pageFaults, pageHits, steps, hitRate };
}
