# Angular Memory Leak Playground

A deliberately leaky Angular application that you can use to learn, demo, and benchmark memory leak diagnostics in modern browsers. It spins up quickly, leaks aggressively, and provides predictable signals in DevTools so you can practice finding and fixing the root cause.

## Key Capabilities

- **Repeatable leak scenario** – mount and destroy leaking components with a single click.
- **High-signal telemetry** – generates growing heaps, retained DOM nodes, and active timers to inspect in Chrome or Edge DevTools.
- **Hands-on learning** – showcases common Angular anti-patterns that lead to leaks and demonstrates how to mitigate them.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Run Locally

```bash
npm start
```

The development server runs at `http://localhost:4200`. Open the URL in Chrome or another Chromium-based browser for the best tooling support.

## Reproducing the Leak

1. Open Chrome DevTools and navigate to the **Memory** tab (or **Performance → Memory** on Edge/Chromium).
2. Click **Add Leaky Panel** a few times, then click **Destroy All Panels**.
3. Take a **Heap Snapshot**, repeat the add/destroy cycle, and compare snapshots. The counts for `app-leaky-panel`, `ArrayBuffer`, and event listeners continue to grow.
4. Enable **Start Auto Cycle** to mount/dismount items automatically. Move the pointer across the screen to accelerate buffer allocation.
5. Record a short profile in the **Performance** tab and inspect **Event Listeners** to confirm that timers and handlers stay registered after components unmount.

## What Is Leaking?

- `LeakyPanelComponent` registers `setInterval` timers and global event listeners without cleaning them up in `ngOnDestroy`.
- `LeakyMemoryService` holds strong references to component instances and listener functions, preventing garbage collection.
- Each interval adds a 1 MB `ArrayBuffer`, and the corresponding button triggers bursts of 20 MB allocations.

## Fixing the Leak

- Release external resources during teardown:

  ```ts
  ngOnDestroy(): void {
    window.removeEventListener('mousemove', this.leakingListener);
    if (this.allocationTimerId) {
      window.clearInterval(this.allocationTimerId);
    }
  }
  ```

- Drop strong references in services once components unmount (clear arrays or leverage `WeakRef` / `WeakSet` where possible).
- Avoid large buffers unless necessary, and release references immediately after use.
- Validate the fix by repeating heap snapshots: instance counts and `ArrayBuffer` allocations should stabilize after destroying all panels.

## Available Scripts

- `npm start` – run the development server with hot reload.
- `npm run build` – produce an optimized production build.
- `npm test` – execute unit tests with Karma.

## Contributing

Issues, discussions, and pull requests are welcome. If you plan to make significant changes, open an issue first so we can align on the approach. Please follow conventional Angular coding guidelines and include relevant tests when possible.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
