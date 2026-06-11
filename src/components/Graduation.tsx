"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

// ═══════════════════════════════════════════════════════════════════════════
// EDIT THESE ACCOMPLISHMENTS
// ═══════════════════════════════════════════════════════════════════════════
const ACCOMPLISHMENTS: { label: string; status: string; lines: string[] }[] = [
  {
    label: "FIRST DEPLOYED WEBSITE",
    status: "COMPLETE",
    lines: [
      "llamaparade.com is live.",
      "A real website for Llama Parade where people can discover the band and book them.",
    ],
  },
  {
    label: "INTERACTIVE APP",
    status: "COMPLETE",
    lines: [
      "dormfunds.com is live.",
      "A real tool that helps students track shared expenses.",
    ],
  },
  { label: "PRODUCT BUILDER STATUS", status: "UNLOCKED", lines: [] },
  { label: "INTERNET WIZARD LEVEL", status: "ACHIEVED", lines: [] },
];

// EDIT THESE SKILLS
const SKILLS = [
  "Building real websites",
  "Deploying to the internet",
  "Designing for real people",
  "Turning ideas into apps",
  "Making useful tools",
  "Making weird internet things",
  "Learning new tools fast",
];

// EDIT THIS LINK — where "BUILD SOMETHING NEW" points (v0, GitHub, a new project…)
const BUILD_BUTTON_HREF = "https://v0.app";

// ─────────────────────────────────────────────────────────────────────────────
// Cinematic schedule — absolute ms after mount for each reveal step.
// Step n becomes visible at STEP_TIMES[n - 1].
const STEP_TIMES = [
  1400, // 1  AGENT RMP
  2600, // 2  MISSION REPORT
  4400, // 3  divider
  5400, // 4  accomplishment: first deployed website
  8200, // 5  accomplishment: interactive app
  10800, // 6  product builder status
  12200, // 7  internet wizard level
  14600, // 8  KNOWN SKILLS DETECTED
  15600, 16350, 17100, 17850, 18600, 19350, 20100, // 9–15 skills, one by one
  22600, // 16 ORIGINAL STATUS: HUMAN
  26000, // 17 CURRENT STATUS: INTERNET WIZARD (confetti)
  30500, // 18 "One final transmission..."
  32500, // 19 transmission body
  36500, // 20 — THE SCII WIZARD
  39000, // 21 P.S.
  41500, // 22 control transfer
  43500, // 23 BUILD SOMETHING NEW
];

const WIZARD_STEP = 17;

// Starfield generated once at module load — Graduation only ever mounts
// client-side (after the breakout), so there's no hydration concern.
const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() < 0.85 ? 1 : 2,
  delay: Math.random() * 6,
  duration: 3 + Math.random() * 5,
}));

