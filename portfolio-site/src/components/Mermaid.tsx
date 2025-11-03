"use client";

import { useEffect, useRef, useState } from "react";

export default function Mermaid({ path, text }: { path?: string; text?: string }) {
  const ref = useRef<HTMLPreElement>(null);
  const [content, setContent] = useState<string | null>(text || null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!content && path) {
        try {
          const res = await fetch(path, { cache: "no-store" });
          if (res.ok) setContent(await res.text());
        } catch {}
      }
    })();
    return () => {
      mounted = false;
    };
  }, [path, content]);

  useEffect(() => {
    if (!content || !ref.current) return;
    try {
      const anyMermaid: any = (window as any).mermaid;
      if (anyMermaid?.run) anyMermaid.run({ nodes: [ref.current] });
      else if (anyMermaid?.init) anyMermaid.init(undefined, ref.current);
    } catch {}
  }, [content]);

  if (!content) return null;
  return <pre ref={ref} className="mermaid">{content}</pre>;
}


