import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LeakyMemoryService } from '../leaky-memory.service';

@Component({
  selector: 'app-leaky-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaky-panel.component.html',
  styleUrl: './leaky-panel.component.css'
})
export class LeakyPanelComponent implements OnInit, OnDestroy {
  protected allocatedBuffers = 0;
  protected leakedListeners = 0;
  protected retainedComponents = 0;
  protected trackedMouseEvents = 0;

  private allocationTimerId: number | null = null;

  private readonly leakingListener = (_event: MouseEvent) => {
    this.trackedMouseEvents = this.leakyMemory.recordMouseEvent();
  };

  constructor(private readonly leakyMemory: LeakyMemoryService) {}

  ngOnInit(): void {
    this.retainedComponents = this.leakyMemory.retainComponentRef(this);
    this.leakedListeners = this.leakyMemory.registerLeakingListener(this.leakingListener);

    this.allocationTimerId = window.setInterval(() => {
      this.allocatedBuffers = this.leakyMemory.allocateChunk();
      this.leakedListeners = this.leakyMemory.listenerCount;
      this.retainedComponents = this.leakyMemory.retainedComponents;
      this.trackedMouseEvents = this.leakyMemory.totalMouseEvents;
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
      this.allocatedBuffers = this.leakyMemory.allocateChunk();
    }
  }
}
