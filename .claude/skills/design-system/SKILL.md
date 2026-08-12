---
name: design-system
description: Use when writing or editing any styled screen or component under app/ or src/components, before choosing a color, spacing, or font value
---

# Design System (Mobile)

## Overview

All brand colors live in `src/constants/design-tokens.ts`, wired into NativeWind via `tailwind.config.js`. This file is a **hand-copied, not shared** duplicate of `web + app/web/packages/design-tokens/src/colors.ts` — a documented tradeoff (FE tech doc §1), not a bug. **Never write a raw hex code directly in a component's `style={{}}` or `className="text-[#...]"`.**

## The Rule

If a color you need isn't already in `src/constants/design-tokens.ts`, that is a signal to add it there first — not to inline a value that "looks close enough" or "is just this once."

**No exceptions:**
- Not for a one-off badge or status dot color.
- Not for "the design mockup shows a slightly different shade."
- Not for a quick prototype screen — prototypes become production code.

## Correct Pattern

```tsx
// ❌ Wrong — invented hex value, bypasses the token system
<View style={{ backgroundColor: '#2D71E0' }} />

// ✅ Right — NativeWind class mapped to the token
<View className="bg-primary" />

// ✅ Right — new token needed? Add it to design-tokens first
// src/constants/design-tokens.ts
export const colors = { ..., warning: { DEFAULT: '#E0A62D' } }
// tailwind.config.js already spreads `colors` into theme.extend.colors — use className="bg-warning"
```

**One legitimate exception:** dynamic per-item colors that can't be a static Tailwind class (e.g. `FreshnessBorder.tsx` picking a border color from a runtime freshness level). There, referencing a token's raw value inside a `style={}` array is correct — the value still traces back to `src/constants/design-tokens.ts`, it's just applied dynamically instead of via className.

## Rationalization Table

| Excuse | Reality |
|---|---|
| "It's just one badge, not worth a new token" | Every hardcoded hex silently drifts from the palette on the next rebrand — tokens exist so that's a one-file edit |
| "This shade is basically the same as an existing token" | If it's basically the same, use the existing token |
| "The Figma/design file shows this exact hex" | Translate it into a token addition, not an inline value |

## Red Flags — Stop and Use a Token Instead

- Writing `style={{ color: '#...' }}` / `backgroundColor: '#...'` with a literal hex anywhere under `app/` or `src/components/`.
- Writing a raw `px` value for spacing instead of an existing Tailwind/NativeWind scale class.
- Writing a font-family string instead of relying on the token-driven default.

## Web Has Its Own Copy

`web + app/web/packages/design-tokens/` is the source of truth for the Web side and is **not imported here** (Mobile is a fully independent project — FE tech doc §1). If brand colors change, update **both** `src/constants/design-tokens.ts` here and the Web package — there is no automatic sync.
