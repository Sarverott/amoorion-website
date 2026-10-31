import React, { useState } from 'react';
import {
  Github,
  Globe,
  Zap,
  Menu,
  X,
  BookOpen,
  Package,
  ExternalLink,
  Heart,
  ChevronDown,
  Layers,
  FileText,
  Sparkles,
} from 'lucide-react';
import { SupportedLanguage, LanguageOption, SiteContent } from '../types/content';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../locales/translations';

interface HeaderProps {
  content: SiteContent;
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenOpenApiStudio: () => void;
  starsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  content,
  currentLang,
  onLanguageChange,
  onOpenOpenApiStudio,
  starsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [subpagesDropdownOpen, setSubpagesDropdownOpen] = useState(false);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#07090e]/85 border-b border-rose-950/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Version Pill */}
        <div className="flex items-center gap-3">
          <a
            href="#home"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-rose-500/50 rounded-lg p-1"
            aria-label="Amoorion Home"
          >
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-md group-hover:bg-rose-500/35 transition-all"></div>
              <img
                src="/assets/generated/logo-icon.png"
                alt="Amoorion Emblem"
                className="relative w-9 h-9 object-contain drop-shadow-[0_0_8px_rgba(225,76,98,0.7)] group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-brand tracking-[0.22em] text-lg sm:text-xl font-bold bg-gradient-to-r from-[#f7d6cd] via-[#fcdad5] to-[#e29d9c] bg-clip-text text-transparent group-hover:from-white group-hover:to-rose-300 transition-all">
                {content.brand.logoText || 'AMOORION'}
              </span>
            </div>
          </a>

          <a
            href={content.links.releasesHtml}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950/70 border border-rose-800/50 text-[11px] font-mono text-rose-300 hover:border-rose-400 hover:text-white transition-colors"
            title="View Releases & Changelog on GitHub Pages"
          >
            <span>v{content.version || '0.4.33'}</span>
            <ExternalLink className="w-2.5 h-2.5 text-rose-400" />
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-rose-100/75" aria-label="Main Navigation">
          <a
            href="#home"
            className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-rose-500/80 after:scale-x-100 after:transition-transform"
          >
            {t.nav.home}
          </a>
          <a
            href="#about"
            className="hover:text-white transition-colors py-1"
          >
            {t.nav.about}
          </a>
          <a
            href="#features"
            className="hover:text-white transition-colors py-1"
          >
            {t.nav.features}
          </a>

