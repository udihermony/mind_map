// Add sidebar HTML structure
const sidebarHTML = `
<div id="sidebar">
    <div id="sidebar-content"></div>
</div>
`;

// Add sidebar CSS
const sidebarCSS = `
#sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 250px;
    height: 100vh;
    background-color: rgba(44, 62, 80, 0.9);
    color: white;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0,0,0,0.2);
    z-index: 1000;
    overflow-y: auto;
}

.node-item {
    padding: 8px;
    cursor: pointer;
    border-radius: 4px;
    margin: 4px 0;
    transition: background-color 0.2s;
}

.node-item:hover {
    background-color: rgba(255,255,255,0.1);
}

.node-item.expanded {
    background-color: rgba(231, 76, 60, 0.2);
}

.node-children {
    margin-left: 20px;
    display: none;
}

.node-children.visible {
    display: block;
}

.node-item .toggle {
    margin-right: 8px;
    display: inline-block;
    width: 16px;
    text-align: center;
}
`;

// Add styles to document
const styleElement = document.createElement('style');
styleElement.textContent = sidebarCSS;
document.head.appendChild(styleElement);

// Add sidebar to document
document.body.insertAdjacentHTML('beforeend', sidebarHTML);

// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Add orbit controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Set camera position
camera.position.set(0, 0, 15);

// Create skybox
const cubeTextureLoader = new THREE.CubeTextureLoader();
const skyboxTexture = cubeTextureLoader.load([
    'https://threejs.org/examples/textures/cube/skybox/px.jpg', // right
    'https://threejs.org/examples/textures/cube/skybox/nx.jpg', // left
    'https://threejs.org/examples/textures/cube/skybox/py.jpg', // top
    'https://threejs.org/examples/textures/cube/skybox/ny.jpg', // bottom
    'https://threejs.org/examples/textures/cube/skybox/pz.jpg', // front
    'https://threejs.org/examples/textures/cube/skybox/nz.jpg'  // back
]);

scene.background = skyboxTexture;

// Create a group to hold all graph elements
const graphGroup = new THREE.Group();
scene.add(graphGroup);

// Simple lighting setup
const ambientLight = new THREE.AmbientLight(0x666666); // Slightly brighter ambient
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // Increased intensity
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true; // Enable shadows

// Configure shadow properties
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;

scene.add(directionalLight);

// Enable shadows in the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows

// Create nodes (spheres)
const nodeGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const nodeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x27ae60
});
const nodeHoverMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xf1c40f
});
const nodeExpandedMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xc0392b
});

// Store all created objects for easy access
const nodeObjects = [];
const edgeObjects = [];
const textObjects = [];
const textBackgrounds = [];

// Track expanded state of nodes
const expandedNodes = new Set([0]); // Start with only the root node expanded

// Create and add nodes to the scene
graphData.nodes.forEach((node, index) => {
    const sphere = new THREE.Mesh(nodeGeometry, nodeMaterial);
    sphere.position.copy(node.position);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.userData = {
        index: index,
        isExpanded: index === 0,
        level: getNodeLevel(index)
    };
    graphGroup.add(sphere);
    nodeObjects.push(sphere);
});

// Create and add edges to the scene with varying widths
graphData.edges.forEach(edge => {
    const startPos = graphData.nodes[edge.start].position;
    const endPos = graphData.nodes[edge.end].position;
    
    const path = new THREE.CatmullRomCurve3([startPos, endPos]);
    const tubeGeometry = new THREE.TubeGeometry(path, 20, edge.weight * 0.01, 8, false);
    const lineMaterial = new THREE.MeshStandardMaterial({
        color: 0x5dade2,
        transparent: true,
        opacity: 0.7,
        roughness: 0.8
    });
    const tube = new THREE.Mesh(tubeGeometry, lineMaterial);
    tube.castShadow = true;
    tube.receiveShadow = true;
    tube.userData = {
        start: edge.start,
        end: edge.end
    };
    graphGroup.add(tube);
    edgeObjects.push(tube);
});

