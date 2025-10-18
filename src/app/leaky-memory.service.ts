import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeakyMemoryService {
  private readonly retainedBuffers: ArrayBuffer[] = [];
  private readonly leakedListeners: Array<(event: MouseEvent) => void> = [];
  private readonly retainedComponentRefs: unknown[] = [];
  private mouseEventCounter = 0;

  allocateChunk(): number {
    const megabyte = 1024 * 1024;
    this.retainedBuffers.push(new ArrayBuffer(megabyte));
    return this.retainedBuffers.length;
  }

  registerLeakingListener(listener: (event: MouseEvent) => void): number {
    window.addEventListener('mousemove', listener);
    this.leakedListeners.push(listener);
    return this.leakedListeners.length;
  }

  retainComponentRef(instance: unknown): number {
    this.retainedComponentRefs.push(instance);
    return this.retainedComponentRefs.length;
  }

  recordMouseEvent(): number {
    this.mouseEventCounter++;
    if (this.mouseEventCounter % 120 === 0) {
      this.allocateChunk();
    }

    return this.mouseEventCounter;
  }

  get allocatedBuffers(): number {
    return this.retainedBuffers.length;
  }

  get estimatedMegabytes(): number {
    return this.retainedBuffers.length;
  }

  get listenerCount(): number {
    return this.leakedListeners.length;
  }

  get retainedComponents(): number {
    return this.retainedComponentRefs.length;
  }

  get totalMouseEvents(): number {
    return this.mouseEventCounter;
  }
}
