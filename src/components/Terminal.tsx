"use client";

import { useEffect, useRef, useState } from "react";

export default function Terminal() {
  const [lines, setLines] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [lines]);

  function handleContainerClick() {
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input.trim();

    if (cmd === "") {
      setLines((prev) => [...prev, ">"]);
    } else {
      setLines((prev) => [
        ...prev,
        `> ${cmd}`,
        `command not found: ${cmd}`,
      ]);
      setHistory((prev) => [...prev, cmd]);
    }

    setInput("");
    setHistoryIndex(null);
  }

  return (
    <div
      className="flex flex-col h-screen bg-black text-green-400 font-mono text-sm p-4 cursor-text"
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

      <form onSubmit={handleSubmit} className="flex items-center gap-1 shrink-0">
        <span className="select-none">&gt;</span>
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
    </div>
  );
}
