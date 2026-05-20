"use client";

import { useEffect, useRef, useState } from "react";
import { commands, CLEAR_SENTINEL, randomGibberish, isEggName, markFoundEgg, type CommandOutput } from "@/lib/commands";

const BOOT_LINES = [
  "BOOTING RAVI-OS...",
  "",
  "SECURE CONNECTION ESTABLISHED",
  "",
  "WELCOME, AGENT RMP.",
  "",
  "WE'VE BEEN EXPECTING YOU.",
  "",
  "Your mission, should you choose to accept it:",
  "Build things on the internet.",
  "",
  "Current level: HUMAN",
  "Target level: WIZARD",
];

export default function Terminal() {
  const [lines, setLines] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [booting, setBooting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [hacking, setHacking] = useState(false);
  const [raviRunning, setRaviRunning] = useState(false);
  const [raviActivated, setRaviActivated] = useState(false);
  const [typewriting, setTypewriting] = useState(false);
  const [raviFlicker, setRaviFlicker] = useState(false);
  const [glyphRain, setGlyphRain] = useState<{ id: number; x: number; y: number; glyph: string; delay: number; size: number }[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const bootingRef = useRef(false);
  const skipRef = useRef(false);
  const wakeUpRef = useRef<(() => void) | null>(null);
  const typewritingRef = useRef(false);
  const typewriterAbortRef = useRef<AbortController | null>(null);

  function completeBoot(skip = false) {
    bootingRef.current = false;
    setBooting(false);
    if (skip) {
      localStorage.setItem("ravios-booted", "true");
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setLines((prev) => [
        ...prev,
        "",
        "Accept your mission? [Y/N]",
      ]);
      setConfirming(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function triggerSkip() {
    if (!bootingRef.current) return;
    skipRef.current = true;
    wakeUpRef.current?.();
    setLines(BOOT_LINES);
    completeBoot(true);
  }

  // Global keydown skip during boot or typewriter animation
  useEffect(() => {
    function onKey() {
      if (bootingRef.current) triggerSkip();
      else if (typewritingRef.current) typewriterAbortRef.current?.abort();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const navType = (
      performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined
    )?.type;

    if (navType === "reload") {
      localStorage.removeItem("ravios-booted");
    }

    if (navType !== "reload" && localStorage.getItem("ravios-booted")) {
      setLines(["WELCOME BACK, AGENT RMP.", "Connection re-established."]);
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }

    bootingRef.current = true;
    setBooting(true);

    function sleep(ms: number): Promise<void> {
      return new Promise((resolve) => {
        if (skipRef.current) { resolve(); return; }
        const id = setTimeout(resolve, ms);
        wakeUpRef.current = () => { clearTimeout(id); resolve(); };
      });
    }

    async function runBoot() {
      for (let i = 0; i < BOOT_LINES.length; i++) {
        if (skipRef.current) return;

        const line = BOOT_LINES[i];
        // Dramatic pause before WELCOME; short initial delay; normal gap between lines
        const pauseMs = i === 0 ? 200 : line === "WELCOME, AGENT RMP." ? 900 : 400;
        await sleep(pauseMs);
        if (skipRef.current) return;

        if (line === "") {
          setLines((prev) => [...prev, ""]);
          continue;
        }

        setLines((prev) => [...prev, ""]);
        for (let c = 0; c < line.length; c++) {
          if (skipRef.current) return;
          await sleep(25);
          if (skipRef.current) return;
          setLines((prev) => {
            const next = [...prev];
            next[next.length - 1] = line.slice(0, c + 1);
            return next;
          });
        }
      }

      if (!skipRef.current) completeBoot(false);
    }

    runBoot();

    return () => {
      skipRef.current = true;
      wakeUpRef.current?.();
      bootingRef.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => { typewriterAbortRef.current?.abort(); };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [lines]);

  function handleContainerClick() {
    if (bootingRef.current) {
      triggerSkip();
      return;
    }
    if (typewritingRef.current) {
      typewriterAbortRef.current?.abort();
      return;
    }
    inputRef.current?.focus();
  }

  function enterNormalMode() {
    setConfirming(false);
    localStorage.setItem("ravios-booted", "true");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleConfirmKey(e: React.KeyboardEvent<HTMLInputElement>) {
    const key = e.key.toLowerCase();
    if (key === "y" || key === "enter") {
      e.preventDefault();
      const helpOutput = commands.help([]) as string[];
      setLines((prev) => [
        ...prev,
        "> Y",
        "",
        "MISSION ACCEPTED.",
        "",
        ...helpOutput,
      ]);
      enterNormalMode();
    } else if (key === "n") {
      e.preventDefault();
      setLines((prev) => [
        ...prev,
        "> N",
        "",
        "...interesting choice, Agent.",
        "The mission proceeds regardless.",
        "Type 'help' when you're ready.",
      ]);
      enterNormalMode();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (confirming) {
      handleConfirmKey(e);
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const prefix = input.toLowerCase();
      if (!prefix) return;
      const keys = Object.keys(commands);
      const matches = keys.filter((k) => k.startsWith(prefix));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        setLines((prev) => [...prev, `> ${input}`, matches.join("  ")]);
        setInput("");
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(next);
        setInput(history[next]);
      }
    }
  }

  async function runRavi() {
    setRaviRunning(true);

    // Flicker: green → gold → settle back, 1.4s
    setRaviFlicker(true);
    setTimeout(() => setRaviFlicker(false), 1400);

    // Glyph rain: 25 random glyphs, fade out over 2.5s
    const GLYPHS = ["✨", "⚡", "◆", "◉", "▲", "▓", "▒", "░", "R", "M", "P"];
    setGlyphRain(
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 96,
        y: Math.random() * 96,
        glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        delay: Math.random() * 600,
        size: 10 + Math.random() * 8,
      }))
    );
    setTimeout(() => setGlyphRain([]), 2500);

    const pause = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    const add = (line: string) => setLines((prev) => [...prev, line]);

    add("SEARCHING AGENT DATABASE...");
    await pause(700);
    add("");
    await pause(900);
    add("⚠ UNUSUAL RESULT DETECTED ⚠");
    await pause(1300);
    add("");
    add("AGENT RMP IDENTIFIED.");
    await pause(900);
    add("");
    add("CHILD PRODIGY DETECTED.");
    await pause(300);
    add("CLEARANCE LEVEL: MAXIMUM.");
    await pause(700);
    add("");
    add("Status: BUILDER.");
    await pause(200);
    add("Status: CREATOR.");
    await pause(200);
    add("Status: WIZARD (training).");
    await pause(800);
    add("");
    add("The system has been expecting you.");
    await pause(700);
    add("");
    add("Most users discover RaviOS.");
    await pause(500);
    add("");
    add("You were meant to find it.");
    await pause(1000);
    add("");
    add("Welcome home, Agent RMP.");
    await pause(500);
    add("");
    add("Hidden pathways unlocked.");

    setRaviActivated(true);
    setRaviRunning(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  async function runHacking(label: string) {
    setHacking(true);
    const deadline = Date.now() + 2500;
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        setLines((prev) => [...prev, randomGibberish()]);
        if (Date.now() >= deadline) {
          clearInterval(interval);
          resolve();
        }
      }, 80);
    });
    const pause = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    await pause(300);
    setLines((prev) => [...prev, "ACCESS DENIED."]);
    await pause(400);
    setLines((prev) => [...prev, "Nice try, Agent."]);
    await pause(400);
    setLines((prev) => [...prev, "Try harder."]);
    setHacking(false);
    setTimeout(() => inputRef.current?.focus(), 0);
    void label;
  }

  async function runTypewriter(cmdText: string, twLines: string[]) {
    const ac = new AbortController();
    typewriterAbortRef.current = ac;
    typewritingRef.current = true;
    setTypewriting(true);

    setLines((prev) => [...prev, `> ${cmdText}`]);

    const sleep = (ms: number): Promise<void> =>
      new Promise((resolve) => {
        if (ac.signal.aborted) { resolve(); return; }
        const id = setTimeout(resolve, ms);
        ac.signal.addEventListener("abort", () => { clearTimeout(id); resolve(); }, { once: true });
      });

    let i = 0;

    outer: for (; i < twLines.length; i++) {
      if (ac.signal.aborted) break;

      if (i > 0) {
        await sleep(120);
        if (ac.signal.aborted) break;
      }

      const line = twLines[i];

      if (line === "") {
        setLines((prev) => [...prev, ""]);
        continue;
      }

      setLines((prev) => [...prev, ""]);

      for (let c = 0; c < line.length; c++) {
        if (ac.signal.aborted) {
          setLines((prev) => {
            const next = [...prev];
            next[next.length - 1] = line;
            return [...next, ...twLines.slice(i + 1)];
          });
          i = twLines.length;
          break outer;
        }
        await sleep(10);
        if (ac.signal.aborted) {
          setLines((prev) => {
            const next = [...prev];
            next[next.length - 1] = line;
            return [...next, ...twLines.slice(i + 1)];
          });
          i = twLines.length;
          break outer;
        }
        setLines((prev) => {
          const next = [...prev];
          next[next.length - 1] = line.slice(0, c + 1);
          return next;
        });
      }
    }

    // Aborted during between-line pause: dump remaining lines
    if (ac.signal.aborted && i < twLines.length) {
      setLines((prev) => [...prev, ...twLines.slice(i)]);
    }

    typewritingRef.current = false;
    typewriterAbortRef.current = null;
    setTypewriting(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function triggerShake() {
    setShaking(false);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setShaking(true);
        setTimeout(() => setShaking(false), 650);
      })
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (hacking || raviRunning || confirming || typewriting) return;
    const cmd = input.trim();

    if (cmd === "") {
      setLines((prev) => [...prev, ">"]);
    } else {
      const normalized = cmd.toLowerCase();
      const resolvedName = commands[normalized] ? normalized : normalized.split(/\s+/)[0];
      const handler = commands[resolvedName];
      const displayName = normalized.split(/\s+/)[0];

      if (handler) {
        if (isEggName(resolvedName)) markFoundEgg(resolvedName);
        const result = handler(normalized.split(/\s+/).slice(resolvedName === normalized ? 0 : 1));
        if (result === CLEAR_SENTINEL) {
          setLines([]);
        } else if (typeof result === "object" && !Array.isArray(result) && "lines" in result) {
          if ("type" in result && result.type === "typewriter") {
            runTypewriter(cmd, result.lines);
          } else {
            const { lines: out, effect } = result as Extract<CommandOutput, { effect?: unknown }>;
            if (effect === "hacking") {
              setLines((prev) => [...prev, `> ${cmd}`]);
              runHacking(cmd);
            } else if (effect === "ravi") {
              setLines((prev) => [...prev, `> ${cmd}`]);
              runRavi();
            } else {
              setLines((prev) => [...prev, `> ${cmd}`, ...out]);
              if (effect === "shake") triggerShake();
            }
          }
        } else {
          const output = Array.isArray(result) ? result : [result];
          setLines((prev) => [...prev, `> ${cmd}`, ...output]);
        }
      } else {
        setLines((prev) => [
          ...prev,
          `> ${cmd}`,
          `command not found: ${displayName}`,
        ]);
      }

      setHistory((prev) => [...prev, cmd]);
    }

    setInput("");
    setHistoryIndex(null);
  }

  return (
    <div
      className={`relative flex flex-col flex-1 min-h-0 bg-black text-green-400 font-mono text-sm p-4 cursor-text terminal-glow${shaking ? " terminal-shake" : ""}${raviFlicker ? " terminal-ravi-flicker" : ""}`}
      onClick={handleContainerClick}
    >
      {glyphRain.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {glyphRain.map(({ id, x, y, glyph, delay, size }) => (
            <span
              key={id}
              className="absolute terminal-glyph-rain"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                animationDelay: `${delay}ms`,
                color: id % 3 === 0 ? "#fbbf24" : id % 3 === 1 ? "#fde68a" : "#4ade80",
                fontSize: `${size}px`,
              }}
            >
              {glyph}
            </span>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-2 min-h-0">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed">
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {!booting && !hacking && !raviRunning && !typewriting && (
        <form onSubmit={handleSubmit} className="flex items-center gap-1 shrink-0">
          <span className="select-none">{confirming ? "" : raviActivated ? "agent-rmp@ravios:~$" : ">"}</span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent outline-none caret-transparent text-green-400"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <span
              className="absolute top-0 pointer-events-none animate-pulse"
              style={{ left: `${input.length}ch` }}
            >
              ▋
            </span>
          </div>
        </form>
      )}
    </div>
  );
}
