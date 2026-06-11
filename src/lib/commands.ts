import confetti from "canvas-confetti";

export const CLEAR_SENTINEL = "__CLEAR__";

export type CommandEffect = "shake" | "hacking" | "ravi" | "kavir" | "wizard" | "force" | "graduate";

export type CommandOutput =
  | { lines: string[]; effect?: CommandEffect }
  | { type: 'typewriter'; lines: string[] };

type Handler = (args: string[]) => string | string[] | CommandOutput;

const HEX = "0123456789abcdef";
const HACK_LABELS = [
  "BREACH ATTEMPT",
  "FIREWALL PROBE",
  "ACCESS SCAN",
  "PACKET DECRYPT",
  "ROUTE BYPASS",
  "CHECKSUM FAIL",
  "BUFFER OVERFLOW",
];

export function randomGibberish(): string {
  const hex = Array.from({ length: 6 }, () =>
    Array.from({ length: 4 }, () => HEX[Math.floor(Math.random() * 16)]).join("")
  ).join(" ");
  const label =
    Math.random() < 0.35
      ? `  [${HACK_LABELS[Math.floor(Math.random() * HACK_LABELS.length)]}]`
      : "";
  return hex + label;
}

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "A SQL query walks into a bar, walks up to two tables and asks... can I join you?",
  "Why did the developer go broke? Because they used up all their cache.",
  "How many programmers does it take to change a light bulb? None — that's a hardware problem.",
  "A byte walks into a bar looking pale. The bartender asks: 'What's wrong?' The byte says: 'Just feeling a bit off.'",
  "There are 10 types of people in the world: those who understand binary and those who don't.",
  "Why did the computer go to art school?\nIt wanted to learn how to draw windows.",
  "Why did the laptop bring a sweater?\nIt heard there would be a cold start.",
  "Why did the robot cross the road?\nBecause someone programmed the chicken incorrectly.",
  "Why was the computer so smart?\nIt listened to its motherboard.",
  "What's a computer's favorite snack?\nMicrochips.",
  "Why was the phone wearing glasses?\nIt lost its contacts.",
  "Why did the computer get a stomach ache?\nToo many cookies.",
  "Why did the pixel go to school?\nTo become a bigger picture.",
  "Why don't robots ever panic?\nThey have nerves of steel.",
  "What kind of music do computers like best?\nAlgo-rhythm.",
  "What did the computer say to the Wi-Fi?\n\"I feel a connection.\"",
  "Why do programmers like nature?\nBecause it has lots of bugs.",
  "Why did the computer go to the doctor?\nIt caught a virus.",
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

// ── Egg tracking ─────────────────────────────────────────────────────────────

export const EGG_NAMES = [
  "summon dragon",
  "ravi",
  "kavir",
  "hack the mainframe",
  "confetti",
  "use the force",
] as const;

export type EggName = (typeof EGG_NAMES)[number];

const EGG_SET = new Set<string>(EGG_NAMES);
const EGGS_KEY = "ravios-found-eggs";

export function isEggName(name: string): name is EggName {
  return EGG_SET.has(name);
}

function getFoundEggs(): EggName[] {
  try {
    return JSON.parse(sessionStorage.getItem(EGGS_KEY) ?? "[]") as EggName[];
  } catch {
    return [];
  }
}

export function markFoundEgg(name: EggName): void {
  const found = getFoundEggs();
  if (!found.includes(name)) {
    sessionStorage.setItem(EGGS_KEY, JSON.stringify([...found, name]));
  }
}

// ── Hint rhymes ───────────────────────────────────────────────────────────────

const HINT_RHYMES: Record<EggName, [string, string]> = {
  "summon dragon": [
    "Scales of fire, wings unfurled.",
    "SUMMON the beast from another world.",
  ],
  ravi: [
    "The system waits in emerald light.",
    "Type your true name. Unlock the night.",
  ],
  kavir: [
    "Not all agents walk alone.",
    "Call your brother. Bring him home.",
  ],
  "hack the mainframe": [
    "The fortress hums, the data sleeps.",
    "HACK the MAINFRAME. Wake what it keeps.",
  ],
  confetti: [
    "Even green screens love a show.",
    "Throw CONFETTI. Make it glow.",
  ],
  "use the force": [
    "Calm the mind. The stars draw near.",
    "USE THE FORCE. The path is clear.",
  ],
};

