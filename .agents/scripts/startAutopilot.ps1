# startAutopilot.ps1
# -------------------------------------------------
# One‑shot AEGIS autopilot
# 1️⃣ Load and log plan files (zero‑token script)
# 2️⃣ Process the plans (strong orchestration logic)
# -------------------------------------------------

# Load & log (uses built‑in Node, no ts-node)
node C:/Users/Dell/Documents/White-Caves/.agents/scripts/runLogPlansSimple.cjs

# Process plans (uses ts-node to run the TS orchestrator method)
npx ts-node C:/Users/Dell/Documents/White-Caves/.agents/scripts/runProcessPlans.ts
