#!/bin/bash
# Linux/Mac startup script for Women Safety application

echo ""
echo "========================================="
echo "   Women Safety - Full Stack Startup"
echo "========================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Function to run a command in the background and keep track of PIDs
run_in_background() {
    local name=$1
    local cmd=$2
    echo "[+] Starting $name..."
    eval "$cmd" &
    echo "    PID: $!"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Start Backend
run_in_background "Backend Server" "cd backend && npm start"
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start Frontend
run_in_background "Frontend Dev Server" "cd frontend/Astra && npm run dev"
FRONTEND_PID=$!

# Wait a bit and show status
sleep 2

echo ""
echo "========================================="
echo "   Servers Starting..."
echo "========================================="
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Process IDs:"
echo "  Backend:  $BACKEND_PID"
echo "  Frontend: $FRONTEND_PID"
echo ""
echo "To stop the servers, press Ctrl+C or run:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