export const commands: Record<string, Handler> = {
  help: () => [
    "AVAILABLE COMMANDS",
    "──────────────────────────────────────",
    "  mission  — list missions (or: mission 0/1/2)",
    "  level    — check your current wizard level",
    "  help     — show this list",
    "  clear    — clear the terminal",
    "  joke     — hear a programmer joke",
    "  family   — known associates report",
    "  llama    — deploy a llama (use with caution)",
    "  wizard   — summon the ASCII wizard",
    "──────────────────────────────────────",
    "...there may be more… try hint",
  ],

  clear: () => CLEAR_SENTINEL,

  level: () => [
    "AGENT RMP — STATUS REPORT",
    "──────────────────────────────────────",
    "  Current level : APPRENTICE",
    "  Target level  : WIZARD",
    "",
    "  Progress: [█████████████░░░░░░░] 66%",
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
      return {
        type: 'typewriter' as const,
        lines: [
          ">>> CLASSIFIED // EYES ONLY AGENT RMP <<<",
          "",
          "  MISSION 0: UNLOCK THE TOOLS",
          "",
          "  OBJECTIVE: Gain access to the internet builder toolkit.",
          "    — Set up GitHub (your code vault)",
          "    — Set up Vercel (your launch pad)",
          "    — Set up v0 (your AI co-pilot)",
          "",
          "  STATUS: ✓ COMPLETE — tools unlocked.",
          "    [✓] GitHub vault online",
          "    [✓] Vercel launch pad armed",
          "    [✓] v0 co-pilot synced",
          "    [✓] Intel transmitted",
          "",
          ">>> INTEL DEBRIEF // AGENT RMP <<<",
          "",
          "  KNOWN HAUNTS:",
          "    YouTube · Gemini · Claude · Google Classroom",
          "    Gmail · Google Docs",
          "",
          "  TOOLS OF NOTE:",
          "    Ace Combat 7: Skies Unknown — sparked love of aviation",
          "    Lego City Undercover — co-op laughs w/ Agent Kavir",
          "    Apple Calculator — trusty math sidearm",
          "",
          "  SIGNAL SOURCES (creators tracked):",
          "    Anjie · Mind Squire · Law By Mike · Louisayy",
          "",
          "  THINGS THAT SHOULD EXIST ON THE INTERNET:",
          "    — an app with a REAL life online",
          "    — an app stuffed with easter eggs and mysteries",
          "    — a REALLY COOL Star Wars game",
          "",
          "  WEIRDEST WEBSITE IDEA ON FILE:",
          "    a site where you just walk around doing nothing",
          "    and find cats with dog heads",
          "",
          "  REQUESTED INTERNET POWER:",
          "    control of the web",
          "",
          "  STATED MISSION:",
          "    learn how to code",
          "",
          ">>> END DEBRIEF <<<",
        ],
      };
    }
    if (sub === "1") {
      return {
        type: 'typewriter' as const,
        lines: [
          ">>> CLASSIFIED // EYES ONLY AGENT RMP <<<",
          "",
          "  MISSION 1: BUILD YOUR BASE",
          "",
          "  OBJECTIVE: Ship a real website to the internet.",
          "",
          "  STATUS: ✓ COMPLETE — and you didn't ship one site. You shipped TWO.",
          "",
          "  DEPLOYED ASSETS:",
          "    [✓] LLAMA PARADE — the band site, live and loud",
          "        → https://v0-llama-parade.vercel.app/",
          "    [✓] DORM FUNDS — also live on the grid",
          "        → https://v0-dorm-funds.vercel.app/",
          "",
          "  Stack: v0 + GitHub + Vercel. Solo deployment. Own branch.",
          "  Verdict: You're officially a builder. The internet is editable.",
          "",
          ">>> END TRANSMISSION <<<",
        ],
      };
    }
    if (sub === "2") {
      return {
        type: 'typewriter' as const,
        lines: [
          ">>> CLASSIFIED // EYES ONLY AGENT RMP <<<",
          "",
          "  MISSION 2: READY FOR PRIME TIME",
          "",
          "  OBJECTIVE: Take your two sites from 'it works' to 'it's REAL.'",
          "    — Finish LLAMA PARADE — every button, every page, fully working",
          "    — Finish DORM FUNDS — polish it until it shines",
          "    — Move them off the temp links onto real production domains",
          "    — Squash bugs. Tighten the details. Make it prime-time ready.",
          "",
          "  STATUS: ▶ IN PROGRESS — this is the big one, agent.",
          "           Two live sites. Your job: make them legendary.",
          "",
          ">>> END TRANSMISSION <<<",
        ],
      };
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
    "════════════════════════════════════",
    "",
    "RAVI  — (that's you!)",
    "  Code Name: Agent RMP",
    "  Clearance Level: TOP SECRET",
    "  Status: WIZARD (training)",
    "  Skill: Extreme curiosity levels detected",
    "  Threat Assessment: Creativity increasing rapidly",
    "",
    "KIRAN  — Strategic Operations Commander",
    "  Status: Planning three moves ahead",
    "  Special Ability: Knows every detail before anyone asks",
    "  Weakness: Suspiciously vulnerable to Visa special offers",
    "",
    "TONNIE — Chief Healing Officer",
    "  Status: Extremely kind",
    "  Special Ability: Makes humans feel safe and understood",
    "  Threat Level: Impossible to argue with",
    "",
    "KAVIR  — Audio Systems Specialist",
    "  Status: Probably holding an instrument right now",
    "  Special Ability: Instantly joins any jam session",
    "  Secondary Skill: Certified Ravi ski buddy",
    "  Side Quest: Younger Brother Mode",
    "",
    "ANJ — Creative Director of Everything",
    "  Status: Artistic energies detected",
    "  Special Ability: Makes things cooler just by touching them",
    "  Affiliation: Married to David",
    "",
    "DAVID — Supreme Wizard",
    "  Status: Watching from the control room",
    "  WARNING: Possesses near-unlimited power",
    "  Affiliation: Married to Anj",
    "",
    "ANOKHI — Library Dimension Traveler",
    "  Status: Reading at suspicious speeds",
    "  Special Ability: Can disappear into books for hours",
    "  Passive Skill: Infinite imagination generation",
    "  Secondary Skill: Certified Ravi & Kavir ski buddy",
    "",
    "INDIRA — Soccer Operations Unit",
    "  Status: Fast",
    "  Special Ability: Elite footwork and high energy",
    "  Secondary Skill: Certified Ravi & Kavir ski buddy",
    "  Threat Assessment: Difficult to catch",
    "",
    "════════════════════════════════════",
    "All associates are aware of RaviOS.",
    "Most believe it is harmless.",
    "They are probably wrong.",
  ],

  hint: () => {
    const found = getFoundEggs();
    const remaining = EGG_NAMES.filter((n) => !found.includes(n));
    if (remaining.length === 0) {
      return "You've found them all, agent. The system has no more secrets… for now.";
    }
    const egg = pick(remaining);
    const [line1, line2] = HINT_RHYMES[egg];
    return [line1, line2];
  },

  ravi: (): CommandOutput => ({
    lines: [],
    effect: "ravi",
  }),

  kavir: (): CommandOutput => ({
    lines: [],
    effect: "kavir",
  }),

  "summon dragon": (): CommandOutput => ({
    lines: [
      "         __    __",
      "        /  \\  /  \\",
      "       / /\\ \\/ /\\ \\",
      "      ( ( o )( o ) )",
      "       \\ \\-'--'-/ /",
      "    ____\\/  /\\ \\/____",
      "   /   /\\  /  \\  /\\  \\",
      "  (___/  \\/____\\/  \\___)  ",
      "",
      "  The dragon stirs.",
    ],
    effect: "shake",
  }),

  "hack the mainframe": (): CommandOutput => ({
    lines: [],
    effect: "hacking",
  }),

  // Hidden — intentionally absent from `help`. Drives the hyperspace jump in Terminal.
  "use the force": (): CommandOutput => ({
    lines: [],
    effect: "force",
  }),

  confetti: () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.9 } });
    return "🎉";
  },

  llama: () => {
    const parades = [
      [
        "🦙 INCOMING LLAMA PARADE 🦙",
        "",
        "        ,;;;;;,           ,;;;;;,           ,;;;;;,",
        "       ;;;;;;;;;         ;;;;;;;;;         ;;;;;;;;;",
        "       ;  o   o ;        ;  o   o ;        ;  o   o ;",
        "        \\   ^  /          \\   ^  /          \\   ^  /",
        "         |||||              |||||              |||||",
        "        /|||||\\            /|||||\\            /|||||\\",
        "       /_|||||_\\          /_|||||_\\          /_|||||_\\",
        "",
        "  Three llamas have entered the terminal.",
        "  They appear to be looking for a band.",
        "",
        "  > llamaparade.com is now 0.7% more real.",
      ],
      [
        "🦙 LLAMA SPOTTED 🦙",
        "",
        "         ,;;;;;,",
        "        ;;;;;;;;;",
        "        ;  -   - ;     'sup, agent.'",
        "         \\   o  /",
        "          |||||",
        "         /|||||\\",
        "        /_|||||_\\",
        "",
        "  This llama is judging your code.",
        "  It is also vibing.",
      ],
      [
        "🦙🎺 LLAMA PARADE: FULL DEPLOYMENT 🎺🦙",
        "",
        "   🦙  🎺  🦙  🥁  🦙  🎸  🦙  🎤  🦙",
      ],
    ];
    const out = pick(parades);
    confetti({ particleCount: 80, spread: 100, origin: { y: 0.8 }, colors: ["#fbbf24", "#f472b6", "#4ade80", "#22d3ee"] });
    return out;
  },

  wizard: (): CommandOutput => ({
    lines: [],
    effect: "wizard",
  }),

  // Hidden — THE GRADUATION PROTOCOL. Not in help, not in hints, not in tab
  // completion. One-time ending for the final session, triggered manually.
  graduate: (): CommandOutput => ({
    lines: [],
    effect: "graduate",
  }),
};
