#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_DIR="$ROOT_DIR/.run"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

BACKEND_PID_FILE="$RUN_DIR/backend.pid"
FRONTEND_PID_FILE="$RUN_DIR/frontend.pid"
BACKEND_LOG="$RUN_DIR/backend.log"
FRONTEND_LOG="$RUN_DIR/frontend.log"

mkdir -p "$RUN_DIR"

is_pid_running() {
  local pid="$1"
  [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null
}

is_port_listening() {
  local port="$1"
  ss -ltnH 2>/dev/null | awk -v p=":${port}" '$4 ~ p"$" {found=1} END {exit !found}'
}

start_backend() {
  if [[ -f "$BACKEND_PID_FILE" ]]; then
    local pid
    pid="$(cat "$BACKEND_PID_FILE" || true)"
    if is_pid_running "$pid"; then
      echo "Backend already running (PID $pid)"
      return
    fi
    rm -f "$BACKEND_PID_FILE"
  fi

  if is_port_listening 4000; then
    echo "Port 4000 is already in use. Skipping backend start."
    return
  fi

  (
    cd "$BACKEND_DIR"
    nohup npm run dev >"$BACKEND_LOG" 2>&1 &
    echo $! >"$BACKEND_PID_FILE"
  )

  echo "Backend started (PID $(cat "$BACKEND_PID_FILE"))"
}

start_frontend() {
  if [[ -f "$FRONTEND_PID_FILE" ]]; then
    local pid
    pid="$(cat "$FRONTEND_PID_FILE" || true)"
    if is_pid_running "$pid"; then
      echo "Frontend already running (PID $pid)"
      return
    fi
    rm -f "$FRONTEND_PID_FILE"
  fi

  if is_port_listening 5173; then
    echo "Port 5173 is already in use. Skipping frontend start."
    return
  fi

  (
    cd "$FRONTEND_DIR"
    nohup npm run dev -- --host 127.0.0.1 --port 5173 >"$FRONTEND_LOG" 2>&1 &
    echo $! >"$FRONTEND_PID_FILE"
  )

  echo "Frontend started (PID $(cat "$FRONTEND_PID_FILE"))"
}

start_backend
start_frontend

echo
if is_port_listening 4000; then
  echo "Backend URL:  http://127.0.0.1:4000"
fi
if is_port_listening 5173; then
  echo "Frontend URL: http://127.0.0.1:5173"
fi

echo "Logs:"
echo "  $BACKEND_LOG"
echo "  $FRONTEND_LOG"
