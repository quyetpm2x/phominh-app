---
name: api-sync
description: Use when calling a NestJS backend endpoint from the Expo app, when a field from src/api/generated looks wrong or missing, or after being told the backend API changed shape
---

# API Sync (Mobile)

## Overview

`backend/` is a **separate repo** — this repo cannot see NestJS source code, only its published OpenAPI schema. Types under `src/api/generated/` are machine-generated from that schema via `openapi-typescript`, run **separately from Web** — Mobile does not import Web's generated types, and Web does not import Mobile's (FE tech doc §1: two independent codebases by design).

## When to Use

- Adding a new call in `src/api/endpoints/`.
- A generated type is missing a field you know the backend returns, or has one that no longer matches reality.
- Someone says "backend changed the shape of X."
- `tsc` fails on a field inside `src/api/generated/**` after a backend change.

## The Rule

**Never hand-edit anything under `src/api/generated/`.** If a type is wrong, regenerate it from the backend's current OpenAPI schema — don't patch the generated file.

**Never invent a field or endpoint shape that isn't in the generated types.** A missing field means the backend hasn't published it yet — surface this instead of guessing the shape.

**Don't "borrow" a type from `web + app/web/packages/api-client/src/generated/`.** Even if it looks identical, the two are generated independently and are allowed to drift; importing across the Mobile/Web boundary breaks the deliberate isolation (FE tech doc §1).

## Workflow

1. Get the backend's current OpenAPI schema (confirm the URL/file with whoever owns `backend/` — not discoverable from this repo).
2. Regenerate into `src/api/generated/` with `openapi-typescript` (same tool as Web, run independently, output stays local to this repo).
3. Run `npx tsc --noEmit`. Every call site using a now-removed/renamed field will fail to compile — fix each one; don't suppress with `as any`.
4. Never commit a manual edit to a file under `generated/`.

## Common Mistakes

| Mistake | Why it's wrong |
|---|---|
| Hand-editing a file under `src/api/generated/` | Next regeneration wipes it silently; the type still lies |
| Importing a type from Web's `packages/api-client/src/generated/` | Violates the intentional Mobile/Web separation — the two generated outputs are allowed to diverge |
| Casting a response `as SomeInventedType` instead of regenerating | Defeats the whole point of the `ky` + OpenAPI codegen setup |
