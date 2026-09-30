# Claude Code Skills — Design Toolkit

Skills auto-loaded by Claude Code when working in this repository. They cover the full
design loop for the portfolio site: infer direction → anchor to a design language →
implement from generated imagery → audit → verify in a real browser.

| Skill | Purpose | Source |
|---|---|---|
| `design-taste-frontend` | Anti-slop frontend direction for landing pages and portfolios; brief inference, design-read before code, pre-flight checks | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) · [tasteskill.dev](https://www.tasteskill.dev/) (MIT) |
| `design-inspiration` | Fetch a brand DESIGN.md from the Awesome DESIGN.md catalog to anchor visual language | wrapper for [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (MIT) |
| `image-to-code` | Generate design imagery first, analyze it, then implement to match | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (MIT) |
| `web-design-guidelines` | Audit UI code against Vercel's Web Interface Guidelines (accessibility, UX, best practices) | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) |
| `playwright-cli` | Drive a real browser from the terminal: screenshots, interaction testing, tracing | [microsoft/playwright-cli](https://github.com/microsoft/playwright-cli) (Apache-2.0) |

## Notes

- Vendored `SKILL.md` files are unmodified copies from their upstream repos; refresh them by
  re-copying from upstream.
- `playwright-cli` requires `npm install -g @playwright/cli@latest` (Node 18+). Alternatively
  run `playwright-cli install --skills` to use upstream's own installer.
- `image-to-code` was authored for image-generation-capable agents; its "Codex" references
  read as generic agent instructions and apply unchanged.

## Typical workflow

1. Describe the page or redesign → `design-taste-frontend` produces a one-line Design Read.
2. Name a reference aesthetic → `design-inspiration` fetches the matching DESIGN.md.
3. Build (optionally image-first via `image-to-code`).
4. `web-design-guidelines` audit on the changed files.
5. `playwright-cli` screenshots at mobile and desktop widths to confirm the result.