export default function Graduation() {
  const [step, setStep] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers = STEP_TIMES.map((t, i) => setTimeout(() => setStep(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Keep the newest reveal in view
  useEffect(() => {
    if (step > 3) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [step]);

  // The emotional peak — celebrate the wizard
  useEffect(() => {
    if (step !== WIZARD_STEP) return;
    const colors = ["#34d399", "#fbbf24", "#a78bfa", "#f4f4f5"];
    confetti({ particleCount: 160, spread: 100, origin: { y: 0.65 }, colors });
    const t1 = setTimeout(
      () => confetti({ particleCount: 90, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors }),
      350
    );
    const t2 = setTimeout(
      () => confetti({ particleCount: 90, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors }),
      600
    );
    const t3 = setTimeout(
      () => confetti({ particleCount: 120, spread: 130, startVelocity: 38, origin: { y: 0.4 }, colors }),
      1100
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [step]);

  return (
    <div className="grad-root fixed inset-0 z-50 overflow-y-auto bg-black font-mono text-zinc-200">
      {/* Atmosphere */}
      <div className="grad-nebula" />
      {STARS.map((s) => (
        <span
          key={s.id}
          className="grad-star"
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              "--delay": `${s.delay}s`,
              "--dur": `${s.duration}s`,
            } as React.CSSProperties
          }
        />
      ))}

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 py-16 text-center sm:py-24">
        {/* ── Title ── */}
        {step >= 1 && <h1 className="grad-fade-up grad-title">AGENT RMP</h1>}
        {step >= 2 && <h2 className="grad-fade-up grad-subtitle mt-4">MISSION REPORT</h2>}
        {step >= 3 && <div className="grad-fade-up grad-divider" />}

        {/* ── Accomplishments ── */}
        <div className="w-full space-y-9 text-left">
          {ACCOMPLISHMENTS.map(
            (a, i) =>
              step >= 4 + i && (
                <div key={a.label} className="grad-fade-up">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[11px] tracking-[0.25em] text-zinc-500">{a.label}</span>
                    <span className="flex-1 border-b border-dotted border-zinc-800" />
                    <span className="text-[11px] tracking-[0.25em] text-emerald-400">{a.status}</span>
                  </div>
                  {a.lines[0] && <p className="mt-3 text-lg text-zinc-100">{a.lines[0]}</p>}
                  {a.lines[1] && (
                    <p className="mt-1 text-sm leading-relaxed text-zinc-400">{a.lines[1]}</p>
                  )}
                </div>
              )
          )}
        </div>

        {/* ── Skills ── */}
        {step >= 8 && (
          <p className="grad-fade-up mt-20 text-xs tracking-[0.3em] text-zinc-500">
            KNOWN SKILLS DETECTED
          </p>
        )}
        <div className="mt-7 w-full max-w-sm space-y-2.5 text-left">
          {SKILLS.map(
            (s, i) =>
              step >= 9 + i && (
                <div key={s} className="grad-fade-up grad-skill">
                  <span className="mr-3 text-emerald-400">✓</span>
                  {s}
                </div>
              )
          )}
        </div>

        {/* ── Status upgrade ── */}
        {step >= 16 && (
          <div className="grad-fade-up mt-24">
            <p className="text-xs tracking-[0.3em] text-zinc-500">ORIGINAL STATUS</p>
            <p className={`mt-4 text-3xl tracking-[0.2em] ${step >= WIZARD_STEP ? "grad-status-old" : "text-zinc-300"}`}>
              HUMAN
            </p>
          </div>
        )}
        {step >= WIZARD_STEP && (
          <div className="grad-fade-up mt-14">
            <p className="text-xs tracking-[0.3em] text-zinc-500">CURRENT STATUS</p>
            <p className="grad-wizard-status mt-5">INTERNET WIZARD</p>
          </div>
        )}

        {/* ── Final transmission ── */}
        {step >= 18 && (
          <p className="grad-fade-up mt-24 text-sm text-zinc-500">One final transmission...</p>
        )}
        {step >= 19 && (
          <div className="mt-10 space-y-7 text-lg leading-relaxed text-zinc-100">
            <p className="grad-fade-up">
              Most people spend their lives
              <br />
              using things built by other people.
            </p>
            <p className="grad-fade-up" style={{ animationDelay: "1.1s" }}>
              You learned how to build your own.
            </p>
            <p className="grad-fade-up" style={{ animationDelay: "2.2s" }}>
              Keep building.
            </p>
          </div>
        )}
        {step >= 20 && (
          <p className="grad-fade-up mt-10 tracking-[0.2em] text-emerald-300">— THE SCII WIZARD</p>
        )}

        {/* ── Epilogue ── */}
        {step >= 21 && (
          <div className="grad-fade-up mt-20">
            <p className="text-xs tracking-[0.3em] text-zinc-500">P.S.</p>
            <p className="mt-4 text-zinc-300">The internet still needs more weird ideas.</p>
          </div>
        )}

        {/* ── The handoff ── */}
        {step >= 22 && (
          <div className="grad-fade-up mt-24 space-y-2 text-xs tracking-[0.25em] text-zinc-500">
            <p>RAVI-OS GRADUATION PROTOCOL COMPLETE.</p>
            <p>CONTROL TRANSFERRED TO: AGENT RMP.</p>
          </div>
        )}
        {step >= 23 && (
          <a
            href={BUILD_BUTTON_HREF}
            target="_blank"
            rel="noreferrer"
            className="grad-build-btn mt-12 mb-24"
          >
            BUILD SOMETHING NEW
          </a>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
