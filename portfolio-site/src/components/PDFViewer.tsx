"use client";

import { useState } from "react";

export default function PDFViewer({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      {!failed ? (
        <iframe
          src={src}
          title={title}
          className="w-full h-[75vh] bg-zinc-900"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="p-6 text-zinc-300">
          <p>Inline PDF preview failed. You can download it below.</p>
        </div>
      )}
    </div>
  );
}


