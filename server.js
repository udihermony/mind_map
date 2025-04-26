const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Endpoint to generate learning dependencies
app.post('/api/generate-graph', async (req, res) => {
  console.log('\n=== New Graph Generation Request ===');
  console.log('Subject:', req.body.subject);
  
  try {
    const { subject } = req.body;
    
    if (!subject) {
      console.log('Error: No subject provided');
      return res.status(400).json({ error: 'Subject is required' });
    }

    console.log('Calling OpenAI API...');
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that creates learning dependency graphs. For a given subject, list its main dependencies and concepts in a structured way. Format the response as a JSON object with nodes and edges. Each node should have an 'id' and 'label' field. Each edge should have 'source' and 'target' fields. Example format: {\"nodes\": [{\"id\": \"1\", \"label\": \"Concept 1\"}, {\"id\": \"2\", \"label\": \"Concept 2\"}], \"edges\": [{\"source\": \"1\", \"target\": \"2\"}]}"
          },
          {
            role: "user",
            content: `Create a learning dependency graph for ${subject}. Include main concepts and their relationships.`
          }
        ],
        response_format: { type: "json_object" }
      });
      console.log('OpenAI API call completed successfully');
      console.log('Completion object:', JSON.stringify(completion, null, 2));
    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError);
      throw openaiError;
    }

    const response = completion.choices[0].message.content;
    console.log('Raw OpenAI response:', response);
    
    let graphData;

    try {
      graphData = JSON.parse(response);
      console.log('Successfully parsed JSON response');
      
      // Validate the response format
      if (!graphData.nodes || !graphData.edges) {
        console.log('Error: Invalid response format - missing nodes or edges');
        throw new Error('Invalid response format from OpenAI');
      }

      console.log(`Found ${graphData.nodes.length} nodes and ${graphData.edges.length} edges`);

      // Ensure all nodes have required fields
      graphData.nodes = graphData.nodes.map((node, index) => ({
        id: node.id || `node_${index}`,
        label: node.label || `Concept ${index + 1}`
      }));

      // Ensure all edges have required fields
      graphData.edges = graphData.edges.map((edge, index) => ({
        source: edge.source || graphData.nodes[0].id,
        target: edge.target || graphData.nodes[1]?.id || graphData.nodes[0].id
      }));

      console.log('Final graph data:', JSON.stringify(graphData, null, 2));

    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return res.status(500).json({ 
        error: 'Failed to parse OpenAI response',
        details: parseError.message
      });
    }

    console.log('Sending response to client');
    res.json(graphData);
    console.log('=== Request Completed Successfully ===\n');
  } catch (error) {
    console.error('Error:', error);
    console.log('=== Request Failed ===\n');
    res.status(500).json({ 
      error: 'Failed to generate graph',
      details: error.message
    });
  }
});

// Function to start the server with port fallback
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Ready to accept requests...\n');
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying port ${port + 1}`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(port); 