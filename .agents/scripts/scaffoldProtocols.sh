#!/usr/bin/env bash
# ==============================================================================
# FILE: .agents/scripts/scaffoldProtocols.sh
# White Caves Real Estate LLC — AEGIS Protocol Matrix Scaffolder (V5.0)
#
# MIGRATION NOTICE (2026-11-14 — TURING-LAW-000 / TURING-DUAL-FORMAT-014):
# CSV scaffold generation has been RETIRED. All 42 protocol rules (AEG-001
# through AEG-042) now live exclusively in canonical TypeScript modules:
#
#   src/config/protocols/turingProtocol.ts          — TURING_SILENT_VELOCITY
#   src/config/protocols/maryAllenWilkesProtocol.ts — PHOENIX / VALKYRIE / APOCALYPSE
#   src/config/protocols/aegisMasterProtocols.ts    — Full AEG-001–AEG-042 registry
#
# Rationale:
#   • TypeScript modules allow surgical 30–50 line reads vs 5,000-line CSV dumps.
#   • `tsc --noEmit` provides zero-token compiler verification at no LLM cost.
#   • Direct import into WhiteCavesBookViewer.tsx and React components is seamless.
#   • Eliminates CSV/TS duplication that violated TURING-LAW-000 credit conservation.
#
# To regenerate or validate protocols, do NOT recreate CSVs. Instead:
#   1. Edit the TypeScript source modules above.
#   2. Run this script — it performs a compiler verification pass only.
# ==============================================================================

set -euo pipefail

PROTOCOL_DIR=".agents/aegis/protocols"
mkdir -p "$PROTOCOL_DIR"

echo "⚡ [AEGIS V5.0] Protocol scaffold is now TypeScript-canonical."
echo "   Canonical modules:"
echo "     → src/config/protocols/turingProtocol.ts"
echo "     → src/config/protocols/maryAllenWilkesProtocol.ts"
echo "     → src/config/protocols/aegisMasterProtocols.ts"
echo ""
echo "   CSV generation has been retired (TURING-DUAL-FORMAT-014)."
echo "   Running TypeScript compiler verification (tsc --noEmit)..."
echo ""

# Verify canonical protocol TypeScript modules compile without errors
npx tsc --noEmit

echo ""
echo "✅ [AEGIS V5.0] TypeScript protocol verification passed."
echo "   All AEG-001–AEG-042 rules are compiler-verified in canonical TS modules."
