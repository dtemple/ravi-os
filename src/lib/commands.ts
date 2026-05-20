export const CLEAR_SENTINEL = "__CLEAR__";

type Handler = (args: string[]) => string | string[];

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "A SQL query walks into a bar, walks up to two tables and asks... can I join you?",
  "Why did the developer go broke? Because they used up all their cache.",
  "How many programmers does it take to change a light bulb? None — that's a hardware problem.",
  "Why do Java developers wear glasses? Because they don't C#.",
  "A byte walks into a bar looking pale. The bartender asks: 'What's wrong?' The byte says: 'Just feeling a bit off.'",
  "There are 10 types of people in the world: those who understand binary and those who don't.",
  "Why was the JavaScript developer sad? Because they didn't know how to 'null' their feelings.",
];

const FORTUNES = [
  "The compiler smiles upon you today.",
  "A hidden function awaits the curious.",
  "Your next commit will be legendary. Or at least it will compile.",
  "The internet is not a series of tubes. It is a series of YOU.",
  "Infinite loops are just enthusiasm without direction.",
  "The wizard who ships is mightier than the wizard who plans.",
  "Every bug is a mystery. Every fix is a spell.",
  "The best code you write today will confuse you in six months. This is the way.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const commands: Record<string, Handler> = {
  help: () => [
    "AVAILABLE COMMANDS",
    "──────────────────────────────────────",
    "  help     — show this list",
    "  clear    — clear the terminal",
    "  level    — check your current wizard level",
    "  mission  — list missions (or: mission 0/1/2)",
    "  joke     — hear a programmer joke",
    "  fortune  — receive a cryptic transmission",
    "  family   — known associates report",
    "  wizard   — summon the ASCII wizard",
    "──────────────────────────────────────",
    "...there may be more commands hidden in the system.",
  ],

  clear: () => CLEAR_SENTINEL,

  level: () => [
    "AGENT RMP — STATUS REPORT",
    "──────────────────────────────────────",
    "  Current level : HUMAN",
    "  Target level  : WIZARD",
    "",
    "  Progress: [██░░░░░░░░░░░░░░░░░░] 10%",
    "",
    "  Complete your missions to level up.",
  ],

  mission: (args) => {
    const sub = args[0];
    if (!sub) {
      return [
        "MISSION DOSSIER — AGENT RMP",
        "──────────────────────────────────────",
        "  MISSION 0  —  UNLOCK THE TOOLS",
        "  MISSION 1  —  BUILD YOUR BASE",
        "  MISSION 2  —  CREATE SOMETHING WEIRD",
        "",
        "Type 'mission 0', 'mission 1', or 'mission 2' for details.",
      ];
    }
    if (sub === "0") {
      return [
        ">>> CLASSIFIED // EYES ONLY AGENT RMP <<<",
        "",
        "  MISSION 0: UNLOCK THE TOOLS",
        "",
        "  OBJECTIVE: Gain access to the internet builder toolkit.",
        "    — Set up GitHub (your code vault)",
        "    — Set up Vercel (your launch pad)",
        "    — Set up v0 (your AI co-pilot)",
        "",
        "  STATUS: AVAILABLE — awaiting your move.",
        "",
        ">>> END TRANSMISSION <<<",
      ];
    }
    if (sub === "1") {
      return [
        ">>> CLASSIFIED // EYES ONLY AGENT RMP <<<",
        "",
        "  MISSION 1: BUILD YOUR BASE",
        "",
        "  OBJECTIVE: Ship a real website to the internet.",
        "    — Design your personal homepage",
        "    — Add favorite things, funny buttons, weird interactions",
        "    — Make it yours. Make it strange. Make it real.",
        "",
        "  STATUS: LOCKED — complete Mission 0 first.",
        "",
        ">>> END TRANSMISSION <<<",
      ];
    }
    if (sub === "2") {
      return [
        ">>> CLASSIFIED // EYES ONLY AGENT RMP <<<",
        "",
        "  MISSION 2: CREATE SOMETHING WEIRD",
        "",
        "  OBJECTIVE: Build an interactive project of your choosing.",
        "    — Joke generator? Fortune teller? Mini game?",
        "    — Battle simulator? Soundboard? Internet toy?",
        "    — The exact project is TBD — we choose it together.",
        "",
        "  STATUS: LOCKED — complete Mission 1 first.",
        "",
        ">>> END TRANSMISSION <<<",
      ];
    }
    return `mission: unknown mission '${sub}'. Try: mission 0, mission 1, or mission 2`;
  },

  joke: () => pick(JOKES),

  fortune: () => [
    "~~ INCOMING TRANSMISSION ~~",
    "",
    `  "${pick(FORTUNES)}"`,
    "",
    "~~ END TRANSMISSION ~~",
  ],

  family: () => [
    "KNOWN ASSOCIATES — AGENT RMP",
    "──────────────────────────────────────",
    "  [REDACTED]  — Clearance: PARENT",
    "  [REDACTED]  — Clearance: PARENT",
    "  [REDACTED]  — Clearance: SIBLING",
    "",
    "  All associates have been briefed.",
    "  They do not know about this terminal.",
  ],

  wizard: () => [
    "        .-~~~-.",
    "       / o   o \\",
    "      |  ~~^~~  |",
    "       \\ (___) /",
    "    .===`-----'===.",
    "   /  WIZARD MODE  \\",
    "  /___________________\\",
    "",
    "  ✦ ABRACADEBUG — may your code compile ✦",
  ],
};
