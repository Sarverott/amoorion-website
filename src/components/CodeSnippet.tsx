import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import { Copy, Check, ExternalLink, Code2 } from 'lucide-react';

interface CodeSnippetProps {
  githubRepoUrl?: string;
}

const SNIPPETS = [
  {
    id: 'python',
    label: 'Async Python (v0.4.33)',
    language: 'python',
    marimoLink: 'https://sarverott.github.io/amoorion/examples/01-getting-started.html',
    code: `import asyncio
from amoorion import AmoorionHub

async def main():
    # Initialize unified communication hub (v0.4.33)
    hub = AmoorionHub()

    # Load credentials safely from KeePassXC / Bitwarden vault
    await hub.vault.unlock()

    # Connect communication bridges (Bluesky, Matrix, Mastodon)
    await hub.connect_bridges()

    # Broadcast message across multiple platforms with one heart
    result = await hub.publish(
        message="Hello open social web! Transmitted via Amoorion.",
        platforms=["bluesky", "mastodon", "matrix"],
        tags=["amoorion", "openweb", "decentralized"]
    )
    print(f"Dispatched: {result.published_count} platforms connected.")

if __name__ == "__main__":
    asyncio.run(main())`,
  },
  {
    id: 'rest',
    label: 'OpenAPI REST Client',
    language: 'python',
    marimoLink: 'https://sarverott.github.io/amoorion/examples/12-rest-api.html',
    code: `import httpx

# Interfacing with local Amoorion Daemon OpenAPI endpoint
BASE_URL = "http://localhost:8080/api/v1"

with httpx.Client(base_url=BASE_URL) as client:
    # 1. Inspect daemon and active platform plugins
    platforms = client.get("/platforms").json()
    print("Active drivers:", [p["name"] for p in platforms["plugins"]])

    # 2. Publish cross-platform post via standard OpenAPI schema
    payload = {
        "message": "Broadcasting from decoupled OpenAPI client!",
        "platforms": ["bluesky", "matrix"],
        "dry_run": False
    }
    response = client.post("/publish", json=payload)
    print("Post status:", response.status_code, response.json())`,
  },
  {
    id: 'mcp',
    label: 'MCP Agent Tool',
    language: 'python',
    marimoLink: 'https://sarverott.github.io/amoorion/examples/13-mcp-in-action.html',
    code: `from amoorion.mcp import create_mcp_server

# Mount Model Context Protocol for Claude, Codex & Gemini
server = create_mcp_server(name="amoorion-hub", version="0.4.33")

@server.tool(name="post_social_update", description="Broadcast across federated platforms")
async def post_social_update(message: str, platforms: list[str]) -> dict:
    hub = server.app.state.hub
    res = await hub.publish(message=message, platforms=platforms)
    return {"published": True, "details": res.summary}`,
  },
  {
    id: 'bash',
    label: 'CLI & Taskfile',
    language: 'bash',
    marimoLink: 'https://sarverott.github.io/amoorion/examples/05-cli-and-terminals.html',
    code: `# Install core and protocol drivers from PyPI
pip install amoorion amoorion-bluesky amoorion-matrix amoorion-mastodon

# Check vault status (zero plaintext secrets on disk)
uv run task vault:status

# Broadcast directly from command-line interface
amoorion post --platform bluesky "One heart for all your conversations."

# Read aggregated multi-platform inbox
amoorion inbox --unread

# Summon daemon with HTTP REST API & MCP server
amoorion daemon start --rest-api --mcp`,
  },
];

export const CodeSnippet: React.FC<CodeSnippetProps> = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const current = SNIPPETS[activeTab];

  useEffect(() => {
    Prism.highlightAll();
  }, [activeTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl bg-[#090b12] border border-rose-900/40 overflow-hidden shadow-2xl flex flex-col">
      {/* Tab bar */}
      <div className="px-5 py-3.5 bg-[#0e121e] border-b border-rose-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {SNIPPETS.map((snippet, idx) => (
            <button
              key={snippet.id}
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                activeTab === idx
                  ? 'bg-rose-950/80 border-rose-500/60 text-white font-semibold shadow-[0_0_12px_rgba(225,76,98,0.3)]'
                  : 'bg-[#121522] border-rose-950/40 text-rose-300/70 hover:text-white hover:bg-rose-950/30'
              }`}
            >
              {snippet.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={current.marimoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#141827] border border-rose-900/40 hover:border-rose-400 text-rose-300 hover:text-white text-xs font-mono transition-colors"
            title="Open interactive Marimo notebook for this code"
          >
            <span>Marimo Notebook</span>
            <ExternalLink className="w-3 h-3 text-rose-400" />
          </a>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-700/50 text-xs font-mono text-rose-200 hover:text-white transition-colors"
            aria-label="Copy code to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Code with Prism syntax highlighting */}
      <div className="p-5 overflow-x-auto bg-[#07090e] font-mono text-xs sm:text-sm leading-relaxed text-rose-100">
        <pre className={`language-${current.language}`}>
          <code className={`language-${current.language}`}>{current.code}</code>
        </pre>
      </div>

      {/* Bottom info */}
      <div className="px-5 py-2.5 bg-[#0a0d16] border-t border-rose-950/50 flex items-center justify-between text-[11px] text-rose-300/60 font-mono">
        <span>Language: {current.language} • Amoorion v0.4.33</span>
        <span>Runs with Python 3.12+ (uv or pip)</span>
      </div>
    </div>
  );
};
