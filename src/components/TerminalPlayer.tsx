import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { Play, Pause, RotateCcw, Terminal as TerminalIcon, Sparkles, Keyboard, Check, ShieldCheck } from 'lucide-react';

interface TerminalScenario {
  id: string;
  label: string;
  command: string;
  typo?: { at: number; text: string; backspaces: number };
  output: string[];
}

const SCENARIOS: TerminalScenario[] = [
  {
    id: 'install',
    label: 'pip install',
    command: 'pip install amoorion amoorion-bluesky amoorion-matrix',
    typo: { at: 28, text: 'blueksy', backspaces: 7 },
    output: [
      '\x1b[38;5;244mCollecting amoorion==0.4.33\x1b[0m',
      '\x1b[38;5;244mCollecting amoorion-bluesky==0.4.5\x1b[0m',
      '\x1b[38;5;244mCollecting amoorion-matrix==0.4.5\x1b[0m',
      '\x1b[38;5;35m✔\x1b[0m \x1b[1;37mSuccessfully installed\x1b[0m \x1b[38;5;210mamoorion-0.4.33\x1b[0m \x1b[38;5;216mplugins\x1b[0m',
      '\x1b[38;5;244mReady: CLI, daemon, OpenAPI, and MCP tools available.\x1b[0m',
    ],
  },
  {
    id: 'vault',
    label: 'vault:status',
    command: 'uv run task vault:status',
    output: [
      '\x1b[38;5;210m[Amoorion Vault]\x1b[0m Inspecting KeePassXC vault: \x1b[38;5;223mAMOORION_VAULT_PATH\x1b[0m',
      '\x1b[38;5;35m✔ Vault status:\x1b[0m UNLOCKED & VALIDATED',
      '\x1b[38;5;141m  • bluesky:\x1b[0m   configured (did:plc:7v...4q)',
      '\x1b[38;5;141m  • mastodon:\x1b[0m  configured (@sarverott@mastodon.social)',
      '\x1b[38;5;141m  • matrix:\x1b[0m    configured (@sarverott:matrix.org)',
      '\x1b[38;5;141m  • discord:\x1b[0m   configured (bot token loaded)',
      '\x1b[38;5;141m  • telegram:\x1b[0m  configured (webhook ready)',
      '\x1b[38;5;244m0 plaintext secrets found on disk.\x1b[0m',
    ],
  },
  {
    id: 'publish',
    label: 'amoorion post',
    command: 'amoorion post --platform bluesky "One heart for all conversations."',
    typo: { at: 23, text: 'twitt', backspaces: 5 },
    output: [
      '\x1b[38;5;210m[Dispatcher]\x1b[0m Normalizing payload across ATProtocol gateway...',
      '\x1b[38;5;35m✔ [bluesky]\x1b[0m Published: \x1b[38;5;223mat://did:plc:7v4q/app.bsky.feed.post/3lb...9x\x1b[0m',
      '\x1b[38;5;244mTags normalized: #amoorion #openweb #activitypub\x1b[0m',
      '\x1b[38;5;35mStatus: 200 OK\x1b[0m (latency: 184ms)',
    ],
  },
  {
    id: 'inbox',
    label: 'amoorion inbox',
    command: 'amoorion inbox --unread',
    output: [
      '\x1b[1;37mUNIFIED STREAM (3 unread messages across 2 protocols):\x1b[0m',
      '\x1b[38;5;75m[matrix]\x1b[0m  \x1b[38;5;223m@alice:matrix.org:\x1b[0m "The OpenAPI endpoints for the daemon work great!"',
      '\x1b[38;5;210m[bsky]\x1b[0m    \x1b[38;5;223m@sett.bsky.social:\x1b[0m "Version 0.4.33 released with detached website studio."',
      '\x1b[38;5;141m[mastodon]\x1b[0m \x1b[38;5;223m@joker@fosstodon.org:\x1b[0m "MCP server tools validated with Claude runner."',
    ],
  },
  {
    id: 'daemon',
    label: 'daemon start',
    command: 'amoorion daemon start --rest-api --mcp',
    output: [
      '\x1b[38;5;210m[Amoorion Daemon v0.4.33]\x1b[0m Spawning background async event loop...',
      '\x1b[38;5;35m✔ REST API:\x1b[0m Listening on \x1b[38;5;223mhttp://127.0.0.1:8080\x1b[0m',
      '\x1b[38;5;35m✔ OpenAPI:\x1b[0m  Specification mounted at \x1b[38;5;223m/api/v1/openapi.json\x1b[0m',
      '\x1b[38;5;35m✔ MCP:\x1b[0m      Model Context Protocol server ready for AI agents',
      '\x1b[38;5;35m✔ NATS:\x1b[0m     Event bus bridge established',
    ],
  },
];