// Add text labels to nodes
const loader = new THREE.FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
    graphData.nodes.forEach((node, index) => {
        const textGeometry = new THREE.TextGeometry(node.name, {
            font: font,
            size: 0.1,
            height: 0.02
        });
        const textMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            depthTest: false
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        
        textMesh.position.copy(node.position);
        textMesh.position.y += 0.25;
        
        textGeometry.computeBoundingBox();
        const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
        textMesh.position.x -= textWidth / 2;
        
        // Create background plane for text
        const backgroundGeometry = new THREE.PlaneGeometry(textWidth + 0.1, 0.2);
        const backgroundMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.0
        });
        const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        backgroundMesh.position.copy(textMesh.position);
        backgroundMesh.position.z -= 0.01;
        
        textObjects.push(textMesh);
        textBackgrounds.push(backgroundMesh);
        graphGroup.add(backgroundMesh);
        graphGroup.add(textMesh);
    });

    // Build initial sidebar
    buildSidebarTree();
});

// Raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Add hover state tracking
let hoveredNode = null;
const tooltip = document.getElementById('tooltip');

// Add mousemove event listener
window.addEventListener('mousemove', onMouseMove, false);

// Add click event listener
window.addEventListener('click', onMouseClick, false);

function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(nodeObjects);

    // Handle hover state
    if (intersects.length > 0) {
        const node = intersects[0].object;
        const nodeIndex = node.userData.index;
        
        // If hovering over a new node
        if (hoveredNode !== node) {
            // Reset previous hovered node
            if (hoveredNode) {
                hoveredNode.material = expandedNodes.has(hoveredNode.userData.index) 
                    ? nodeExpandedMaterial 
                    : nodeMaterial;
                hoveredNode.scale.set(1, 1, 1);
            }
            
            // Set new hovered node
            hoveredNode = node;
            hoveredNode.material = nodeHoverMaterial;
            hoveredNode.scale.set(1.2, 1.2, 1.2);
            
            // Show tooltip
            const nodeData = graphData.nodes[nodeIndex];
            tooltip.textContent = nodeData.name;
            tooltip.style.opacity = '1';
            
            // Position tooltip
            const vector = new THREE.Vector3();
            vector.setFromMatrixPosition(node.matrixWorld);
            vector.project(camera);
            
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
            
            tooltip.style.left = `${x + 10}px`;
            tooltip.style.top = `${y - 10}px`;
        }
    } else {
        // No node being hovered
        if (hoveredNode) {
            hoveredNode.material = expandedNodes.has(hoveredNode.userData.index) 
                ? nodeExpandedMaterial 
                : nodeMaterial;
            hoveredNode.scale.set(1, 1, 1);
            hoveredNode = null;
            tooltip.style.opacity = '0';
        }
    }
}

// Update the click handler to work with hover effects
function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(nodeObjects);

    if (intersects.length > 0) {
        const clickedNode = intersects[0].object;
        const nodeIndex = clickedNode.userData.index;
        
        // Toggle expanded state
        if (expandedNodes.has(nodeIndex)) {
            // When collapsing, also remove all descendants from expandedNodes
            removeDescendantsFromExpanded(nodeIndex);
            expandedNodes.delete(nodeIndex);
            clickedNode.material = nodeMaterial;
        } else {
            expandedNodes.add(nodeIndex);
            clickedNode.material = nodeExpandedMaterial;
        }
        
        // Update visibility
        updateVisibility();
    }
}

function removeDescendantsFromExpanded(nodeIndex) {
    // Get all descendants of the node
    const descendants = getDescendants(nodeIndex);
    
    // Remove all descendants from expandedNodes
    descendants.forEach(descendant => {
        expandedNodes.delete(descendant);
    });
}

function getDescendants(nodeIndex) {
    const descendants = new Set();
    const queue = [nodeIndex];
    
    while (queue.length > 0) {
        const current = queue.shift();
        
        // Find all children of current node
        graphData.edges.forEach(edge => {
            if (edge.start === current) {
                const child = edge.end;
                if (!descendants.has(child)) {
                    descendants.add(child);
                    queue.push(child);
                }
            }
        });
    }
    
    return descendants;
}

