# Mind Graph

An interactive web application that visualizes learning dependencies using Sigma.js and OpenAI. Enter a subject you want to learn about, and the application will generate a graph showing its dependencies and related concepts.

## Features

- Interactive graph visualization using Sigma.js
- OpenAI-powered dependency generation
- Modern React frontend
- Node.js/Express backend

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenAI API key

## Setup

1. Clone the repository
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```
4. Create a `.env` file in the root directory with your OpenAI API key:
   ```
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Running the Application

1. Start the backend server:
   ```bash
   npm run dev
   ```
2. In a new terminal, start the frontend:
   ```bash
   cd client
   npm start
   ```
3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter a subject you want to learn about in the input field
2. Click "Generate Graph" to create the visualization
3. Interact with the graph by:
   - Dragging nodes to rearrange
   - Zooming in/out using the mouse wheel
   - Panning by dragging the background

## Project Structure

- `server.js` - Backend server with OpenAI integration
- `client/` - React frontend application
  - `src/App.js` - Main application component
  - `src/components/` - React components
  - `public/` - Static files

## Technologies Used

- React
- Sigma.js
- Graphology
- Node.js
- Express
- OpenAI API 