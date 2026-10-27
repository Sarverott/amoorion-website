import React, { useState } from 'react';
import { ArrowRight, Github, Copy, Check, Terminal, Sparkles, MessageSquareHeart } from 'lucide-react';
import { SiteContent, SupportedLanguage } from '../types/content';
import { TRANSLATIONS } from '../locales/translations';

interface HeroSectionProps {
  content: SiteContent;
  currentLang: SupportedLanguage;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ content, currentLang }) => {
  const [copied, setCopied] = useState(false);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleCopyPip = () => {
    navigator.clipboard.writeText(content.hero.pipCommand || 'pip install amoorion');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="home" className="relative pt-6 pb-20 md:py-24 overflow-hidden">
      {/* Background ambient lighting glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#e14c62]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-[#9a2c48]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-8 z-10">
            {/* Early Stage Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1b121e]/90 border border-rose-800/40 shadow-[0_0_15px_rgba(225,76,98,0.15)] backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e14c62]"></span>
              </span>
              <span className="text-xs font-medium text-rose-200 tracking-wide">
                {t.hero.badge || content.hero.badge}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-serif tracking-tight leading-[1.08] text-[#fbf6f3]">
                {t.hero.title || content.hero.title}
              </h1>
              <p className="text-lg sm:text-xl text-rose-100/75 max-w-xl font-normal leading-relaxed">
                {t.hero.subtitle || content.hero.subtitle}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={content.hero.primaryCtaLink}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#d93856] via-[#e24c64] to-[#ec6378] text-white text-sm sm:text-base font-semibold shadow-[0_0_30px_rgba(225,76,98,0.45)] hover:shadow-[0_0_40px_rgba(225,76,98,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all group"
              >
                <span>{t.hero.exploreBtn || content.hero.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href={content.hero.secondaryCtaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#121522]/90 border border-rose-900/60 hover:border-rose-400 text-rose-200 hover:text-white text-sm sm:text-base font-medium shadow-md hover:bg-[#181c2d] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Github className="w-4 h-4 text-rose-300" />
                <span>{t.hero.githubBtn || content.hero.secondaryCtaText}</span>
              </a>
            </div>

            {/* Terminal Quick Install Pip block */}
            <div className="pt-4 max-w-lg">
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#0c0f18]/90 border border-rose-950/70 shadow-inner group hover:border-rose-800/60 transition-colors">
                <div className="flex items-center gap-2.5 text-xs font-mono text-rose-200/90 overflow-x-auto scrollbar-none">
                  <Terminal className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="text-rose-500 font-bold">$</span>
                  <span className="text-rose-100">{content.hero.pipCommand}</span>
                </div>
                <button
                  onClick={handleCopyPip}
                  className="ml-3 p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white transition-all shrink-0 focus:outline-none"
                  aria-label={copied ? t.hero.copied : t.hero.copyCommand}
                  title="Copy install command"
                >
                  {copied ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-300">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: High-fidelity Mockup Artwork (Steampunk winged kitty at library desk) */}
          <div className="lg:col-span-6 xl:col-span-5 relative flex items-center justify-center">
            {/* Ambient ornate back-frame */}
            <div className="relative w-full max-w-md sm:max-w-lg rounded-3xl overflow-hidden border border-rose-900/40 shadow-[0_0_50px_rgba(225,76,98,0.22)] bg-[#0d101a] group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent z-10 opacity-70 pointer-events-none" />
              
              <img
                src="/assets/generated/hero-cat.png"
                alt="Amoorion mascot - winged horned steampunk kitten orchestrating conversations across platforms"
                className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                onError={(e) => {
                  // Fallback to full asset if sub-crop isn't found
                  (e.target as HTMLImageElement).src = '/assets/aistudio/Amoorion__One_hub__many_connections_e358613b.png';
                }}
              />

              {/* Floating Interactive Live Cards Over Artwork */}
              <div className="absolute bottom-6 left-6 right-6 z-20 bg-[#0f1320]/85 backdrop-blur-md border border-rose-800/40 rounded-2xl p-3.5 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-rose-900 flex items-center justify-center shadow-[0_0_12px_rgba(225,76,98,0.5)]">
                    <MessageSquareHeart className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-rose-100">Universal Dispatcher</div>
                    <div className="text-[11px] text-rose-300/70">Routing across Fediverse, Matrix & Web</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950/90 border border-rose-700/50 text-rose-300 font-mono">
                  v0.1.0-alpha
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
