import React, { useState } from 'react';
import { Github, Globe, Sliders, Menu, X, BookOpen, Package, ExternalLink, Heart } from 'lucide-react';
import { SupportedLanguage, LanguageOption, SiteContent } from '../types/content';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../locales/translations';

interface HeaderProps {
  content: SiteContent;
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenCms: () => void;
  starsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  content,
  currentLang,
  onLanguageChange,
  onOpenCms,
  starsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#07090e]/85 border-b border-rose-950/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
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
                // Fallback icon if image is not accessible
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* SVG Winged Heart fallback/accent */}
            <div className="hidden absolute inset-0 items-center justify-center pointer-events-none">
              <Heart className="w-6 h-6 text-[#e14c62] fill-[#e14c62]/80" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-brand tracking-[0.22em] text-lg sm:text-xl font-bold bg-gradient-to-r from-[#f7d6cd] via-[#fcdad5] to-[#e29d9c] bg-clip-text text-transparent group-hover:from-white group-hover:to-rose-300 transition-all">
              {content.brand.logoText || 'AMOORION'}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-rose-100/75" aria-label="Main Navigation">
          <a
            href="#home"
            className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-rose-500/80 after:scale-x-100 after:transition-transform"
          >
            {t.nav.home}
          </a>
          <a
            href="#about"
            className="hover:text-white transition-colors py-1 hover:after:w-full hover:after:bg-rose-400"
          >
            {t.nav.about}
          </a>
          <a
            href="#features"
            className="hover:text-white transition-colors py-1"
          >
            {t.nav.features}
          </a>
          <a
            href="#contribute"
            className="hover:text-white transition-colors py-1"
          >
            {t.nav.contribute}
          </a>
          <a
            href={content.links.readthedocs}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors py-1 inline-flex items-center gap-1.5"
          >
            {t.nav.docs}
            <ExternalLink className="w-3 h-3 text-rose-400/70" />
          </a>
        </nav>

        {/* Right Action Tools: Language Selector, CMS Studio, GitHub */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131622]/80 border border-rose-900/40 text-xs font-medium text-rose-200/90 hover:border-rose-400/60 hover:text-white transition-all focus:outline-none focus:ring-1 focus:ring-rose-500"
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

          {/* Headless CMS Button */}
          <button
            onClick={onOpenCms}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141926] border border-rose-700/40 text-xs font-medium text-rose-300 hover:bg-rose-950/40 hover:border-rose-400/80 hover:text-white transition-all shadow-[0_0_12px_rgba(225,76,98,0.15)] group"
            title="Open Headless CMS Git Studio"
            aria-label="Open Headless CMS Git Studio"
          >
            <Sliders className="w-3.5 h-3.5 text-rose-400 group-hover:rotate-45 transition-transform" />
            <span>{t.nav.contentStudio}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Git Sync Active" />
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
            onClick={onOpenCms}
            className="p-2 rounded-lg bg-[#141926] border border-rose-800/40 text-rose-300"
            aria-label="Open Content Studio"
          >
            <Sliders className="w-4 h-4" />
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
            <a
              href="#contribute"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-950/30"
            >
              {t.nav.contribute}
            </a>
            <a
              href={content.links.readthedocs}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg hover:bg-rose-950/30 flex items-center justify-between"
            >
              <span>{t.nav.docs}</span>
              <BookOpen className="w-4 h-4 text-rose-400" />
            </a>
            <a
              href={content.links.pypi}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg hover:bg-rose-950/30 flex items-center justify-between"
            >
              <span>{t.nav.pypi}</span>
              <Package className="w-4 h-4 text-rose-400" />
            </a>
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