// Function to build the sidebar tree
function buildSidebarTree() {
    const sidebarContent = document.getElementById('sidebar-content');
    sidebarContent.innerHTML = ''; // Clear existing content
    
    // Create a map of nodes to their children
    const nodeChildren = new Map();
    graphData.edges.forEach(edge => {
        if (!nodeChildren.has(edge.start)) {
            nodeChildren.set(edge.start, []);
        }
        nodeChildren.get(edge.start).push(edge.end);
    });
    
    // Recursive function to build the tree
    function buildNodeElement(nodeIndex, level = 0) {
        const node = graphData.nodes[nodeIndex];
        const children = nodeChildren.get(nodeIndex) || [];
        
        const nodeElement = document.createElement('div');
        nodeElement.className = 'node-item';
        nodeElement.dataset.nodeIndex = nodeIndex;
        
        const toggleSpan = document.createElement('span');
        toggleSpan.className = 'toggle';
        toggleSpan.textContent = children.length > 0 ? (expandedNodes.has(nodeIndex) ? '▼' : '▶') : '•';
        nodeElement.appendChild(toggleSpan);
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = node.name;
        nodeElement.appendChild(nameSpan);
        
        if (expandedNodes.has(nodeIndex)) {
            nodeElement.classList.add('expanded');
        }
        
        // Add click handler
        nodeElement.addEventListener('click', (e) => {
            e.stopPropagation();
            const clickedNodeIndex = parseInt(nodeElement.dataset.nodeIndex);
            
            if (expandedNodes.has(clickedNodeIndex)) {
                expandedNodes.delete(clickedNodeIndex);
                removeDescendantsFromExpanded(clickedNodeIndex);
            } else {
                expandedNodes.add(clickedNodeIndex);
            }
            
            updateVisibility();
            buildSidebarTree(); // Rebuild the sidebar to reflect changes
        });
        
        // Add hover effect
        nodeElement.addEventListener('mouseenter', () => {
            const index = parseInt(nodeElement.dataset.nodeIndex);
            if (nodeObjects[index]) {
                nodeObjects[index].material = nodeHoverMaterial;
                nodeObjects[index].scale.set(1.2, 1.2, 1.2);
            }
        });
        
        nodeElement.addEventListener('mouseleave', () => {
            const index = parseInt(nodeElement.dataset.nodeIndex);
            if (nodeObjects[index]) {
                nodeObjects[index].material = expandedNodes.has(index) 
                    ? nodeExpandedMaterial 
                    : nodeMaterial;
                nodeObjects[index].scale.set(1, 1, 1);
            }
        });
        
        if (children.length > 0) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'node-children';
            if (expandedNodes.has(nodeIndex)) {
                childrenContainer.classList.add('visible');
            }
            
            children.forEach(childIndex => {
                childrenContainer.appendChild(buildNodeElement(childIndex, level + 1));
            });
            
            nodeElement.appendChild(childrenContainer);
        }
        
        return nodeElement;
    }
    
    // Start with root node (index 0)
    sidebarContent.appendChild(buildNodeElement(0));
}

// Modify the updateVisibility function to also update the sidebar
function updateVisibility() {
    // Update node visibility and appearance
    nodeObjects.forEach((node, index) => {
        const isVisible = isNodeVisible(index);
        node.visible = isVisible;
        
        // Update node color based on state
        if (isVisible) {
            if (expandedNodes.has(index)) {
                node.material = nodeExpandedMaterial;
            } else {
                node.material = nodeMaterial;
            }
        }
    });

    // Update edge visibility
    edgeObjects.forEach(edge => {
        const startVisible = isNodeVisible(edge.userData.start);
        const endVisible = isNodeVisible(edge.userData.end);
        edge.visible = startVisible && endVisible;
    });

    // Update text visibility
    textObjects.forEach((text, index) => {
        text.visible = isNodeVisible(index);
    });
    
    // Update sidebar
    buildSidebarTree();
}

function isNodeVisible(index) {
    // Root node is always visible
    if (index === 0) return true;

    // Find direct parent nodes
    const parentNodes = [];
    graphData.edges.forEach(edge => {
        if (edge.end === index) {
            parentNodes.push(edge.start);
        }
    });

    // Node is visible if any of its parents are expanded
    return parentNodes.some(parentIndex => expandedNodes.has(parentIndex));
}

function getNodeLevel(index) {
    // Determine node level based on position in the hierarchy
    if (index === 0) return 0; // Root node
    if (index <= 5) return 1; // Level 1 nodes
    return 2; // Level 2 nodes
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update text meshes and backgrounds to face the camera
    textObjects.forEach((textMesh, index) => {
        if (textMesh.visible) {
            textMesh.lookAt(camera.position);
            textBackgrounds[index].lookAt(camera.position);
        }
    });
    
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate(); 