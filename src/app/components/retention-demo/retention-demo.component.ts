import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RetentionHarnessService } from '../../services/retention-harness/retention-harness.service';

@Component({
  selector: 'app-retention-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './retention-demo.component.html',
  styleUrl: './retention-demo.component.css'
})
export class RetentionDemoComponent implements OnInit, OnDestroy {
  protected allocatedBuffers = 0;
  protected leakedListeners = 0;
  protected retainedComponents = 0;
  protected trackedMouseEvents = 0;

  private allocationTimerId: number | null = null;

  private readonly leakingListener = (_event: MouseEvent) => {
    this.trackedMouseEvents = this.retentionHarness.recordMouseEvent();
  };

  constructor(private readonly retentionHarness: RetentionHarnessService) {}

  ngOnInit(): void {
    this.retainedComponents = this.retentionHarness.retainComponentRef(this);
    this.leakedListeners = this.retentionHarness.registerLeakingListener(this.leakingListener);

    this.allocationTimerId = window.setInterval(() => {
      this.allocatedBuffers = this.retentionHarness.allocateChunk();
      this.leakedListeners = this.retentionHarness.listenerCount;
      this.retainedComponents = this.retentionHarness.retainedComponents;
      this.trackedMouseEvents = this.retentionHarness.totalMouseEvents;
    }, 1000);
  }

  ngOnDestroy(): void {
    // Intentionally left blank to reproduce the leak.
    // window.removeEventListener('mousemove', this.leakingListener);
    // if (this.allocationTimerId) {
    //   window.clearInterval(this.allocationTimerId);
    // }
  }

  protected triggerBurst(): void {
    for (let index = 0; index < 20; index++) {
      this.allocatedBuffers = this.retentionHarness.allocateChunk();
    }
  }
}
