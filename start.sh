#!/bin/bash

# Kill any existing processes on these ports
fuser -k 8000/tcp 2>/dev/null
fuser -k 3000/tcp 2>/dev/null

echo "🫀 Starting CardioVision AI Stack..."

# Start Backend
echo "Starting FastAPI Backend on port 8000..."
source venv/bin/activate
uvicorn backend:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Start Frontend
echo "Starting Next.js Frontend on port 3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ CardioVision AI is running!"
echo "➡️  Frontend: http://localhost:3000"
echo "➡️  Backend API: http://localhost:8000/docs"
echo "Press Ctrl+C to stop all services."

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
