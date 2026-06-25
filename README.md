# 3D LiDAR Viewer & Custom Memory Management

This is my solution to the technical 3D visualization challenge. The project features a full-screen interactive viewer for LiDAR point clouds and 3D cuboids built with React Three Fiber (Three.js) and TypeScript, optimized to handle high-throughput datasets via a custom caching layer.

## Project Structure

* **src/components/**: Encapsulated architecture. Structural components (`Viewer3D`, `PointCloud`, `Cuboids`, `CacheHUD`) reside in separate folders to isolate re-renders and maintain scoped styles via CSS Modules.
* **src/hooks/**: Handles React state and lifecycles. `useControls.ts` decouples key listeners from the Three.js render loop, and `usePointCloud.ts` handles the asynchronous flow of frames.
* **src/utils/**: Framework-agnostic logic. Contains the critical `FrameCache.ts` orchestration layer and the color interpolation logic in `color.ts`.
* **Root files (`config.ts`, `types.ts`)**: Single source of truth for global system constants, warning thresholds, and strict TypeScript types.


## Diagnostic UI

* **CacheHUD**: A real-time monitoring HUD built with CSS Modules. It tracks allocated megabytes against the hard ceiling and triggers a soft warning when usage exceeds 90% of the assigned budget.

## Getting Started

1. Install dependencies:
```bash
npm install
```
2. Run the development server:
```bash
npm run dev
```