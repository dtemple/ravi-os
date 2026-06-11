"use client";

import { useState } from "react";
import Terminal from "@/components/Terminal";
import Graduation from "@/components/Graduation";

// Owns the one-time graduation breakout: when the terminal's failure sequence
// finishes, the frame dies like a CRT powering off, then the graduation
// experience takes over the whole page.
const BREAKOUT_MS = 2300; // keep in sync with `terminal-breakout` in globals.css

export default function RaviShell() {
  const [phase, setPhase] = useState<"terminal" | "breakout" | "graduation">("terminal");

  function handleBreakout() {
    setPhase("breakout");
    setTimeout(() => setPhase("graduation"), BREAKOUT_MS);
  }

  if (phase === "graduation") {
    return <Graduation />;
  }

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-3 sm:p-6">
      <div
        className={`terminal-frame w-full${phase === "breakout" ? " terminal-breakout" : ""}`}
        style={{ maxWidth: 960 }}
      >
        {/* Title bar */}
        <div className="terminal-titlebar">
          <span className="terminal-titlebar-label">
            <span className="hidden sm:inline">RAVI-OS :: </span>SECURE TERMINAL
          </span>
          <span className="terminal-titlebar-status">
            <span
              className={`terminal-status-dot${phase === "breakout" ? " terminal-status-dot-lost" : ""}`}
            />
            {phase === "breakout" ? "SIGNAL LOST" : "ONLINE"}
          </span>
        </div>

        {/* Terminal body — fills remaining frame height */}
        <Terminal onBreakout={handleBreakout} />
      </div>
      {phase === "terminal" && (
        <p className="hidden sm:block mt-3 font-mono text-green-400 text-xs text-center" style={{ opacity: 0.5 }}>
          type `help` for available commands
        </p>
      )}
    </div>
  );
}
