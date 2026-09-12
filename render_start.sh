#!/usr/bin/env bash
echo "Starting Render API..."
if [ -d "backend" ]; then
    echo "Found backend folder, changing directory..."
    cd backend
fi
uvicorn main:app --host 0.0.0.0 --port $PORT
