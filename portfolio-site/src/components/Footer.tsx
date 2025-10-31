export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/60">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          © {new Date().getFullYear()} Michelle Ackers. All rights reserved.
        </p>
        <a
          href="mailto:ackers.ml@gmail.com"
          className="text-zinc-300 hover:text-white transition-colors"
        >
          ackers.ml@gmail.com
        </a>
      </div>
    </footer>
  );
}


