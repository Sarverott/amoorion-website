import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { MeetAmoorionSection } from './components/MeetAmoorionSection';
import { EcosystemSection } from './components/EcosystemSection';
import { Footer } from './components/Footer';
import { OpenApiSetupModal } from './components/OpenApiSetupModal';
import { DEFAULT_SITE_CONTENT } from './data/default-content';
import { SiteContent, SupportedLanguage } from './types/content';
import { mergeContentWithDefaults } from './utils/content-parser';
import { Zap, ExternalLink } from 'lucide-react';

export default function App() {
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem('amoorion_site_content_v0433');
      if (saved) {
        return mergeContentWithDefaults(JSON.parse(saved), DEFAULT_SITE_CONTENT);
      }
    } catch {
      // ignore
    }
    return DEFAULT_SITE_CONTENT;
  });

  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('amoorion_lang') as SupportedLanguage;
      if (saved && ['en', 'pl', 'es', 'de', 'ja', 'fr'].includes(saved)) {
        return saved;
      }
      const navLang = navigator.language.slice(0, 2).toLowerCase();
      if (['en', 'pl', 'es', 'de', 'ja', 'fr'].includes(navLang)) {
        return navLang as SupportedLanguage;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const [isOpenApiStudioOpen, setIsOpenApiStudioOpen] = useState(false);
  const [repoStats, setRepoStats] = useState<{ stars?: number; forks?: number }>({});

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLang(lang);
    try {
      localStorage.setItem('amoorion_lang', lang);
    } catch {
      // ignore
    }
  };

  const handleSaveContent = (updated: SiteContent) => {
    setContent(updated);
    try {
      localStorage.setItem('amoorion_site_content_v0433', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Fetch repository stats from decoupled backend route
  useEffect(() => {
    fetch('/api/github/repo?owner=sarverott&repo=amoorion')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.stars === 'number') {
          setRepoStats({ stars: data.stars, forks: data.forks });
        }
      })
      .catch((err) => console.warn('Could not fetch repo stats:', err));
  }, []);

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f2e9e4] flex flex-col font-sans selection:bg-[#e14c62] selection:text-white">
      {/* Top Navigation Header */}
      <Header
        content={content}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onOpenOpenApiStudio={() => setIsOpenApiStudioOpen(true)}
        starsCount={repoStats.stars}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Section 1: Hero Section */}
        <HeroSection content={content} currentLang={currentLang} />

        {/* Section 2: Features Section with Subpage Link Popups */}
        <FeaturesSection content={content} currentLang={currentLang} />

        {/* Section 3: Meet Amoorion */}
        <MeetAmoorionSection content={content} currentLang={currentLang} />

        {/* Section 4: Ecosystem with xterm.js Terminal & Highlighted Code & Subpages */}
        <EcosystemSection content={content} currentLang={currentLang} />
      </main>

      {/* Footer */}
      <Footer
        content={content}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onOpenOpenApiStudio={() => setIsOpenApiStudioOpen(true)}
      />

      {/* OpenAPI Explorer & Remote Setup Modal (Decoupled Architecture) */}
      <OpenApiSetupModal
        isOpen={isOpenApiStudioOpen}
        onClose={() => setIsOpenApiStudioOpen(false)}
        currentContent={content}
        onSaveContent={handleSaveContent}
        currentLang={currentLang}
      />

      {/* Floating Quick OpenAPI & Remote Setup button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsOpenApiStudioOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#141926]/90 backdrop-blur-md border border-rose-600/50 text-xs font-semibold text-rose-200 hover:text-white hover:bg-rose-950/70 hover:border-rose-400 shadow-[0_0_20px_rgba(225,76,98,0.3)] transition-all hover:scale-105 active:scale-95 group"
          title="Open OpenAPI & Remote Setup Studio"
          aria-label="Open OpenAPI & Remote Setup Studio"
        >
          <Zap className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          <span>OpenAPI &amp; Setups</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>
    </div>
  );
}
