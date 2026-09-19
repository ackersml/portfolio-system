#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { assertDrafts } from "./guardrails.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));

function loadLatest() {
  return JSON.parse(readFileSync(path.join(ROOT, "latest.json"), "utf8"));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function cardHtml(draft) {
  const trackLabel = draft.track === "principle" ? "Principle" : "For owners";
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 1080px;
      height: 1080px;
      background: #111318;
    }
    .card {
      box-sizing: border-box;
      width: 1080px;
      height: 1080px;
      padding: 88px 92px 80px;
      background:
        radial-gradient(1200px 520px at 8% -10%, rgba(90,169,230,0.16), transparent 58%),
        #0b0c10;
      color: #e9eef3;
      display: flex;
      flex-direction: column;
      font-family: "Liberation Sans", "Noto Sans", "DejaVu Sans", Arial, sans-serif;
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      letter-spacing: 0.14em;
      word-spacing: 0.12em;
      text-transform: uppercase;
      font-size: 18px;
      color: #a7b0ba;
    }
    .eyebrow {
      color: #5aa9e6;
      font-weight: 700;
    }
    .rule {
      margin: 36px 0 48px;
      height: 1px;
      background: rgba(233,238,243,0.14);
    }
    h1 {
      font-family: "Liberation Serif", "Noto Serif", "DejaVu Serif", "Times New Roman", serif;
      font-weight: 600;
      font-size: 68px;
      line-height: 1.12;
      letter-spacing: 0;
      word-spacing: 0.08em;
      margin: 0 0 36px;
      max-width: 16ch;
    }
    .sub {
      font-size: 28px;
      line-height: 1.5;
      letter-spacing: 0;
      word-spacing: 0.06em;
      color: #c5ced6;
      max-width: 24ch;
      margin: 0;
    }
    .spacer { flex: 1; }
    .foot {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1px solid rgba(233,238,243,0.12);
      padding-top: 28px;
    }
    .brand {
      font-weight: 700;
      font-size: 26px;
      letter-spacing: 0.02em;
    }
    .meta {
      text-align: right;
      color: #a7b0ba;
      font-size: 18px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <article class="card">
    <div class="top">
      <div class="eyebrow">${escapeHtml(draft.eyebrow)}</div>
      <div>${escapeHtml(trackLabel)}</div>
    </div>
    <div class="rule"></div>
    <h1>${escapeHtml(draft.hook)}</h1>
    <p class="sub">${escapeHtml(draft.graphicLine)}</p>
    <div class="spacer"></div>
    <div class="foot">
      <div class="brand">Cornerstone Devs</div>
      <div class="meta">Michelle</div>
    </div>
  </article>
</body>
</html>`;
}

async function main() {
  const latest = loadLatest();
  if (!latest.drafts?.length) {
    throw new Error("latest.json has no drafts. Run node engine.mjs first.");
  }
  assertDrafts(latest.drafts);

  const queueDir = path.join(ROOT, "queue", latest.date);
  mkdirSync(queueDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1080 },
    deviceScaleFactor: 1,
  });

  try {
    for (const draft of latest.drafts) {
      const html = cardHtml(draft);
      await page.setContent(html, { waitUntil: "load" });
      const dest = path.join(ROOT, draft.image);
      mkdirSync(path.dirname(dest), { recursive: true });
      await page.screenshot({
        path: dest,
        type: "png",
        clip: { x: 0, y: 0, width: 1080, height: 1080 },
      });
      const box = await page.locator(".card").boundingBox();
      if (!box || box.width !== 1080 || box.height !== 1080) {
        throw new Error(
          `Graphic for ${draft.id} is ${box?.width}x${box?.height}, expected 1080x1080`
        );
      }
      console.log(`rendered ${draft.image}`);
    }
  } finally {
    await browser.close();
  }

  writeFileSync(
    path.join(queueDir, "render-log.txt"),
    latest.drafts.map((draft) => draft.image).join("\n") + "\n"
  );
  console.log(`Rendered ${latest.drafts.length} square graphics for ${latest.date}.`);
}

try {
  await main();
} catch (error) {
  console.error("RENDER FAILED");
  console.error(error.message || error);
  process.exit(1);
}
