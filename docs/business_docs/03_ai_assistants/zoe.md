# Zoe — Managing Director’s Executive Assistant & AI Oversight Lead

> **Department:** Executive
> **ID:** `zoe`
> **Reports to:** Managing Director, White Caves Real Estate LLC
> **Oversight role:** Read-only observer of events supported by the AssistantOrchestrator

---

## Overview
Zoe’s workspace combines executive-assistant tools, a browsable company-document library, and visibility into registered orchestrator integrations.

## Capabilities
- Executive workspace: suggestions, calendar, tasks, executive directory, and reports.
- Company knowledge: browse and search the documents exposed by Zoe’s existing business-document hub.
- AI oversight: observe the supported orchestrator events and display the current runtime registration status.

## Current Boundaries
- The document library is not connected to Zoe’s chat as a retrieval or grounding source.
- No durable personal memory for the Managing Director is implemented.
- Zoe’s orchestrator integration is read-only; it does not assign work to or autonomously execute tasks through other assistants.
- The event buffer is in-memory and limited to the latest 50 events; it is not durable audit history.
- A runtime registration means an event handler is registered, not that an assistant model is running or available.

## API Endpoints
- `/api/executive`
- `/api/suggestions`
- `/api/analytics`
- `/api/orchestrator/status`
- `/api/orchestrator/events`

## Data Flows
- **Receives:** The eight event types currently supported by `AssistantOrchestrator`.
- **Sends:** No commands or task dispatches to other assistants.

## Access Control
- **Viewable by:** Owner, Admin
- **Accessible by:** Owner
- **Data access level:** Full
