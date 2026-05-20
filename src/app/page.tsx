import Terminal from "@/components/Terminal";

export default function Home() {
  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen p-3 sm:p-6">
      <div
        className="terminal-frame w-full"
        style={{ maxWidth: 960, height: "min(720px, calc(100vh - 24px))" }}
      >
        {/* Title bar */}
        <div className="terminal-titlebar">
          <span className="terminal-titlebar-label">
            <span className="hidden sm:inline">RAVI-OS :: </span>SECURE TERMINAL
          </span>
          <span className="terminal-titlebar-status">
            <span className="terminal-status-dot" />
            ONLINE
          </span>
        </div>

        {/* Terminal body — fills remaining frame height */}
        <Terminal />
      </div>
    </div>
  );
}
