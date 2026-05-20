import confetti from "canvas-confetti";

export const CLEAR_SENTINEL = "__CLEAR__";

export type CommandEffect = "shake" | "hacking" | "ravi" | "kavir";

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
};

export const commands: Record<string, Handler> = {
  help: () => [
    "AVAILABLE COMMANDS",
    "──────────────────────────────────────",
    "  help     — show this list",
    "  clear    — clear the terminal",
    "  level    — check your current wizard level",
    "  mission  — list missions (or: mission 0/1/2)",
    "  joke     — hear a programmer joke",
    "  family   — known associates report",
    "  wizard   — summon the ASCII wizard",
    "──────────────────────────────────────",
    "...there may be more… try hint",
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
          "  STATUS: AVAILABLE — awaiting your move.",
          "",
          ">>> INCOMING TRANSMISSION // EYES ONLY <<<",
          "",
          "  Before the first briefing, the system requests intel.",
          "",
          "  No forms.",
          "  No grades.",
          "  No wrong answers.",
          "",
          "  Just curiosity.",
          "",
          "  — What websites do you visit the most?",
          "  — What games, apps, or tools light up your brain?",
          "  — Who are your favorite creators?",
          "  — What do you wish existed on the internet but doesn't?",
          "  — What's the weirdest website idea you've ever had?",
          "  — If you had internet powers, what would they be?",
          "  — What do you hope to learn?",
          "",
          "  Bring your answers to the first briefing.",
          "",
          "  Optional:",
          "  transmit early intelligence to:",
          "  dtemple@gmail.com",
          "",
          ">>> END TRANSMISSION <<<",
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
          "    — Design your personal homepage",
          "    — Add favorite things, funny buttons, weird interactions",
          "    — Make it yours. Make it strange. Make it real.",
          "",
          "  STATUS: LOCKED — complete Mission 0 first.",
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
    "INDIRIA — Soccer Operations Unit",
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

  confetti: () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.9 } });
    return "🎉";
  },

  wizard: () => [
    "SCANNING AGENT ID...",
    "",
    "AGENT RMP VERIFIED",
    "",
    "ARCANE TERMINAL LINK ESTABLISHED",
    "",
    "REALITY EDIT MODE ENABLED",
    "",
    "                          /\\",
    "                         /  \\",
    "                        / /\\ \\",
    "                       / /  \\ \\",
    "                      /_/____\\_\\",
    "                         ||||",
    "                     .-\"\"\"\"\"\"-.",
    "                   .'  .--.    '.",
    "                  /   /    \\     \\",
    "                 |   | 0  0 |    |",
    "                 |   |  --  |    |",
    "                 |   | \\__/ |    |",
    "                  \\   \\____/    /",
    '               .-".__________."-.',
    "              /  / /  ||  \\ \\   \\",
    "             /__/ /___||___\\_\\___\\",
    "                /____/  \\____\\",
    "",
    '  "Greetings, Agent RMP.',
    "",
    "   The builders have been expecting you.",
    "",
    "   Most humans scroll.",
    "   A few learn to build.",
    "",
    '   The internet is now yours to shape."',
  ],
};
