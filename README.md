# Interactive 3D Graph Visualization

This project is an interactive 3D graph visualization built with Three.js. It displays hierarchical data, such as learning subjects, as nodes connected by edges, allowing users to explore relationships by expanding and collapsing parts of the graph.

## Features

- **Interactive 3D Visualization**: Explore the graph in three dimensions with smooth camera controls
- **Hierarchical Data Display**: View data organized in multiple levels (e.g., main subjects and their sub-topics)
- **Dynamic Node Expansion**: 
  - Start with just the root node visible
  - Click to expand nodes and reveal connected nodes
  - Click again to collapse nodes and hide their descendants
- **Visual Feedback**:
  - Green nodes: Normal state
  - Red nodes: Expanded state
  - Yellow nodes: Hover state
  - Semi-transparent blue edges showing connection strength
- **Always-Facing Text**: Labels that automatically rotate to face the camera
- **Responsive Design**: Adapts to different screen sizes

## Data Structure

The graph data is separated from the visualization code for easy modification. The data structure includes:

- **Nodes**: Represent subjects or topics
  - Position in 3D space
  - Name/label
  - Hierarchical level
- **Edges**: Represent relationships between nodes
  - Connection between nodes
  - Weight (visualized as edge thickness)

## Setup and Usage

1. Clone the repository
2. Open `index.html` in a web browser
3. Interact with the graph:
   - Left-click and drag to rotate
   - Right-click and drag to pan
   - Scroll to zoom in/out
   - Click on nodes to expand/collapse

## Project Structure

```
.
├── index.html          # Main HTML file
├── graph.js            # Visualization code
├── graph_data.js       # Graph data structure
└── README.md          # This file
```

## Dependencies

- Three.js (loaded via CDN)
- OrbitControls for camera manipulation
- FontLoader for text rendering

## Customization

To modify the graph data:
1. Edit `graph_data.js`
2. Update the nodes and edges arrays
3. Maintain the same data structure format

## Future Enhancements

- Add animations for expand/collapse transitions
- Implement search functionality
- Add tooltips with additional information
- Support for loading different data sets
- Custom styling options

## License

This project is open source and available under the MIT License. 