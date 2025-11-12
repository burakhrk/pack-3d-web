# 3D Container Packing Visualizer

An interactive 3D visualization tool for container packing optimization using the First-Fit Decreasing (FFD) algorithm. Built with React, TypeScript, Three.js, and Web Workers.

## Features

- 🎯 **3D First-Fit Decreasing Algorithm**: Efficient heuristic for bin packing problems
- 🔄 **Web Worker Processing**: Non-blocking computation for smooth UI
- 🎨 **Interactive 3D Visualization**: Powered by Three.js and react-three-fiber
- 🖱️ **Orbit Controls**: Click and drag to rotate, scroll to zoom
- 💡 **Hover Tooltips**: Hover over items to see details
- 📊 **Real-time Statistics**: Container utilization and packing efficiency
- 📱 **Responsive Design**: Works on desktop and tablet devices
- ✅ **Unit Tested**: Collision detection and utilization calculations

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Three.js** - 3D rendering
- **react-three-fiber** - React renderer for Three.js
- **@react-three/drei** - Helper components for Three.js
- **Web Workers** - Background processing
- **Vitest** - Unit testing framework
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed
- Modern web browser with WebGL support

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:8080`

## Usage

### JSON Input Format

The application accepts JSON input with the following structure:

```json
{
  "container": {
    "id": "container-1",
    "width": 10,
    "height": 10,
    "depth": 10
  },
  "items": [
    {
      "id": "item-1",
      "name": "Box A",
      "width": 3,
      "height": 3,
      "depth": 3
    },
    {
      "id": "item-2",
      "name": "Box B",
      "width": 2,
      "height": 4,
      "depth": 2
    }
  ]
}
```

### How to Use

1. **Enter JSON Data**: Paste your container and items data in the JSON input area, or click "Load Example" to use sample data
2. **Run Algorithm**: Click "Run Packing Algorithm" to process the data
3. **View Results**: The 3D visualization will show packed items in the container
4. **Interact**: 
   - Drag to rotate the view
   - Scroll to zoom in/out
   - Hover over items to see details
5. **Check Statistics**: View utilization percentage and packing efficiency

## Algorithm Details

### First-Fit Decreasing (FFD)

The algorithm works as follows:

1. **Sort Items**: Items are sorted by volume in descending order (largest first)
2. **Position Search**: For each item, search for the first available position using a grid-based approach
3. **Collision Detection**: Check if the item fits in the container and doesn't collide with already packed items
4. **Place Item**: If a valid position is found, place the item; otherwise, mark it as unpacked

### Complexity

- Time Complexity: O(n² × m) where n is the number of items and m is the grid resolution
- Space Complexity: O(n) for storing packed items

## Testing

Run unit tests:

```bash
npm run test
```

The test suite includes:
- Collision detection tests
- Container fit validation
- Volume calculation
- Utilization percentage calculation

## Project Structure

```
src/
├── components/          # React components
│   ├── JsonInput.tsx   # JSON input interface
│   ├── Scene3D.tsx     # Three.js 3D scene
│   ├── ItemPanel.tsx   # Item list sidebar
│   └── StatsPanel.tsx  # Statistics display
├── hooks/
│   └── usePackingWorker.ts  # Web Worker hook
├── types/
│   └── packing.ts      # TypeScript interfaces
├── utils/
│   ├── collision.ts    # Collision detection logic
│   ├── collision.test.ts # Unit tests
│   └── packing-algorithm.ts # FFD implementation
├── workers/
│   └── packing.worker.ts # Web Worker for background processing
└── pages/
    └── Index.tsx       # Main application page
```

## Building for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Customization

### Adjust Grid Resolution

In `src/utils/packing-algorithm.ts`, modify the `step` variable:

```typescript
const step = 0.5; // Lower values = finer resolution (slower)
```

### Change Item Colors

Modify the `ITEM_COLORS` array in `src/utils/packing-algorithm.ts`:

```typescript
const ITEM_COLORS = [
  "#3B82F6", // blue
  "#10B981", // green
  // Add more colors...
];
```

### Adjust Camera Position

In `src/components/Scene3D.tsx`, modify the camera setup:

```typescript
const cameraDistance = maxDimension * 2; // Adjust multiplier
```

## Known Limitations

- The FFD algorithm is a heuristic and may not find the optimal packing
- Very large item sets may take longer to process
- Grid-based search resolution affects both accuracy and performance

## Future Enhancements

- [ ] Support for item rotation
- [ ] Weight constraints and center of gravity
- [ ] Multiple container support
- [ ] Export packing results
- [ ] Genetic algorithm implementation
- [ ] Real-time algorithm comparison

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on the GitHub repository.
