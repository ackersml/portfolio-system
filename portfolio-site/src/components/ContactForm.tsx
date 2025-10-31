"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try {
      setStatus("submitting");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setMessage("Thanks! I'll get back to you shortly.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage("Something went wrong. Please email me directly: ackers.ml@gmail.com");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-zinc-400">Name</label>
          <input name="name" required className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Email</label>
          <input type="email" name="email" required className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700" placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <label className="block text-sm text-zinc-400">Message</label>
        <textarea name="message" rows={5} required className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700" placeholder="Tell me about your project" />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center rounded-md bg-white text-black font-medium px-4 py-2 hover:bg-zinc-200 transition-colors disabled:opacity-60"
        >
          {status === "submitting" ? "Sending..." : "Send"}
        </button>
        <a href="mailto:ackers.ml@gmail.com" className="text-sm text-zinc-400 hover:text-white">or email directly</a>
      </div>
      {message && <p className="text-sm text-zinc-300">{message}</p>}
    </form>
  );
}