          {/* Subpages Menu: Project, Releases, Examples */}
          <div className="relative">
            <button
              onClick={() => setSubpagesDropdownOpen(!subpagesDropdownOpen)}
              className="flex items-center gap-1.5 hover:text-white transition-colors py-1 focus:outline-none"
              aria-expanded={subpagesDropdownOpen}
            >
              <span>Pages &amp; Portal</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${subpagesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {subpagesDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-64 rounded-2xl bg-[#0e111a] border border-rose-900/60 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 divide-y divide-rose-950/50"
                role="menu"
              >
                <div className="p-1">
                  <a
                    href={content.links.projectHtml}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSubpagesDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-rose-100 hover:bg-rose-950/40 hover:text-white transition-colors"
                  >
                    <div>
                      <div className="font-semibold">Project Overview (project.html)</div>
                      <div className="text-[10px] text-gray-400">Platforms, installation &amp; core guide</div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                  </a>

                  <a
                    href={content.links.releasesHtml}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSubpagesDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-rose-100 hover:bg-rose-950/40 hover:text-white transition-colors"
                  >
                    <div>
                      <div className="font-semibold">Releases &amp; Changelog</div>
                      <div className="text-[10px] text-gray-400">Version 0.4.33 packages matrix</div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                  </a>

                  <a
                    href={content.links.examplesIndex}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSubpagesDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-rose-100 hover:bg-rose-950/40 hover:text-white transition-colors"
                  >
                    <div>
                      <div className="font-semibold">20+ Marimo Notebooks</div>
                      <div className="text-[10px] text-gray-400">Interactive examples gallery</div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                  </a>
                </div>

                <div className="p-1">
                  <a
                    href={content.links.llmsTxt}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSubpagesDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-rose-300/80 hover:bg-rose-950/40 hover:text-white transition-colors"
                  >
                    <span>Agent Guide (llms.txt)</span>
                    <ExternalLink className="w-3 h-3 text-rose-400" />
                  </a>
                  <a
                    href={content.links.manifestJson}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSubpagesDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-rose-300/80 hover:bg-rose-950/40 hover:text-white transition-colors"
                  >
                    <span>Site Manifest (manifest.json)</span>
                    <ExternalLink className="w-3 h-3 text-rose-400" />
                  </a>
                </div>
              </div>
            )}
          </div>

          <a
            href={content.links.readthedocs}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors py-1 inline-flex items-center gap-1.5"
          >
            <span>{t.nav.docs}</span>
            <ExternalLink className="w-3 h-3 text-rose-400/70" />
          </a>
        </nav>

        {/* Right Tools: Language Switcher, OpenAPI & Remote Setup Studio, GitHub */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131622]/80 border border-rose-900/40 text-xs font-medium text-rose-200/90 hover:border-rose-400/60 hover:text-white transition-all focus:outline-none"
              aria-label="Select Language"
              aria-expanded={langDropdownOpen}
            >
              <Globe className="w-3.5 h-3.5 text-rose-400" />
              <span>{currentLangObj.flag}</span>
              <span className="uppercase">{currentLangObj.code}</span>
            </button>

            {langDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-44 rounded-xl bg-[#0e111a] border border-rose-900/50 shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                role="menu"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                      currentLang === lang.code
                        ? 'bg-rose-500/15 text-rose-300 font-semibold'
                        : 'text-gray-300 hover:bg-rose-950/30 hover:text-white'
                    }`}
                    role="menuitem"
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* OpenAPI & Remote Setup Studio button (detached architecture) */}
          <button
            onClick={onOpenOpenApiStudio}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141926] border border-rose-700/50 text-xs font-medium text-rose-300 hover:bg-rose-950/50 hover:border-rose-400 hover:text-white transition-all shadow-[0_0_15px_rgba(225,76,98,0.2)] group"
            title="Open OpenAPI Specification & Remote Setup Studio"
            aria-label="Open OpenAPI & Remote Setup Studio"
          >
            <Zap className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
            <span>{t.nav.openApiStudio || 'OpenAPI & Setups'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="OpenAPI Spec Mounted" />
          </button>

          {/* GitHub CTA Button */}
          <a
            href={content.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#111420]/90 border border-rose-800/50 text-xs font-medium text-rose-100 hover:bg-[#1a1f30] hover:border-rose-400 transition-all shadow-md group"
            aria-label="View on GitHub"
          >
            <Github className="w-4 h-4 text-rose-300 group-hover:text-white transition-colors" />
            <span>{t.nav.viewOnGithub}</span>
            {starsCount !== undefined && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-700/40 text-rose-200">
                ★ {starsCount}
              </span>
            )}
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={onOpenOpenApiStudio}
            className="p-2 rounded-lg bg-[#141926] border border-rose-800/40 text-rose-300"
            aria-label="Open OpenAPI Studio"
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#111420] border border-rose-900/40 text-rose-200 hover:text-white"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0d14] border-b border-rose-900/40 px-4 pt-3 pb-6 space-y-4">
          <div className="flex flex-col space-y-2 text-sm text-rose-200">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-950/30"
            >
              {t.nav.home}
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-950/30"
            >
              {t.nav.about}
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-950/30"
            >
              {t.nav.features}
            </a>

            {/* Subpages on mobile */}
            <div className="pt-2 border-t border-rose-950/60 space-y-1">
              <div className="text-[11px] font-mono text-rose-400 px-3 py-1">Official Pages:</div>
              <a
                href={content.links.projectHtml}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg hover:bg-rose-950/30 flex items-center justify-between"
              >
                <span>Project (project.html)</span>
                <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
              </a>
              <a
                href={content.links.releasesHtml}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg hover:bg-rose-950/30 flex items-center justify-between"
              >
                <span>Releases v0.4.33</span>
                <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
              </a>
              <a
                href={content.links.examplesIndex}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg hover:bg-rose-950/30 flex items-center justify-between"
              >
                <span>20+ Marimo Examples</span>
                <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
              </a>
              <a
                href={content.links.readthedocs}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg hover:bg-rose-950/30 flex items-center justify-between"
              >
                <span>ReadTheDocs</span>
                <BookOpen className="w-3.5 h-3.5 text-rose-400" />
              </a>
            </div>
          </div>

          {/* Language Selector in Mobile */}
          <div className="pt-2 border-t border-rose-950/60">
            <div className="text-xs text-rose-400/80 mb-2 px-1">Language:</div>
            <div className="grid grid-cols-3 gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 border ${
                    currentLang === lang.code
                      ? 'bg-rose-600/20 border-rose-400 text-white font-medium'
                      : 'bg-[#111420] border-rose-900/40 text-gray-400'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.code.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href={content.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-rose-900/60 to-rose-700/60 border border-rose-500/40 text-sm font-medium text-white shadow"
            >
              <Github className="w-4 h-4" />
              <span>{t.nav.viewOnGithub}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
