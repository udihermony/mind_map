// Graph data for the "Robots" subject visualization
const graphData = {
    nodes: [
        // Level 0: Central Topic (Top level)
        { position: new THREE.Vector3(0, 0, 4), name: "Robots" }, // Index 0

        // Level 1: Main Sub-Subjects (Middle level)
        { position: new THREE.Vector3(4, 0, 2), name: "Mechanical Engineering" },  // Index 1
        { position: new THREE.Vector3(0, 4, 2), name: "Electrical Engineering" },  // Index 2
        { position: new THREE.Vector3(-4, 0, 2), name: "Computer Science" },     // Index 3
        { position: new THREE.Vector3(0, -4, 2), name: "AI & Machine Learning" }, // Index 4
        { position: new THREE.Vector3(3, 3, 2), name: "Types of Robots" },    // Index 5

        // Level 2: Specific Topics under Mechanical Engineering (Bottom level)
        { position: new THREE.Vector3(6, 1, 0), name: "Kinematics & Dynamics" }, // Index 6
        { position: new THREE.Vector3(6, -1, 0), name: "Actuators & Mechanisms" },// Index 7
        { position: new THREE.Vector3(7, 0, 0), name: "Materials & Design" },    // Index 8

        // Level 2: Specific Topics under Electrical Engineering (Bottom level)
        { position: new THREE.Vector3(1, 6, 0), name: "Sensors & Perception" }, // Index 9
        { position: new THREE.Vector3(-1, 6, 0), name: "Control Systems" },     // Index 10
        { position: new THREE.Vector3(0, 7, 0), name: "Power Systems" },       // Index 11

        // Level 2: Specific Topics under Computer Science (Bottom level)
        { position: new THREE.Vector3(-6, 1, 0), name: "Programming (Python/C++)" },// Index 12
        { position: new THREE.Vector3(-6, -1, 0), name: "Algorithms" },           // Index 13
        { position: new THREE.Vector3(-7, 0, 0), name: "Robot Operating System (ROS)" }, // Index 14

        // Level 2: Specific Topics under AI & Machine Learning (Bottom level)
        { position: new THREE.Vector3(1, -6, 0), name: "Computer Vision" },      // Index 15
        { position: new THREE.Vector3(-1, -6, 0), name: "Path Planning" },       // Index 16
        { position: new THREE.Vector3(0, -7, 0), name: "Reinforcement Learning" },// Index 17

        // Level 2: Specific Topics under Types of Robots (Bottom level)
        { position: new THREE.Vector3(5, 5, 0), name: "Industrial Robots" },  // Index 18
        { position: new THREE.Vector3(4, 5, 0), name: "Mobile Robots (AGVs, Drones)" }, // Index 19
        { position: new THREE.Vector3(5, 4, 0), name: "Humanoid Robots" }    // Index 20
    ],
    edges: [
        // Level 0 (Robots) to Level 1 Connections (High weight)
        { start: 0, end: 1, weight: 0.9 },  // Robots -> Mech Eng
        { start: 0, end: 2, weight: 0.9 },  // Robots -> Elec Eng
        { start: 0, end: 3, weight: 0.9 },  // Robots -> Comp Sci
        { start: 0, end: 4, weight: 0.9 },  // Robots -> AI & ML
        { start: 0, end: 5, weight: 0.8 },  // Robots -> Types of Robots

        // Level 1 to Level 2 Connections (Medium-High weight)
        // Mechanical Engineering Children
        { start: 1, end: 6, weight: 0.7 },  // Mech Eng -> Kinematics
        { start: 1, end: 7, weight: 0.7 },  // Mech Eng -> Actuators
        { start: 1, end: 8, weight: 0.6 },  // Mech Eng -> Materials
        // Electrical Engineering Children
        { start: 2, end: 9, weight: 0.7 },  // Elec Eng -> Sensors
        { start: 2, end: 10, weight: 0.8 }, // Elec Eng -> Control Systems
        { start: 2, end: 11, weight: 0.6 }, // Elec Eng -> Power Systems
        // Computer Science Children
        { start: 3, end: 12, weight: 0.8 }, // Comp Sci -> Programming
        { start: 3, end: 13, weight: 0.7 }, // Comp Sci -> Algorithms
        { start: 3, end: 14, weight: 0.8 }, // Comp Sci -> ROS
        // AI & Machine Learning Children
        { start: 4, end: 15, weight: 0.7 }, // AI & ML -> Computer Vision
        { start: 4, end: 16, weight: 0.7 }, // AI & ML -> Path Planning
        { start: 4, end: 17, weight: 0.6 }, // AI & ML -> Reinforcement Learning
        // Types of Robots Children
        { start: 5, end: 18, weight: 0.7 }, // Types -> Industrial
        { start: 5, end: 19, weight: 0.7 }, // Types -> Mobile
        { start: 5, end: 20, weight: 0.6 }, // Types -> Humanoid

        // Optional: Cross-connections between related sub-topics (Lower weight)
        { start: 6, end: 10, weight: 0.4 }, // Kinematics <-> Control Systems
        { start: 7, end: 10, weight: 0.5 }, // Actuators <-> Control Systems
        { start: 9, end: 15, weight: 0.5 }, // Sensors <-> Computer Vision
        { start: 13, end: 16, weight: 0.5 }, // Algorithms <-> Path Planning
        { start: 12, end: 14, weight: 0.6 }, // Programming <-> ROS
        { start: 15, end: 19, weight: 0.4 }, // Computer Vision <-> Mobile Robots
        { start: 16, end: 19, weight: 0.4 }  // Path Planning <-> Mobile Robots
    ]
}; 