#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_DIR="$ROOT_DIR/.run"

is_port_listening() {
  local port="$1"
  ss -ltnH 2>/dev/null | awk -v p=":${port}" '$4 ~ p"$" {found=1} END {exit !found}'
}

show_status() {
  local name="$1"
  local pid_file="$2"
  local port="$3"

  if [[ -f "$pid_file" ]]; then
    local pid
    pid="$(cat "$pid_file" || true)"
    if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
      echo "$name: running (PID $pid)"
    else
      echo "$name: not running (stale pid file)"
    fi
  else
    echo "$name: not running"
  fi

  if is_port_listening "$port"; then
    echo "  port $port: listening"
  else
    echo "  port $port: closed"
  fi
}

show_status "backend" "$RUN_DIR/backend.pid" 4000
show_status "frontend" "$RUN_DIR/frontend.pid" 5173
