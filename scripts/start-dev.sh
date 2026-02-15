#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_DIR="$ROOT_DIR/.run"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
FRONTEND_BIND_HOST="0.0.0.0"
FRONTEND_PUBLIC_HOST="192.168.1.73"
FRONTEND_PORT="5173"
BACKEND_PORT="4000"
DEFAULT_FRONTEND_ORIGIN="http://127.0.0.1:${FRONTEND_PORT},http://localhost:${FRONTEND_PORT},http://${FRONTEND_PUBLIC_HOST}:${FRONTEND_PORT}"

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

  if is_port_listening "$BACKEND_PORT"; then
    echo "Port ${BACKEND_PORT} is already in use. Skipping backend start."
    return
  fi

  (
    cd "$BACKEND_DIR"
    FRONTEND_ORIGIN="${FRONTEND_ORIGIN:-$DEFAULT_FRONTEND_ORIGIN}" nohup npm run dev >"$BACKEND_LOG" 2>&1 &
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

  if is_port_listening "$FRONTEND_PORT"; then
    echo "Port ${FRONTEND_PORT} is already in use. Skipping frontend start."
    return
  fi

  (
    cd "$FRONTEND_DIR"
    nohup npm run dev -- --host "$FRONTEND_BIND_HOST" --port "$FRONTEND_PORT" >"$FRONTEND_LOG" 2>&1 &
    echo $! >"$FRONTEND_PID_FILE"
  )

  echo "Frontend started (PID $(cat "$FRONTEND_PID_FILE"))"
}

start_backend
start_frontend

echo
if is_port_listening "$BACKEND_PORT"; then
  echo "Backend URL:  http://127.0.0.1:${BACKEND_PORT}"
fi
if is_port_listening "$FRONTEND_PORT"; then
  echo "Frontend URL: http://${FRONTEND_PUBLIC_HOST}:${FRONTEND_PORT}"
fi

echo "Logs:"
echo "  $BACKEND_LOG"
echo "  $FRONTEND_LOG"
