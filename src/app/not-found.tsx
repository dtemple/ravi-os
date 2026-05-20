import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen p-3 sm:p-6">
      <div
        className="terminal-frame w-full"
        style={{ maxWidth: 960, height: "min(720px, calc(100vh - 24px))" }}
      >
        <div className="terminal-titlebar">
          <span className="terminal-titlebar-label">
            <span className="hidden sm:inline">RAVI-OS :: </span>SECURE TERMINAL
          </span>
          <span className="terminal-titlebar-status">
            <span className="terminal-status-dot" />
            ONLINE
          </span>
        </div>
        <div className="flex flex-col flex-1 min-h-0 bg-black text-green-400 font-mono text-sm p-4 terminal-glow justify-center">
          <div className="max-w-lg">
            <p className="text-xl mb-4">SIGNAL LOST.</p>
            <p className="mb-2">Agent, you&apos;ve wandered off-grid.</p>
            <p className="mb-8">This sector does not exist — or has been classified above your clearance.</p>
            <Link href="/" className="hover:text-green-300 transition-colors">
              &gt; return home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
