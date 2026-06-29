# 3D LiDAR Viewer & Custom Memory Management

A full-screen interactive 3D viewer for LiDAR point clouds and 3D cuboid annotations, built as part of a technical challenge. The application loads 50 frames of sequential driving data from a remote API and renders them using Three.js via React Three Fiber, with a custom caching layer to manage memory efficiently across frame transitions.

## Features

- **Interactive 3D Viewer** — Navigate point clouds with orbit controls (mouse) or WASD + arrow keys (keyboard).
- **50-Frame Timeline** — Step through sequential driving data with next/previous controls and a progress bar.
- **Real-time Cache Monitor** — A heads-up display showing current memory usage in MB, usage percentage, cached frame IDs, and a visual warning when exceeding 80% capacity.
- **Hoverable 3D Cuboids** — Bounding boxes with hover highlighting and an info panel displaying label, stationarity, position, dimensions, yaw, and UUID.
- **Height-based Point Coloring** — Points are color-mapped by Z-axis elevation using a gradient from red (low) to blue (high).
- **Error Resilience** — Per-frame error handling with retry support and visual indicators for failed frames.

## Architecture

The application follows a **feature-based component architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│  index.html                                                 │
│    └── src/index.tsx (React entry)                          │
│         └── App (composition root)                          │
│              ├── Viewer3D (React Three Fiber Canvas)        │
│              │    ├── PointCloud    (LiDAR points)          │
│              │    ├── Cuboids       (bounding boxes)        │
│              │    ├── OrbitControls (mouse orbit)           │
│              │    └── CameraController (keyboard movement)  │
│              ├── Timeline         (frame navigation)        │
│              ├── CacheHUD         (memory monitoring)       │
│              ├── LoadingSpinner   (loading state)           │
│              ├── ErrorIndicator   (error handling)          │
│              └── InfoCuboidLabel  (hovered cuboid details)  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. The `usePointCloud` hook fetches frame data from `https://static.scale.com/uploads/pandaset-challenge/frame_XX.json`.
2. Each frame is parsed and stored in a custom `FrameCache` instance (held in a `useRef` to avoid React reconciliation overhead).
3. The `App` component reads the current frame, parses point positions via `parsePoints()`, and passes them down to the 3D scene.
4. `Viewer3D` renders the point cloud as a `BufferGeometry` with per-vertex colors and each cuboid as a `<mesh>` with an `<edgesGeometry>` wireframe.
5. User interactions (orbit, keyboard, timeline, hover) update camera state or trigger frame transitions.

## Libraries & Dependencies

### Production

| Package | Version | Purpose |
|---|---|---|
| `react` | ^18.2.0 | UI framework |
| `react-dom` | ^18.2.0 | React DOM renderer |
| `@react-three/fiber` | ^8.14.4 | Declarative Three.js renderer for React |
| `@react-three/drei` | ^9.86.3 | Utility components (OrbitControls, etc.) |
| `three` | ^0.157.0 | 3D graphics library (WebGL) |
| `react-use` | ^17.4.0 | Collection of reusable React hooks |

### Development

| Package | Version | Purpose |
|---|---|---|
| `parcel` | ^2.9.3 | Zero-config bundler with HMR |
| `typescript` | ^5.2.2 | Type checking and compilation |
| `@types/react` | ^19.2.17 | React type definitions |
| `@types/react-dom` | ^19.2.3 | ReactDOM type definitions |
| `@types/three` | ^0.156.0 | Three.js type definitions |
| `buffer` | ^5.5.0 / ^6.0.0 | Buffer polyfill (used by Parcel) |

**Package manager:** pnpm

## Project Structure

