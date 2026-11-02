$env:NODE_OPTIONS = "--max-old-space-size=4096"
npx tsc --noEmit 2>&1 | Select-Object -First 30
