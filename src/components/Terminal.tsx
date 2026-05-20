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

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const bootingRef = useRef(false);
  const skipRef = useRef(false);
  const wakeUpRef = useRef<(() => void) | null>(null);

  function completeBoot(skip = false) {
    bootingRef.current = false;
    setBooting(false);
    if (skip) {
      sessionStorage.setItem("ravios-booted", "true");
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

  // Global keydown skip during boot — only fires while booting
  useEffect(() => {
    function onKey() {
      if (bootingRef.current) triggerSkip();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("ravios-booted")) {
      inputRef.current?.focus();
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
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [lines]);

  function handleContainerClick() {
    if (bootingRef.current) {
      triggerSkip();
      return;
    }
    inputRef.current?.focus();
  }

  function enterNormalMode() {
    setConfirming(false);
    sessionStorage.setItem("ravios-booted", "true");
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
    if (hacking || confirming) return;
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
          const { lines: out, effect } = result as CommandOutput;
          if (effect === "hacking") {
            setLines((prev) => [...prev, `> ${cmd}`]);
            runHacking(cmd);
          } else {
            setLines((prev) => [...prev, `> ${cmd}`, ...out]);
            if (effect === "shake") triggerShake();
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
      className={`flex flex-col h-screen bg-black text-green-400 font-mono text-sm p-4 cursor-text terminal-glow${shaking ? " terminal-shake" : ""}`}
      onClick={handleContainerClick}
    >
      <div className="flex-1 overflow-y-auto pb-2">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed">
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {!booting && !hacking && (
        <form onSubmit={handleSubmit} className="flex items-center gap-1 shrink-0">
          <span className="select-none">{confirming ? "" : ">"}</span>
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
