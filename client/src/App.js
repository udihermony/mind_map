import React, { useState } from 'react';
import { SigmaContainer } from '@react-sigma/core';
import { LayoutForceControl } from '@react-sigma/layout-force';
import Graph from 'graphology';
import './App.css';

function App() {
  const [subject, setSubject] = useState('');
  const [graph, setGraph] = useState(new Graph());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Sending request to server...');
      const response = await fetch('http://localhost:5002/api/generate-graph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate graph');
      }
      
      // Create new graph
      const newGraph = new Graph();
      
      // Add nodes
      data.nodes.forEach(node => {
        newGraph.addNode(node.id, {
          label: node.label,
          size: 15,
          color: '#666',
        });
      });

      // Add edges
      data.edges.forEach(edge => {
        newGraph.addEdge(edge.source, edge.target, {
          size: 2,
          color: '#999',
        });
      });

      console.log('Graph created with nodes:', newGraph.order, 'and edges:', newGraph.size);
      setGraph(newGraph);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mind Graph</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter a subject to learn about"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Graph'}
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </header>
      <main>
        <SigmaContainer
          graph={graph}
          style={{ height: '80vh', width: '100%' }}
        >
          <LayoutForceControl autoRunFor={2000} />
        </SigmaContainer>
      </main>
    </div>
  );
}

export default App; 