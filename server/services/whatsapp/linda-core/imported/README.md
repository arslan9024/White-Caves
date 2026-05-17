# Linda Imported Core Slot

This folder is reserved for selective code copied from:

- `https://github.com/arslan9024/whatsapp-bot-linda`

## Purpose

Provide a controlled landing area for imported Linda modules while preserving White-Caves runtime stability through `LindaCoreAdapter`.

## Rules

1. Copy only modules required for the active micro-wave.
2. Keep upstream file names and folder relationships where practical.
3. Do not wire imports directly into routes.
4. Route integration must happen via:
   - `linda-core/bridge/*`
   - `linda-core/adapters/LindaCoreAdapter.ts`

## Initial Import Priority

- Session lifecycle manager
- Message router primitives
- Campaign execution primitives

## Safety

- No `.env` / keys / secrets may be copied.
- Session data directories remain runtime-only and gitignored.
