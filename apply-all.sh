#!/usr/bin/env bash
set -e
D="$(cd "$(dirname "$0")" && pwd)"
for p in part-1-foundation part-2-engine part-3-folder part-4-pages part-5-routes; do bash "$D/$p.sh"; done
echo "All parts applied. Next: npm run build"
