import React, { useState } from 'react';
import { Github, BookOpen, Package, Globe, GitBranch, GitPullRequest, Copy, Check, Terminal, Code2 } from 'lucide-react';
import { SiteContent, SupportedLanguage } from '../types/content';

interface EcosystemSectionProps {
  content: SiteContent;
  currentLang: SupportedLanguage;
}

export const EcosystemSection: React.FC<EcosystemSectionProps> = ({ content }) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const sampleCode = `import asyncio
from amoorion import AmoorionHub

async def main():
    # Initialize the unified communication hub
    hub = AmoorionHub()
    
    # Connect with fediverse, matrix, and custom protocol bridges
    await hub.connect_bridges()
    
    # Broadcast across multiple platforms with a single heart
    await hub.publish(
        message="Hello open social web! Transmitted via Amoorion.",
        tags=["amoorion", "fediverse", "openweb"]
    )

if __name__ == "__main__":
    asyncio.run(main())`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sampleCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="contribute" className="relative py-24 bg-[#0a0d16] border-t border-rose-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-300 text-xs font-mono">
            <span>Ecosystem & Developer Toolkit</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#fbf6f3]">
            Build with Amoorion
          </h2>
          <p className="text-sm sm:text-base text-rose-200/70 font-light">
            Everything you need to integrate, extend protocols, or deploy your personal communication bridge.
          </p>
        </div>

        {/* 4 Core Web Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Repository */}
          <a
            href={content.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl bg-[#0f121d] border border-rose-900/35 hover:border-rose-400/70 hover:bg-[#141827] transition-all group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-950/50 border border-rose-800/40 flex items-center justify-center text-rose-300 group-hover:text-white group-hover:scale-105 transition-all">
                <Github className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif text-rose-100 group-hover:text-white">GitHub Repository</h3>
                <p className="text-xs text-rose-300/70 mt-1">
                  Source code, issue tracking, and community pull requests at sarverott/amoorion.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-rose-400 group-hover:text-rose-200">
              <span>View Source</span>
              <span>→</span>
            </div>
          </a>

          {/* 2. Documentation */}
          <a
            href={content.links.readthedocs}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl bg-[#0f121d] border border-rose-900/35 hover:border-rose-400/70 hover:bg-[#141827] transition-all group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-950/50 border border-rose-800/40 flex items-center justify-center text-rose-300 group-hover:text-white group-hover:scale-105 transition-all">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif text-rose-100 group-hover:text-white">ReadTheDocs</h3>
                <p className="text-xs text-rose-300/70 mt-1">
                  Step-by-step guides, API reference, daemon architecture, and quickstart tutorials.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-rose-400 group-hover:text-rose-200">
              <span>Read Manual</span>
              <span>→</span>
            </div>
          </a>

          {/* 3. PyPI Package */}
          <a
            href={content.links.pypi}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl bg-[#0f121d] border border-rose-900/35 hover:border-rose-400/70 hover:bg-[#141827] transition-all group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-950/50 border border-rose-800/40 flex items-center justify-center text-rose-300 group-hover:text-white group-hover:scale-105 transition-all">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif text-rose-100 group-hover:text-white">PyPI Python Hub</h3>
                <p className="text-xs text-rose-300/70 mt-1">
                  Installable via pip. Ready for async python projects and automation scripts.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-rose-400 group-hover:text-rose-200">
              <span>PyPI Release</span>
              <span>→</span>
            </div>
          </a>

          {/* 4. GitHub Pages Deployment */}
          <a
            href={content.links.githubPages}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl bg-[#0f121d] border border-rose-900/35 hover:border-rose-400/70 hover:bg-[#141827] transition-all group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-950/50 border border-rose-800/40 flex items-center justify-center text-rose-300 group-hover:text-white group-hover:scale-105 transition-all">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif text-rose-100 group-hover:text-white">GitHub Pages</h3>
                <p className="text-xs text-rose-300/70 mt-1">
                  Live production site published at sarverott.github.io/amoorion.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-rose-400 group-hover:text-rose-200">
              <span>Visit Portal</span>
              <span>→</span>
            </div>
          </a>
        </div>

        {/* Python Async SDK Quick Example & Terminal Snippet */}
        <div className="rounded-3xl bg-[#090b12] border border-rose-900/40 overflow-hidden shadow-2xl">
          <div className="px-6 py-4 bg-[#0e121e] border-b border-rose-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/30" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/30" />
              </div>
              <span className="text-xs font-mono text-rose-200/80">quickstart_hub.py</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-xs font-mono text-rose-300 hover:text-white transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="p-6 text-xs sm:text-sm font-mono text-rose-100/90 overflow-x-auto leading-relaxed bg-[#07090e]">
            <code>{sampleCode}</code>
          </pre>
        </div>
      </div>
    </section>
  );
};
