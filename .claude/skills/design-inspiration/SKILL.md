---
name: design-inspiration
description: Pull a real-world DESIGN.md design system from the Awesome DESIGN.md catalog (VoltAgent/awesome-design-md) to anchor a page's visual language. Use when the user names a brand aesthetic ("Apple-y", "Linear-style", "like Stripe"), asks for design inspiration, or wants the site to follow a known design language.
---

# Design Inspiration via DESIGN.md

The [Awesome DESIGN.md](https://github.com/VoltAgent/awesome-design-md) catalog holds 70+ analyzed
design systems as plain-markdown `DESIGN.md` files — tokens, type scales, spacing, color rules,
and component patterns extracted from real sites. An agent that reads one can generate UI that
stays consistent with that design language.

## How to use it

1. **Pick the brand** that matches the requested aesthetic. Available brands include:
   apple, airbnb, cal, claude, cursor, figma, framer, linear.app, lovable, mintlify, nike,
   notion, nintendo-2001, pinterest, posthog, raycast, resend, revolut, sanity, shopify, slack,
   spotify, starbucks, stripe, superhuman, tesla, theverge, uber, vercel, warp, webflow, wired, wise
   — plus many more. If unsure, list the catalog:

   ```bash
   curl -sS https://api.github.com/repos/VoltAgent/awesome-design-md/contents/design-md \
     | grep '"name"'
   ```

2. **Fetch the DESIGN.md** for that brand into the scratchpad (not into the repo):

   ```bash
   curl -sSL -o /tmp/DESIGN.md \
     https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/<brand>/DESIGN.md
   ```

3. **Read it fully**, then apply its tokens and rules to the page being built. Treat it as a
   design language reference, not branding to copy: never reuse the brand's name, logo, or
   trademarked assets — only the structural design patterns (spacing, type scale, color logic,
   layout rhythm).

4. If the user commits to one design direction for this portfolio long-term, copy the chosen
   file to `DESIGN.md` at the repo root so every future session picks it up.

## Interplay with the other skills

- Use `design-taste-frontend` first to infer the right direction; use this skill when that
  direction maps to a known brand language.
- After building, run `web-design-guidelines` to audit the result and `playwright-cli` to
  screenshot it.