```
src/
├── index.tsx                  # React entry point
├── root.css                   # Global reset & CSS custom properties
├── types.ts                   # Shared TypeScript interfaces
├── config.ts                  # Centralized configuration constants
├── declarations.d.ts          # CSS Modules type declarations
├── components/
│   ├── App/                   # Composition root, wires all components
│   ├── Viewer3D/              # React Three Fiber Canvas setup
│   ├── PointCloud/            # LiDAR point rendering with color-by-height
│   ├── Cuboids/               # 3D bounding boxes with hover interaction
│   ├── CacheHUD/              # Real-time cache usage overlay
│   ├── Timeline/              # Frame navigation bar
│   ├── LoadingSpinner/        # Full-screen loading overlay
│   ├── ErrorIndicator/        # Error display with retry
│   └── InfoCuboidLabel/       # Hovered cuboid details panel
├── hooks/
│   ├── usePointCloud.ts       # Data fetching, caching, frame state
│   └── useControls.ts         # Keyboard input state (WASD + arrows)
└── utils/
    ├── index.ts               # parsePoints(), getFrameUrl(), getMaxFrameMB
    ├── color.ts               # heightColor() gradient function
    └── FrameCache.ts          # Custom LRU-ish frame cache with eviction
```

Each component is contained in its own directory with a co-located CSS Module for scoped styling.

## Getting Started

### Prerequisites

- **Node.js** >= 18 (or any modern version with `fetch` and `AbortSignal.timeout`)
- **pnpm** (recommended) or **npm**

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm run dev
```

Starts a Parcel development server with Hot Module Replacement on `index.html`.

### Build

```bash
pnpm run build
```

Produces an optimized production build in the `dist/` directory.

### Clean

```bash
pnpm run clean
```

Removes `.cache`, `.parcel-cache`, and `dist/` directories.

## Configuration

All runtime constants are defined in `src/config.ts`:

| Constant | Default | Description |
|---|---|---|
| `BASE_URL` | `https://static.scale.com/uploads/pandaset-challenge` | Remote data source |
| `TOTAL_FRAMES` | `50` | Number of frames in the dataset |
| `PRE_FETCH_COUNT` | `2` | Frames to prefetch ahead of the current frame |
| `MAX_FRAME_CACHE_MB` | `512` | Hard cache limit in megabytes |
| `WARNING_THRESHOLD` | `0.8` | Cache usage ratio that triggers a warning (80%) |
| `FETCH_TIMEOUT_MS` | `15_000` | Per-fetch timeout in milliseconds |

The cache limit can also be overridden at runtime via the URL query parameter:

```
?MAX_FRAME_CACHE_MB=256
```

## Custom Memory Management

The `FrameCache` class (`src/utils/FrameCache.ts`) is a custom caching layer designed to handle large point cloud frames without exhausting browser memory:

- **Storage:** Frames are stored in a `Map<number, FrameEntry>` keyed by frame index.
- **Size Estimation:** Byte sizes are estimated from point count (3 floats × 4 bytes per point) plus cuboid overhead.
- **Eviction Policy:** LRU-style — when total bytes exceed `maxBytes`, the least-recently-accessed frame is evicted and its Three.js geometries are disposed.
- **Disposables Registry:** Frames can register cleanup callbacks to properly release WebGL resources on eviction.
- **Warning System:** Emits warnings via an `onWarning` callback when usage exceeds the configured threshold (default 80%).

The cache instance lives outside React state (in a `useRef`), so cache operations don't trigger re-renders. In-flight requests are deduplicated via a separate `Map` to prevent fetching the same frame twice concurrently.

## Additional Considerations

- **State Management:** No external state library is used. All state is managed via React hooks (`useState`, `useRef`, `useCallback`, `useEffect`) and the custom `FrameCache` class.
- **Routing:** This is a single-page application with no routing.
- **Styling:** CSS Modules provide component-scoped styles, with global CSS custom properties defined in `root.css` for consistent theming.
- **Camera Controls:** Two independent control systems coexist — OrbitControls (mouse) and an imperative keyboard controller. The keyboard controller uses a ref-based approach in `useControls` to read key state inside `useFrame` without triggering React re-renders.
- **Memory Estimation:** The cache estimates byte sizes rather than measuring actual memory, since the JavaScript heap does not expose per-object memory usage.
- **Geometry Disposal:** Three.js geometries are created fresh in `useMemo` and rely on the garbage collector when the component unmounts or positions change. The `FrameCache` handles explicit disposal for evicted frames.
- **Browser Requirements:** The project uses modern browser APIs (`fetch`, `AbortSignal.timeout`, ES2022 classes) and targets ES2022.
- **No Environment Variables:** The application requires no environment variables or server-side configuration. All settings are compile-time constants or runtime URL parameters.
