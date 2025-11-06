import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

interface PerformanceWithMemory extends Performance {
  readonly memory?: {
    readonly jsHeapSizeLimit: number;
    readonly totalJSHeapSize?: number;
    readonly usedJSHeapSize: number;
  };
}

@Component({
  selector: 'app-devtools-checklist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './devtools-checklist.component.html',
  styleUrl: './devtools-checklist.component.css'
})
export class DevtoolsChecklistComponent implements OnInit, OnDestroy {
  protected canProbeHeap = false;
  protected heapUsageMb: number | null = null;
  protected heapLimitMb: number | null = null;

  private heapSampleTimerId: number | null = null;

  ngOnInit(): void {
    this.startHeapSampling();
  }

  ngOnDestroy(): void {
    this.stopHeapSampling();
  }

  private startHeapSampling(): void {
    if (typeof performance === 'undefined') {
      return;
    }

    const perf = performance as PerformanceWithMemory;
    if (!perf.memory) {
      return;
    }

    this.canProbeHeap = true;
    this.captureHeapSample(perf.memory);

    this.heapSampleTimerId = window.setInterval(() => {
      if (!perf.memory) {
        this.stopHeapSampling();
        return;
      }

      this.captureHeapSample(perf.memory);
    }, 1000);
  }

  private stopHeapSampling(): void {
    if (this.heapSampleTimerId !== null) {
      window.clearInterval(this.heapSampleTimerId);
      this.heapSampleTimerId = null;
    }
  }

  private captureHeapSample(memory: NonNullable<PerformanceWithMemory['memory']>): void {
    const megabyte = 1024 * 1024;
    this.heapUsageMb = Math.round(memory.usedJSHeapSize / megabyte);

    const reportedLimit = memory.jsHeapSizeLimit ?? memory.totalJSHeapSize ?? null;
    this.heapLimitMb = reportedLimit ? Math.round(reportedLimit / megabyte) : null;
  }
}
