# External Resources Guide

This workspace includes local scaffolding for free external resources that accelerate White Caves delivery without adding premium-tool dependency.

## Data Sources

- `data/dubai-real-estate/rera/` — RERA regulations, forms, license references
- `data/dubai-real-estate/dld/` — DLD transaction references, fee guidance, verification notes
- `data/dubai-real-estate/market-intel/` — market snapshots, area guides, competitor research

## Development References

- `docs/best-practices/react-patterns/`
- `docs/best-practices/typescript-patterns/`
- `docs/best-practices/testing-patterns/`
- `docs/compliance-integration/`

## Commands

- `npm run resources:setup` — create/update the local scaffold
- `npm run resources:download` — fetch lightweight public metadata and source snapshots
- `npm run resources:update` — refresh manifests and timestamps

## Operating Notes

- Prefer official or public, redistributable sources.
- Treat downloaded material as reference input, not legal advice.
- Review source pages periodically for changes before using in production workflows.
