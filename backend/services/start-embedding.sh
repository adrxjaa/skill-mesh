#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/.venv"

if [ ! -d "$VENV_DIR" ]; then
  echo "Missing venv at $VENV_DIR"
  echo "Run: cd backend/services && python -m venv .venv && source .venv/bin/activate && pip install -r embedding_requirements.txt"
  exit 1
fi

source "$VENV_DIR/bin/activate"
exec uvicorn embedding_server:app --host 127.0.0.1 --port 8001
