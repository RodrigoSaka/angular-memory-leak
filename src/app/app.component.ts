import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeakyPanelComponent } from './leaky-panel/leaky-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LeakyPanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  protected panelKeys: number[] = [];
  protected totalMounts = 0;
  protected autoCycling = false;

  private nextKey = 1;
  private autoCycleTimer: number | null = null;

  protected addPanel(): void {
    this.panelKeys = [...this.panelKeys, this.nextKey++];
    this.totalMounts++;
  }

  protected destroyAllPanels(): void {
    this.panelKeys = [];
  }

  protected toggleAutoCycle(): void {
    if (this.autoCycling) {
      this.stopAutoCycle();
      return;
    }

    this.autoCycling = true;
    this.autoCycleTimer = window.setInterval(() => {
      if (this.panelKeys.length === 0) {
        this.addPanel();
      } else {
        this.destroyAllPanels();
      }
    }, 1500);
  }

  protected trackById(_index: number, id: number): number {
    return id;
  }

  ngOnDestroy(): void {
    this.stopAutoCycle();
  }

  private stopAutoCycle(): void {
    if (this.autoCycleTimer !== null) {
      window.clearInterval(this.autoCycleTimer);
      this.autoCycleTimer = null;
    }

    this.autoCycling = false;
  }
}
