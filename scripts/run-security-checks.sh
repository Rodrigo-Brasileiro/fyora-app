#!/usr/bin/env bash
set -e

mkdir -p reports/semgrep

echo "[1/2] Running Semgrep (docker)..."
docker run --rm -v "$(pwd):/src" returntocorp/semgrep semgrep --config /src/.semgrep/rules /src --json > reports/semgrep/semgrep.json || true

echo "Reports saved at reports/semgrep/semgrep.json"
