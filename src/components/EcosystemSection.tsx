import React, { useState } from 'react';
import {
  Github,
  BookOpen,
  Package,
  Globe,
  FileCode,
  Layers,
  Sparkles,
  ExternalLink,
  Bot,
  Terminal as TerminalIcon,
  Code2,
  FileText,
  Shield,
} from 'lucide-react';
import { SiteContent, SupportedLanguage } from '../types/content';
import { TerminalPlayer } from './TerminalPlayer';
import { CodeSnippet } from './CodeSnippet';

interface EcosystemSectionProps {
  content: SiteContent;
  currentLang: SupportedLanguage;
}

export const EcosystemSection: React.FC<EcosystemSectionProps> = ({ content }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'protocols' | 'daemons' | 'workflows'>('all');

  const filteredExamples =
    activeCategory === 'all'
      ? content.featuredExamples
      : content.featuredExamples.filter((ex) => ex.category === activeCategory);

  return (
    <section id="contribute" className="relative py-24 bg-[#0a0d16] border-t border-rose-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-300 text-xs font-mono">
            <span>Ecosystem &amp; Developer Toolkit • v0.4.33</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#fbf6f3]">
            Build, Automate &amp; Interface
          </h2>
          <p className="text-sm sm:text-base text-rose-200/70 font-light">
            Everything you need to integrate, inspect OpenAPI schemas, run daemons, or script cross-platform communications.
          </p>
        </div>

        {/* 1. Interactive xterm.js Terminal Simulator */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-200">
              <TerminalIcon className="w-4 h-4 text-rose-400" />
              <h3 className="text-base font-semibold text-rose-100">Interactive Terminal &amp; Animated CLI</h3>
            </div>
            <span className="text-xs text-rose-400/80 font-mono hidden sm:inline">
              Simulating AGENTS.md &amp; docs commands with backspacing
            </span>
          </div>
          <TerminalPlayer />
        </div>

        {/* 2. Syntax-Highlighted Code Example Block */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-200">
              <Code2 className="w-4 h-4 text-rose-400" />
              <h3 className="text-base font-semibold text-rose-100">Core Architecture &amp; Integration SDK</h3>
            </div>
            <span className="text-xs text-rose-400/80 font-mono hidden sm:inline">
              Python 3.12+ • OpenAPI 3.1 • MCP Server
            </span>
          </div>
          <CodeSnippet githubRepoUrl={content.links.github} />
        </div>

        {/* 3. Official Subpages & Portal Links Grid (Revealing Hidden Pages) */}
        <div className="space-y-6 pt-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl font-serif text-[#fbf6f3]">Official Pages &amp; Documentation Portal</h3>
            <p className="text-xs text-rose-300/70">
              All subpages published from the main repository directly accessible from here:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. project.html */}
            <a
              href={content.links.projectHtml}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-[#0f121d] border border-rose-900/35 hover:border-rose-400/70 hover:bg-[#141827] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-rose-950/50 border border-rose-800/40 flex items-center justify-center text-rose-300 group-hover:text-white group-hover:scale-105 transition-all">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-serif text-rose-100 group-hover:text-white">project.html</h4>
                  <p className="text-xs text-rose-300/70 mt-1">
                    Complete project overview, platforms matrix, daemon instructions, and early-stage roadmap.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-rose-400 group-hover:text-rose-200">
                <span>Open project.html</span>
                <span>→</span>
              </div>
            </a>

            {/* 2. releases.html */}
            <a
              href={content.links.releasesHtml}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-[#0f121d] border border-rose-900/35 hover:border-rose-400/70 hover:bg-[#141827] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-rose-950/50 border border-rose-800/40 flex items-center justify-center text-rose-300 group-hover:text-white group-hover:scale-105 transition-all">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-serif text-rose-100 group-hover:text-white">releases.html</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300">
                      v0.4.33
                    </span>
                  </div>
                  <p className="text-xs text-rose-300/70 mt-1">
                    Release notes, package versions table, and milestone changelogs across all drivers.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-rose-400 group-hover:text-rose-200">
                <span>View Releases</span>
                <span>→</span>
              </div>
            </a>

            {/* 3. examples/index.html */}
            <a
              href={content.links.examplesIndex}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-[#0f121d] border border-rose-900/35 hover:border-rose-400/70 hover:bg-[#141827] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-rose-950/50 border border-rose-800/40 flex items-center justify-center text-rose-300 group-hover:text-white group-hover:scale-105 transition-all">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-serif text-rose-100 group-hover:text-white">examples/index.html</h4>
                  <p className="text-xs text-rose-300/70 mt-1">
                    Gallery of 20+ interactive Marimo computational notebooks demonstrating every single feature.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-rose-400 group-hover:text-rose-200">
                <span>Browse Examples</span>
                <span>→</span>
              </div>
            </a>

            {/* 4. Agents & llms.txt */}
            <a
              href={content.links.llmsTxt}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-[#0f121d] border border-rose-900/35 hover:border-rose-400/70 hover:bg-[#141827] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-rose-950/50 border border-rose-800/40 flex items-center justify-center text-rose-300 group-hover:text-white group-hover:scale-105 transition-all">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-serif text-rose-100 group-hover:text-white">llms.txt &amp; Skills</h4>
                  <p className="text-xs text-rose-300/70 mt-1">
                    Structured index and SKILL.md for autonomous AI agents, Codex, Claude Code, and Gemini.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-rose-400 group-hover:text-rose-200">
                <span>Open llms.txt</span>
                <span>→</span>
              </div>
            </a>
          </div>
        </div>

        {/* 4. Interactive Marimo Computational Notebooks Gallery */}
        <div className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-serif text-[#fbf6f3]">
                Interactive Marimo Notebooks
              </h3>
              <p className="text-xs text-rose-300/70">
                Explore live executable notebooks generated by the project build pipeline:
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0e121e] border border-rose-950/60 overflow-x-auto">
              {(['all', 'core', 'protocols', 'daemons', 'workflows'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                    activeCategory === cat
                      ? 'bg-rose-600/40 text-white font-semibold'
                      : 'text-gray-400 hover:text-rose-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredExamples.map((ex) => (
              <a
                key={ex.id}
                href={ex.htmlPath}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-[#0d101a] border border-rose-950/70 hover:border-rose-400/70 hover:bg-[#121625] transition-all group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-800/40 text-rose-300">
                      #{ex.id} {ex.badge}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <h4 className="text-sm font-semibold text-rose-100 group-hover:text-white">
                    {ex.title}
                  </h4>
                  <p className="text-xs text-rose-300/70 leading-relaxed font-light">
                    {ex.description}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-rose-950/40 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                  <span className="capitalize text-rose-400/80">{ex.category}</span>
                  <span className="group-hover:text-rose-300 group-hover:underline">Launch →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
