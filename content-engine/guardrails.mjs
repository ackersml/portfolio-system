const EM_DASH = /\u2014|\u2013/;
const LINKEDIN_MAX = 2800;
const INSTAGRAM_MAX = 2100;
const FIRST_LINE_MAX = 140;
const INSTAGRAM_HASHTAG_MAX = 5;

export function firstLine(text) {
  return String(text ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n")[0]
    .trim();
}

export function hashtagCount(text) {
  const matches = String(text ?? "").match(/(^|[\s])#[\p{L}\p{N}_]+/gu);
  return matches ? matches.length : 0;
}

export function findEmDash(text) {
  const value = String(text ?? "");
  const index = value.search(EM_DASH);
  if (index === -1) return null;
  const start = Math.max(0, index - 24);
  const end = Math.min(value.length, index + 24);
  return { index, excerpt: value.slice(start, end) };
}

export function checkDraft(draft) {
  const errors = [];
  const fields = [
    ["hook", draft.hook],
    ["graphicLine", draft.graphicLine],
    ["linkedin", draft.linkedin],
  ];

  if (draft.platforms?.includes("instagram")) {
    fields.push(["instagram", draft.instagram]);
  } else if (draft.instagram) {
    errors.push(
      `${draft.id}: principle posts are LinkedIn only; Instagram copy must be empty`
    );
  }

  for (const [name, value] of fields) {
    const hit = findEmDash(value);
    if (hit) {
      errors.push(
        `${draft.id} ${name}: em dash at ${hit.index} near "${hit.excerpt}"`
      );
    }
  }

  const linkedin = String(draft.linkedin ?? "");
  if (linkedin.length > LINKEDIN_MAX) {
    errors.push(
      `${draft.id}: LinkedIn is ${linkedin.length} characters (max ${LINKEDIN_MAX})`
    );
  }

  const opening = firstLine(linkedin);
  if (opening.length > FIRST_LINE_MAX) {
    errors.push(
      `${draft.id}: first line is ${opening.length} characters (max ${FIRST_LINE_MAX}): "${opening}"`
    );
  }

  if (draft.platforms?.includes("instagram")) {
    const instagram = String(draft.instagram ?? "");
    if (!instagram.trim()) {
      errors.push(`${draft.id}: Instagram copy is missing`);
    }
    if (instagram.length > INSTAGRAM_MAX) {
      errors.push(
        `${draft.id}: Instagram is ${instagram.length} characters (max ${INSTAGRAM_MAX})`
      );
    }
    const tags = hashtagCount(instagram);
    if (tags > INSTAGRAM_HASHTAG_MAX) {
      errors.push(
        `${draft.id}: Instagram has ${tags} hashtags (max ${INSTAGRAM_HASHTAG_MAX})`
      );
    }
    const igOpening = firstLine(instagram);
    if (igOpening.length > FIRST_LINE_MAX) {
      errors.push(
        `${draft.id}: Instagram first line is ${igOpening.length} characters (max ${FIRST_LINE_MAX})`
      );
    }
  }

  if (draft.track === "principle" && draft.platforms?.includes("instagram")) {
    errors.push(`${draft.id}: principle posts must not go to Instagram`);
  }

  return errors;
}

export function assertDrafts(drafts) {
  const errors = drafts.flatMap(checkDraft);
  const hookErrors = checkHookRuns(drafts);
  const all = [...errors, ...hookErrors];
  if (all.length === 0) return;

  const banner = [
    "============================================================",
    "CONTENT ENGINE GUARDRAIL FAILURE",
    "============================================================",
    ...all.map((line) => `  - ${line}`),
    "============================================================",
  ].join("\n");
  console.error(banner);
  throw new Error(`Guardrail failure (${all.length})`);
}

export function checkHookRuns(drafts) {
  const errors = [];
  let runType = null;
  let run = 0;
  for (const draft of drafts) {
    if (draft.hookType === runType) {
      run += 1;
    } else {
      runType = draft.hookType;
      run = 1;
    }
    if (run > 2) {
      errors.push(
        `More than two consecutive posts of hook type "${runType}" (see ${draft.id})`
      );
    }
  }
  return errors;
}