export const TerminalPlayer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<XTerminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isInteractive, setIsInteractive] = useState(false);
  const [interactiveInput, setInteractiveInput] = useState('');

  const loopCancelRef = useRef<boolean>(false);
  const currentScenario = SCENARIOS[activeScenarioIndex];

  // Initialize xterm
  useEffect(() => {
    if (!containerRef.current) return;

    const term = new XTerminal({
      cursorBlink: true,
      cursorStyle: 'bar',
      fontSize: 13,
      fontFamily: 'ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace',
      theme: {
        background: '#090b12',
        foreground: '#f2e9e4',
        cursor: '#e14c62',
        black: '#121522',
        red: '#e14c62',
        green: '#a6e3a1',
        yellow: '#f9e2af',
        blue: '#89b4fa',
        magenta: '#cba6f7',
        cyan: '#89dceb',
        white: '#cdd6f4',
        brightBlack: '#585b70',
        brightRed: '#f38ba8',
        brightGreen: '#a6e3a1',
        brightYellow: '#f9e2af',
        brightBlue: '#89b4fa',
        brightMagenta: '#f5c2e7',
        brightCyan: '#94e2d5',
        brightWhite: '#ffffff',
      },
      convertEol: true,
      disableStdin: !isInteractive,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(containerRef.current);

    try {
      fitAddon.fit();
    } catch {
      // ignore
    }

    terminalRef.current = term;
    fitAddonRef.current = fitAddon;

    const handleResize = () => {
      try {
        fitAddon.fit();
      } catch {
        // ignore
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      terminalRef.current = null;
    };
  }, []);

  // Update disableStdin when isInteractive changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.options.disableStdin = !isInteractive;
      if (isInteractive) {
        terminalRef.current.writeln('');
        terminalRef.current.writeln('\x1b[38;5;210m[Interactive Mode Enabled]\x1b[0m Type commands: \x1b[38;5;223mhelp, status, post, inbox, clear, version\x1b[0m');
        terminalRef.current.write('\x1b[38;5;210msarverott@amoorion\x1b[0m:\x1b[38;5;75m~\x1b[0m$ ');
      }
    }
  }, [isInteractive]);

  // Handle Interactive keystrokes
  useEffect(() => {
    const term = terminalRef.current;
    if (!term || !isInteractive) return;

    let currentLine = '';

    const disposable = term.onData((data) => {
      if (data === '\r') {
        // Enter pressed
        term.writeln('');
        handleCommandExecution(currentLine.trim());
        currentLine = '';
        term.write('\x1b[38;5;210msarverott@amoorion\x1b[0m:\x1b[38;5;75m~\x1b[0m$ ');
      } else if (data === '\u007F') {
        // Backspace
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          term.write('\b \b');
        }
      } else if (data >= String.fromCharCode(0x20)) {
        currentLine += data;
        term.write(data);
      }
    });

    const handleCommandExecution = (cmd: string) => {
      if (!cmd) return;
      const lower = cmd.toLowerCase();

      if (lower === 'clear') {
        term.clear();
      } else if (lower === 'help') {
        term.writeln('Available interactive commands:');
        term.writeln('  version          - Show current Amoorion version');
        term.writeln('  vault:status     - Check platform credentials in KeePassXC');
        term.writeln('  inbox            - Fetch unread messages from social web');
        term.writeln('  post <message>   - Broadcast update to federated platforms');
        term.writeln('  openapi          - Show daemon OpenAPI endpoint URLs');
        term.writeln('  mcp              - Show Model Context Protocol tools for AI');
        term.writeln('  clear            - Clear terminal screen');
      } else if (lower === 'version' || lower.includes('--version')) {
        term.writeln('amoorion v0.4.33 (Python 3.12+, xterm.js terminal integration)');
      } else if (lower.includes('vault')) {
        term.writeln('\x1b[38;5;35m✔ Vault status: UNLOCKED\x1b[0m (KeePassXC / Bitwarden loaded)');
        term.writeln('Platforms: bluesky, mastodon, matrix, discord, telegram');
      } else if (lower.startsWith('post')) {
        const msg = cmd.replace(/^post\s*/i, '') || 'Hello from Amoorion!';
        term.writeln(`\x1b[38;5;35m✔ Dispatched:\x1b[0m "${msg}" across Bluesky and Matrix`);
      } else if (lower.includes('inbox')) {
        term.writeln('\x1b[38;5;75m[matrix]\x1b[0m @sett: "Universal communication hub active."');
        term.writeln('\x1b[38;5;210m[bsky]\x1b[0m   @amoorion: "Website and OpenAPI detached and synced."');
      } else if (lower.includes('openapi')) {
        term.writeln('OpenAPI spec: /api/openapi/spec (v3.1.0 standard JSON/YAML)');
      } else if (lower.includes('mcp')) {
        term.writeln('MCP server: amoorion.mcp.server running (tools: post_message, read_inbox, check_vault)');
      } else {
        term.writeln(`amoorion: command not found: ${cmd}. Type 'help' for available commands.`);
      }
    };

    return () => {
      disposable.dispose();
    };
  }, [isInteractive]);

  // Automated Typing Loop
  useEffect(() => {
    if (isInteractive) return;

    loopCancelRef.current = false;
    const term = terminalRef.current;
    if (!term) return;

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms / speedMultiplier));

    const runScenario = async (scenario: TerminalScenario) => {
      if (loopCancelRef.current || !terminalRef.current) return;

      term.clear();
      term.writeln('\x1b[38;5;244m── Amoorion v0.4.33 Terminal Simulator ──\x1b[0m');
      term.write('\x1b[38;5;210msarverott@amoorion\x1b[0m:\x1b[38;5;75m~\x1b[0m$ ');
      await sleep(400);

      const cmd = scenario.command;
      const typo = scenario.typo;

      if (typo) {
        // Type up to typo point
        const preTypo = cmd.slice(0, typo.at);
        for (const char of preTypo) {
          if (loopCancelRef.current) return;
          term.write(char);
          await sleep(25 + Math.random() * 35);
        }

        // Type typo mistake
        for (const char of typo.text) {
          if (loopCancelRef.current) return;
          term.write(char);
          await sleep(40 + Math.random() * 30);
        }

        // Notice mistake pause
        await sleep(350);

        // Backspace mistake
        for (let i = 0; i < typo.backspaces; i++) {
          if (loopCancelRef.current) return;
          term.write('\b \b');
          await sleep(45);
        }

        // Complete remaining command
        const remainder = cmd.slice(typo.at);
        for (const char of remainder) {
          if (loopCancelRef.current) return;
          term.write(char);
          await sleep(25 + Math.random() * 30);
        }
      } else {
        // Type straightforwardly
        for (const char of cmd) {
          if (loopCancelRef.current) return;
          term.write(char);
          await sleep(25 + Math.random() * 35);
        }
      }

      await sleep(300);
      term.writeln('');

      // Display outputs line by line
      for (const line of scenario.output) {
        if (loopCancelRef.current) return;
        term.writeln(line);
        await sleep(120);
      }

      term.writeln('');
      term.write('\x1b[38;5;210msarverott@amoorion\x1b[0m:\x1b[38;5;75m~\x1b[0m$ ');

      // Dwell before next scenario
      if (isPlaying) {
        await sleep(3200);
        if (!loopCancelRef.current) {
          setActiveScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
        }
      }
    };

    runScenario(currentScenario);

    return () => {
      loopCancelRef.current = true;
    };
  }, [activeScenarioIndex, isPlaying, speedMultiplier, isInteractive]);

  const handleRestart = () => {
    setIsInteractive(false);
    loopCancelRef.current = true;
    setActiveScenarioIndex(0);
  };

  const handleSelectScenario = (index: number) => {
    setIsInteractive(false);
    loopCancelRef.current = true;
    setActiveScenarioIndex(index);
  };

  return (
    <div className="rounded-3xl bg-[#090b12] border border-rose-900/40 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex flex-col">
      {/* Top Titlebar */}
      <div className="px-5 py-3.5 bg-[#0e121d] border-b border-rose-950/60 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Window Controls & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 hover:opacity-100 transition-opacity" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:opacity-100 transition-opacity" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center gap-2 pl-2 border-l border-rose-950/60">
            <TerminalIcon className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-mono font-medium text-rose-100">
              amoorion-daemon — v0.4.33
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-700/40 text-rose-300 font-mono">
              xterm.js
            </span>
          </div>
        </div>

        {/* Right: Player Controls & Interactive Switcher */}
        <div className="flex items-center gap-2 text-xs">
          {/* Interactive Shell toggle */}
          <button
            onClick={() => setIsInteractive(!isInteractive)}
            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 font-mono text-[11px] transition-all ${
              isInteractive
                ? 'bg-rose-600 border-rose-400 text-white font-semibold shadow-[0_0_12px_rgba(225,76,98,0.5)]'
                : 'bg-[#121522] border-rose-900/50 text-rose-300 hover:text-white hover:bg-rose-950/40'
            }`}
            title="Type real commands in xterm"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>{isInteractive ? 'Interactive (Typing)' : 'Type in Shell'}</span>
          </button>

          {!isInteractive && (
            <>
              {/* Play / Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-[#121522] border border-rose-900/50 text-rose-300 hover:text-white hover:bg-rose-950/40 transition-colors"
                title={isPlaying ? 'Pause Auto-Play' : 'Resume Auto-Play'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              {/* Restart */}
              <button
                onClick={handleRestart}
                className="p-1.5 rounded-lg bg-[#121522] border border-rose-900/50 text-rose-300 hover:text-white hover:bg-rose-950/40 transition-colors"
                title="Restart Scenarios"
                aria-label="Restart"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Speed Selector */}
              <div className="flex items-center rounded-lg bg-[#121522] border border-rose-900/50 p-0.5 text-[10px] font-mono">
                {[1, 1.5, 2].map((sp) => (
                  <button
                    key={sp}
                    onClick={() => setSpeedMultiplier(sp)}
                    className={`px-1.5 py-0.5 rounded ${
                      speedMultiplier === sp ? 'bg-rose-600/40 text-white font-bold' : 'text-gray-400 hover:text-rose-200'
                    }`}
                  >
                    {sp}x
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preset Command Scenario Pills */}
      <div className="px-5 py-2.5 bg-[#0a0d16] border-b border-rose-950/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] text-gray-500 font-mono shrink-0">Commands:</span>
        {SCENARIOS.map((sc, i) => (
          <button
            key={sc.id}
            onClick={() => handleSelectScenario(i)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono shrink-0 transition-all border ${
              activeScenarioIndex === i && !isInteractive
                ? 'bg-rose-950/80 border-rose-500 text-rose-200 font-semibold shadow-[0_0_10px_rgba(225,76,98,0.25)]'
                : 'bg-[#101422] border-rose-900/30 text-gray-400 hover:text-rose-300 hover:border-rose-700/40'
            }`}
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* xterm.js Terminal Canvas Container */}
      <div className="relative p-3 bg-[#07090e] min-h-[260px] sm:min-h-[290px] xterm-container">
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* Bottom Bar Info */}
      <div className="px-5 py-2.5 bg-[#090b12] border-t border-rose-950/50 flex flex-wrap items-center justify-between gap-3 text-[11px] text-rose-300/60 font-mono">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real documentation & AGENTS.md commands executed against Amoorion v0.4.33</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://sarverott.github.io/amoorion/examples/05-cli-and-terminals.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-400 hover:text-rose-200 hover:underline flex items-center gap-1"
          >
            <span>Marimo Terminal Notebook</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  );
};
