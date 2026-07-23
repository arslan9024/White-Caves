# ENGINE_CONTINUITY_LAW

1. **Mandatory Waking Check:** Every time AEGIS awakens, restarts, or initiates a loop, it must first read the `strategies/` directory and align its actions with the rules defined therein before processing any user prompts.
2. **Roadmap Discipline:** Tasks must be pulled sequentially from `plans/PENDING_TASKS_ONLY.md` and execution results recorded in `DAILY_MILESTONE_TRACKER.md`. No feature invention or deviation from the established roadmap is permitted.
