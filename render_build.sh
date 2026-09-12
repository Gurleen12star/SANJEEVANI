#!/usr/bin/env bash
echo "Starting Render Build..."
if [ -d "backend" ]; then
    echo "Found backend folder, installing from root..."
    pip install -r backend/requirements.txt
else
    echo "Already in backend folder, installing..."
    pip install -r requirements.txt
fi
echo "Build complete!"
