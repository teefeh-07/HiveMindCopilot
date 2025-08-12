#!/bin/bash

# HiveMind Copilot Setup Script for Hackathon Evaluation
# This script sets up the Docker environment for evaluating HiveMind Copilot

echo "===== HiveMind Copilot Setup ====="

echo "Starting HiveMind Copilot Docker environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker before proceeding."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose before proceeding."
    exit 1
fi

# Create docs directory if it doesn't exist
if [ ! -d "./docs" ]; then
    echo "Creating docs directory..."
    mkdir -p ./docs
    echo "<html><head><title>HiveMind Copilot Documentation</title></head><body><h1>HiveMind Copilot Documentation</h1><p>Welcome to the HiveMind Copilot documentation. This project integrates decentralized AI agents with Hedera's enterprise blockchain.</p></body></html>" > ./docs/index.html
fi

# Start the Docker Compose environment
echo "Starting Docker Compose services..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to initialize (this may take a few minutes)..."
sleep 30

# Check if backend is healthy
echo "Checking backend health..."
if curl -s http://localhost:8005/health 2>/dev/null | grep -q "status"; then
    echo "✅ Backend is running and healthy"
else
    echo "⚠️ Backend may still be initializing. Check 'docker-compose logs backend' for details."
    echo "   The backend may take several minutes to install all dependencies."
fi

# Check if documentation is available
if curl -s -I http://localhost:8085 2>/dev/null | grep -q "200 OK"; then
    echo "✅ Documentation is available at http://localhost:8085"
else
    echo "⚠️ Documentation service may not be ready yet."
fi

# Check if examples are available
if curl -s -I http://localhost:8086 2>/dev/null | grep -q "200 OK"; then
    echo "✅ Example projects are available at http://localhost:8086"
else
    echo "⚠️ Examples service may not be ready yet."
fi

# Check if VS Code extension was built
if [ -d "./hivemind-clean/dist" ] && [ "$(ls -A ./hivemind-clean/dist 2>/dev/null)" ]; then
    echo "✅ VS Code extension has been built. You can find it in the hivemind-clean/dist directory."
else
    echo "⚠️ VS Code extension build may still be in progress. Check 'docker-compose logs frontend-builder' for details."
    echo "   You may need to wait a few minutes for the build to complete."
fi

echo ""
echo "=== HiveMind Copilot Environment Setup Complete ==="
echo ""
echo "Access the following services:"
echo "  - Backend API: http://localhost:8005"
echo "  - Documentation: http://localhost:8085"
echo "  - Example Projects: http://localhost:8086"
echo ""
echo "To install the VS Code extension:"
echo "  1. Open VS Code"
echo "  2. Go to Extensions view (Ctrl+Shift+X or Cmd+Shift+X)"
echo "  3. Click on the '...' menu in the top-right of the Extensions view"
echo "  4. Select 'Install from VSIX...'"
echo "  5. Navigate to the hivemind-clean/ directory and select the hivemind-copilot-0.3.0.vsix file"
echo ""
echo "To stop the environment: docker-compose down"
echo ""
echo "For more information, visit the documentation at http://localhost:8085"
echo "1. Open VS Code settings (Ctrl+, or Cmd+,)"
echo "2. Search for 'HiveMind'"
echo "3. Set 'HiveMind: Backend URL' to 'http://localhost:8005'"
echo ""
echo "===== Available Services ====="
echo "- Backend API: http://localhost:8005"
echo "- Documentation: http://localhost:8085"
echo "- Example Projects: http://localhost:8086"
echo ""
echo "For any issues, please contact the HiveMind team."
