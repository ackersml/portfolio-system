#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertDrafts } from "./guardrails.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SALES_PER_BATCH = 3;
const PRINCIPLES_PER_BATCH = 1;

function loadJson(file, fallback) {
  try {
    return JSON.parse(readFileSync(path.join(ROOT, file), "utf8"));
  } catch (error) {
    if (error && error.code === "ENOENT" && fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
}

function saveJson(file, value) {
  writeFileSync(path.join(ROOT, file), `${JSON.stringify(value, null, 2)}\n`);
}

function todayStamp() {
  if (process.env.CONTENT_DATE) return process.env.CONTENT_DATE;
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const year = parts.find((part) => part.type === "year").value;
  const month = parts.find((part) => part.type === "month").value;
  const day = parts.find((part) => part.type === "day").value;
  return `${year}-${month}-${day}`;
}

function lruSort(seeds, usedMap) {
  return seeds.slice().sort((a, b) => {
    const usedA = usedMap[a.id];
    const usedB = usedMap[b.id];
    if (!usedA && !usedB) return a.id.localeCompare(b.id);
    if (!usedA) return -1;
    if (!usedB) return 1;
    if (usedA.lastUsed !== usedB.lastUsed) {
      return usedA.lastUsed.localeCompare(usedB.lastUsed);
    }
    return (usedA.count || 0) - (usedB.count || 0) || a.id.localeCompare(b.id);
  });
}

function markUsed(usedMap, id, date) {
  const prev = usedMap[id] || { count: 0 };
  usedMap[id] = {
    lastUsed: date,
    count: prev.count + 1,
  };
}

function projectLine(facts, projectId) {
  if (!projectId) return null;
  const project = facts.projects.find((item) => item.id === projectId);
  if (!project) {
    throw new Error(`Unknown projectId "${projectId}"`);
  }
  return project.line;
}

function pickCta(seed, pooled, usedCtas, date) {
  if (seed.cta) {
    return { id: `seed:${seed.id}`, text: seed.cta, pooled: false };
  }
  const ranked = lruSort(pooled, usedCtas);
  const chosen = ranked[0];
  markUsed(usedCtas, chosen.id, date);
  return { id: chosen.id, text: chosen.text, pooled: true };
}

function composePost(seed, facts, cta, hashtags, track) {
  const line = projectLine(facts, seed.projectId);
  const linkedin = `${seed.hook}\n\n${seed.body}\n\n${cta.text}`;
  const platforms = track === "principle" ? ["linkedin"] : ["linkedin", "instagram"];
  const instagram =
    track === "principle"
      ? ""
      : `${seed.hook}\n\n${seed.body}\n\n${cta.text}\n\n${hashtags.join(" ")}`;

  return {
    id: seed.id,
    track,
    hookType: seed.hookType,
    platforms,
    eyebrow: seed.eyebrow,
    hook: seed.hook,
    graphicLine: seed.graphicLine,
    projectId: seed.projectId || null,
    projectLine: line,
    ctaId: cta.id,
    ctaPooled: cta.pooled,
    linkedin,
    instagram,
  };
}

function canPlace(sequence, next) {
  if (sequence.length < 2) return true;
  const a = sequence[sequence.length - 1].hookType;
  const b = sequence[sequence.length - 2].hookType;
  return !(a === b && a === next.hookType);
}

function arrange(posts) {
  const n = posts.length;
  const used = new Array(n).fill(false);
  const path = [];

  function walk() {
    if (path.length === n) return true;
    for (let i = 0; i < n; i += 1) {
      if (used[i]) continue;
      if (!canPlace(path, posts[i])) continue;
      used[i] = true;
      path.push(posts[i]);
      if (walk()) return true;
      path.pop();
      used[i] = false;
    }
    return false;
  }

  if (!walk()) {
    throw new Error(
      "Could not arrange today's posts without more than two consecutive hook types"
    );
  }
  return path;
}

function pickSales(salesSeeds, usedSales, facts, count) {
  const ranked = lruSort(salesSeeds, usedSales);
  const chosen = [];
  for (const seed of ranked) {
    if (chosen.length >= count) break;
    if (!projectLineAllowed(facts, seed)) continue;
    chosen.push(seed);
  }
  if (chosen.length < count) {
    throw new Error(`Need ${count} sales seeds, found ${chosen.length}`);
  }
  return chosen;
}

function projectLineAllowed(facts, seed) {
  if (!seed.projectId) return true;
  return Boolean(facts.projects.find((item) => item.id === seed.projectId));
}

function pickPrinciple(principleSeeds, usedPrinciples, salesChosen) {
  const ranked = lruSort(principleSeeds, usedPrinciples);
  const salesHooks = salesChosen.map((seed) => seed.hookType);
  for (const seed of ranked) {
    const hooks = [...salesHooks, seed.hookType];
    if (hooks.every((type) => type === hooks[0])) continue;
    return seed;
  }
  throw new Error("No principle seed could be paired without four identical hook types");
}

function printReview(queue) {
  console.log(`\n===== ${queue.date} REVIEW QUEUE (${queue.drafts.length} drafts) =====\n`);
  for (const [index, draft] of queue.drafts.entries()) {
    const n = String(index + 1).padStart(2, "0");
    console.log(`----- ${n} ${draft.id} | ${draft.track} | hook:${draft.hookType} | ${draft.platforms.join(",")} -----`);
    console.log("\nLINKEDIN\n");
    console.log(draft.linkedin);
    if (draft.platforms.includes("instagram")) {
      console.log("\nINSTAGRAM\n");
      console.log(draft.instagram);
    } else {
      console.log("\nINSTAGRAM\n(none: principle posts are LinkedIn only)");
    }
    console.log("\n");
  }
}

function writeText(file, text) {
  writeFileSync(file, `${text}\n`);
}

function main() {
  const date = todayStamp();
  const facts = loadJson("facts.json");
  const salesSeeds = loadJson("seeds/sales.json");
  const principleSeeds = loadJson("seeds/principles.json");
  const ctas = loadJson("ctas.json");
  const usedPrinciples = loadJson("used.json", {});
  const usedSales = loadJson("used-sales.json", {});
  const usedCtas = usedPrinciples.__ctas || {};

  const salesChosen = pickSales(salesSeeds, usedSales, facts, SALES_PER_BATCH);
  const principleChosen = pickPrinciple(principleSeeds, usedPrinciples, salesChosen);

  const composed = [
    ...salesChosen.map((seed) =>
      composePost(
        seed,
        facts,
        pickCta(seed, ctas.pooled, usedCtas, date),
        ctas.instagramHashtags,
        "sales"
      )
    ),
    composePost(
      principleChosen,
      facts,
      pickCta(principleChosen, ctas.pooled, usedCtas, date),
      ctas.instagramHashtags,
      "principle"
    ),
  ];

  const ordered = arrange(composed).map((draft, index) => {
    const n = String(index + 1).padStart(2, "0");
    const stem = `${n}-${draft.id}`;
    return {
      ...draft,
      order: index + 1,
      stem,
      image: `queue/${date}/${stem}.png`,
    };
  });

  assertDrafts(ordered);

  for (const seed of salesChosen) markUsed(usedSales, seed.id, date);
  markUsed(usedPrinciples, principleChosen.id, date);
  usedPrinciples.__ctas = usedCtas;

  const queueDir = path.join(ROOT, "queue", date);
  mkdirSync(queueDir, { recursive: true });

  const latest = {
    date,
    generatedAt: new Date().toISOString(),
    mix: {
      sales: SALES_PER_BATCH,
      principle: PRINCIPLES_PER_BATCH,
      note: "Sales are the majority track. About one principle post per three.",
    },
    drafts: ordered,
  };

  saveJson("latest.json", latest);
  saveJson("used.json", usedPrinciples);
  saveJson("used-sales.json", usedSales);
  saveJson(`queue/${date}/drafts.json`, latest);

  for (const draft of ordered) {
    const base = path.join(queueDir, draft.stem);
    writeText(`${base}-linkedin.txt`, draft.linkedin);
    if (draft.platforms.includes("instagram")) {
      writeText(`${base}-instagram.txt`, draft.instagram);
    } else {
      writeText(`${base}-instagram.txt`, "PRINCIPLE POST: LinkedIn only. Do not send to Instagram.");
    }
    writeText(
      `${base}-meta.txt`,
      [
        `id: ${draft.id}`,
        `track: ${draft.track}`,
        `hookType: ${draft.hookType}`,
        `platforms: ${draft.platforms.join(", ")}`,
        `eyebrow: ${draft.eyebrow}`,
        `image: ${draft.image}`,
        draft.projectLine ? `projectLine: ${draft.projectLine}` : null,
      ]
        .filter(Boolean)
        .join("\n")
    );
  }

  printReview(latest);
  console.log(`Wrote ${ordered.length} drafts to content-engine/queue/${date}/`);
  console.log("Next: node render.mjs");
}

try {
  main();
} catch (error) {
  console.error(error.message || error);
  process.exit(1);
}
