"use client";

import { useEffect, useRef, useState } from "react";
import { commands, CLEAR_SENTINEL, randomGibberish, isEggName, markFoundEgg, type CommandOutput } from "@/lib/commands";

const BOOT_LINES = [
  "WELCOME BACK, AGENT RMP.",
  "",
  "  [✓] MISSION 0 — UNLOCK THE TOOLS         COMPLETE",
  "  [▶] MISSION 1 — BUILD YOUR BASE          IN PROGRESS  (target: Llama Parade)",
  "  [ ] MISSION 2 — CREATE SOMETHING WEIRD   LOCKED",
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
  const [kavirRunning, setKavirRunning] = useState(false);
  const [kavirActivated, setKavirActivated] = useState(false);
  const [wizardRunning, setWizardRunning] = useState(false);
  const [wizardActivated, setWizardActivated] = useState(false);
  const [wizardEnchanted, setWizardEnchanted] = useState(false);
  const [wizardPrompt, setWizardPrompt] = useState("wizard@ravios:~$");
  const [forceRunning, setForceRunning] = useState(false);
  const [forceJumping, setForceJumping] = useState(false);
  const [forceActivated, setForceActivated] = useState(false);
  const [forceReticle, setForceReticle] = useState(false);
  const [forceStars, setForceStars] = useState<{ id: number; y: number; delay: number; duration: number; length: number; thickness: number; color: string }[]>([]);
  const [typewriting, setTypewriting] = useState(false);
  const [raviFlicker, setRaviFlicker] = useState(false);
  const [kavirFlicker, setKavirFlicker] = useState(false);
  const [wizardFlicker, setWizardFlicker] = useState(false);
  const [glyphRain, setGlyphRain] = useState<{ id: number; x: number; y: number; glyph: string; delay: number; size: number; scheme: "ravi" | "kavir" | "wizard" }[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const bootingRef = useRef(false);
  const skipRef = useRef(false);
  const wakeUpRef = useRef<(() => void) | null>(null);
  const typewritingRef = useRef(false);
  const typewriterAbortRef = useRef<AbortController | null>(null);
  const raviActivatedRef = useRef(false);
  const kavirActivatedRef = useRef(false);

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
      setLines([
        "WELCOME BACK, AGENT RMP.",
        "Connection re-established.",
        "",
        "  [✓] MISSION 0  COMPLETE",
        "  [▶] MISSION 1  IN PROGRESS — target: Llama Parade",
        "  [ ] MISSION 2  LOCKED",
        "",
        "Type 'mission 1' for the briefing.",
      ]);
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
        const isIntro = line === "WELCOME BACK, AGENT RMP.";
        // Fast welcome; normal gap for the mission status block
        const pauseMs = i === 0 ? 80 : isIntro ? 120 : 400;
        await sleep(pauseMs);
        if (skipRef.current) return;

        if (line === "") {
          setLines((prev) => [...prev, ""]);
          continue;
        }

        const charMs = isIntro ? 10 : 25;
        setLines((prev) => [...prev, ""]);
        for (let c = 0; c < line.length; c++) {
          if (skipRef.current) return;
          await sleep(charMs);
          if (skipRef.current) return;
          setLines((prev) => {
            const next = [...prev];
            next[next.length - 1] = line.slice(0, c + 1);
            return next;
          });
        }
      }

      if (skipRef.current) return;

      const helpOutput = commands.help([]);
      if (Array.isArray(helpOutput)) {
        setLines((prev) => [...prev, "", ...helpOutput]);
      }
      completeBoot(true);
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
        scheme: "ravi" as const,
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

    raviActivatedRef.current = true;
    setRaviActivated(true);
    setRaviRunning(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  async function runKavir() {
    setKavirRunning(true);
    const raviWasActive = raviActivatedRef.current;

    // Cyan/teal sync pulse, 1.4s
    setKavirFlicker(true);
    setTimeout(() => setKavirFlicker(false), 1400);

    // Glyph rain: musical + terminal glyphs in cyan/teal palette
    const KAVIR_GLYPHS = ["♫", "▲", "◆", "∿", "❄", "R", "M", "P", "K", "V"];
    setGlyphRain(
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 96,
        y: Math.random() * 96,
        glyph: KAVIR_GLYPHS[Math.floor(Math.random() * KAVIR_GLYPHS.length)],
        delay: Math.random() * 600,
        size: 10 + Math.random() * 8,
        scheme: "kavir" as const,
      }))
    );
    setTimeout(() => setGlyphRain([]), 2500);

    const pause = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    const add = (line: string) => setLines((prev) => [...prev, line]);

    add("SEARCHING KNOWN ASSOCIATES...");
    await pause(600);
    add("");
    await pause(1000);
    add("SECOND SIGNAL DETECTED.");
    await pause(600);
    add("LINK STABILIZING...");
    await pause(800);
    add("");
    add("KNOWN ASSOCIATE: AGENT KAVIR.");
    await pause(900);
    add("");
    add("Status: FIELD-ACTIVE.");
    await pause(200);
    add("Clearance: ELEVATED.");
    await pause(600);
    add("");
    add("Primary skills detected:");
    await pause(200);
    add("- musical synchronization");
    await pause(200);
    add("- mountain operations");
    await pause(200);
    add("- advanced ski buddy protocols");
    await pause(700);
    add("");
    add("Compatibility with AGENT RMP:");
    await pause(200);
    add("EXCEPTIONALLY HIGH");
    await pause(800);
    add("");
    add("Warning:");
    await pause(200);
    add("Co-op mode dramatically increases chaos levels.");
    await pause(800);
    add("");
    add("Mission status: ongoing.");
    await pause(200);
    add("Full details unavailable.");
    await pause(600);
    add("");
    add("Do not underestimate either of them.");
    await pause(800);
    add("");
    add("DUAL AGENT LINK ESTABLISHED.");

    if (raviWasActive) {
      await pause(800);
      add("");
      await pause(400);
      add("BROTHER SIGNAL SYNCHRONIZED.");
      await pause(250);
      add("SYSTEM STABILITY REDUCED.");
      await pause(250);
      add("CREATIVITY LEVELS INCREASING.");
    }

    kavirActivatedRef.current = true;
    setKavirActivated(true);
    setKavirRunning(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  async function runWizard() {
    setWizardRunning(true);

    const pause = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    const add = (line: string) => setLines((prev) => [...prev, line]);

    // Preamble — build dread before the entity responds
    add("...");
    await pause(600);
    add("...");
    await pause(700);
    add("SIGNAL DETECTED");
    await pause(900);
    add("ESTABLISHING ARCANE CONNECTION…");
    await pause(1000);
    add("WARNING: UNKNOWN ENTITY RESPONDING");
    await pause(700);

    // Dramatic activation: emerald/white burst + shake + long glyph rain
    setWizardFlicker(true);
    setTimeout(() => setWizardFlicker(false), 1600);
    triggerShake();

    const BASE_GLYPHS = ["✨", "⚡", "▲", "◆", "◉", "▓", "▒", "░", "/", "\\"];
    const RARE_GLYPHS = ["SCII", "RMP"];
    const ALL_GLYPHS = [...BASE_GLYPHS, ...BASE_GLYPHS, ...BASE_GLYPHS, ...RARE_GLYPHS];
    setGlyphRain(
      Array.from({ length: 35 }, (_, i) => ({
        id: i,
        x: Math.random() * 96,
        y: Math.random() * 96,
        glyph: ALL_GLYPHS[Math.floor(Math.random() * ALL_GLYPHS.length)],
        delay: Math.random() * 800,
        size: 9 + Math.random() * 9,
        scheme: "wizard" as const,
      }))
    );
    setTimeout(() => setGlyphRain([]), 3500);

    await pause(600);
    add("");
    await pause(400);

    // Original wizard content preserved
    add("SCANNING AGENT ID...");
    await pause(500);
    add("");
    add("AGENT RMP VERIFIED");
    await pause(500);
    add("");
    add("ARCANE TERMINAL LINK ESTABLISHED");
    await pause(500);
    add("");
    add("REALITY EDIT MODE ENABLED");
    await pause(700);
    add("");

    // ASCII wizard — full reveal at once, then let it land
    setLines((prev) => [
      ...prev,
      "           /\\",
      "          /  \\",
      "         /_☆__\\",
      "        ( o  o )",
      "         \\  ^ /",
      "       ___\\___/___",
      "      /  /|   |\\  \\",
      "     /__/ |___| \\__\\",
      "        /  | |  \\",
      "       /___| |___\\",
      "          /   \\",
      "         /_____\\",
    ]);
    await pause(900);

    // Wizard speech
    add("");
    add('  "Greetings, Agent RMP.');
    await pause(300);
    add("");
    add("   The builders have been expecting you.");
    await pause(300);
    add("");
    add("   Most humans scroll.");
    await pause(200);
    add("   A few learn to build.");
    await pause(300);
    add("");
    add('   The internet is now yours to shape."');

    // Long earned pause — then enchanted mode activates and the transmission arrives
    await pause(2500);
    setWizardEnchanted(true);
    setTimeout(() => setWizardEnchanted(false), 20000);

    await pause(500);
    add("");
    add('"The internet is not fixed.');
    await pause(300);
    add('It is programmable."');
    await pause(1500);
    add("");
    add('"Build wisely, Agent RMP."');

    // Determine prompt based on which agents have activated this session
    const ravi = raviActivatedRef.current;
    const kavir = kavirActivatedRef.current;
    const prompt =
      ravi && kavir ? "dual-agent-wizard@ravios:~$" :
      ravi           ? "agent-rmp@wizard-terminal:~$" :
                       "wizard@ravios:~$";
    setWizardPrompt(prompt);
    setWizardActivated(true);
    setWizardRunning(false);
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

  async function runForce() {
    setForceRunning(true);

    const pause = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    const add = (line: string) => setLines((prev) => [...prev, line]);

    // Cinematic lead-in
    add("SEARCHING THE FORCE...");
    await pause(900);
    add("");
    add("CONNECTION ESTABLISHED.");
    await pause(800);

    // Streaking starfield for the jump (white/blue, varied length + speed)
    const STAR_COLORS = ["#ffffff", "#e0f2fe", "#bae6fd", "#7dd3fc", "#38bdf8"];
    setForceStars(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        y: Math.random() * 100,
        delay: Math.random() * 550,
        duration: 480 + Math.random() * 520,
        length: 12 + Math.random() * 28,
        thickness: 1 + Math.random() * 2,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      }))
    );

    // Dim → blue hologram shift + acceleration pulse + shake (~1.5s)
    setForceJumping(true);
    await pause(1500);
    setForceJumping(false);
    setForceStars([]);

    // Lock into Jedi/hologram mode — terminal shifts green → cool blue
    setForceActivated(true);

    // Brief targeting reticle on arrival
    setForceReticle(true);
    setTimeout(() => setForceReticle(false), 900);

    await pause(450);
    add("");
    add("THE FORCE IS STRONG WITH AGENT RMP.");
    await pause(800);
    add("");
    add("BUILDER POTENTIAL DETECTED.");
    await pause(650);
    add("");
    add("TRAINING MODE: ENABLED.");
    await pause(1200);
    add("");
    add("Stay on target...");

    setForceRunning(false);
    setTimeout(() => inputRef.current?.focus(), 0);
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
    if (hacking || raviRunning || kavirRunning || wizardRunning || forceRunning || confirming || typewriting) return;
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
            } else if (effect === "kavir") {
              setLines((prev) => [...prev, `> ${cmd}`]);
              runKavir();
            } else if (effect === "wizard") {
              setLines((prev) => [...prev, `> ${cmd}`]);
              runWizard();
            } else if (effect === "force") {
              setLines((prev) => [...prev, `> ${cmd}`]);
              runForce();
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
      className={`relative flex flex-col flex-1 min-h-0 bg-black text-green-400 font-mono text-sm p-4 cursor-text terminal-glow${shaking ? " terminal-shake" : ""}${raviFlicker ? " terminal-ravi-flicker" : ""}${kavirFlicker ? " terminal-kavir-sync" : ""}${wizardFlicker ? " terminal-wizard-flicker" : ""}${wizardEnchanted ? " terminal-wizard-enchanted" : ""}${forceActivated ? " terminal-jedi" : ""}${forceJumping ? " terminal-force-jump" : ""}`}
      onClick={handleContainerClick}
    >
      {(forceStars.length > 0 || forceReticle) && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
          {forceStars.map(({ id, y, delay, duration, length, thickness, color }) => (
            <span
              key={id}
              className="hyperspace-streak"
              style={{
                top: `${y}%`,
                width: `${length}vw`,
                height: `${thickness}px`,
                animationDelay: `${delay}ms`,
                animationDuration: `${duration}ms`,
                background: `linear-gradient(to right, transparent, ${color})`,
                boxShadow: `0 0 6px ${color}`,
              }}
            />
          ))}
          {forceReticle && <div className="force-reticle" />}
        </div>
      )}
      {glyphRain.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {glyphRain.map(({ id, x, y, glyph, delay, size, scheme }) => (
            <span
              key={id}
              className="absolute terminal-glyph-rain"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                animationDelay: `${delay}ms`,
                color: scheme === "kavir"
                  ? (id % 3 === 0 ? "#22d3ee" : id % 3 === 1 ? "#67e8f9" : "#4ade80")
                  : scheme === "wizard"
                  ? (id % 3 === 0 ? "#34d399" : id % 3 === 1 ? "#fbbf24" : "#6ee7b7")
                  : (id % 3 === 0 ? "#fbbf24" : id % 3 === 1 ? "#fde68a" : "#4ade80"),
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

      {!booting && !hacking && !raviRunning && !kavirRunning && !wizardRunning && !forceRunning && !typewriting && (
        <form onSubmit={handleSubmit} className="flex items-center gap-1 shrink-0">
          <span className="select-none">{confirming ? "" : forceActivated ? "jedi@ravios:$" : wizardActivated ? wizardPrompt : kavirActivated ? "agent-rmp+kavir@ravios:~$" : raviActivated ? "agent-rmp@ravios:~$" : ">"}</span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full bg-transparent outline-none caret-transparent ${forceActivated ? "text-sky-300" : "text-green-400"}`}
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
