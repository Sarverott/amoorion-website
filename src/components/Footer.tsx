import React from 'react';
import { Github, BookOpen, Package, Globe, Heart, ExternalLink, Zap, Layers, FileText, Bot } from 'lucide-react';
import { SiteContent, SupportedLanguage } from '../types/content';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../locales/translations';

interface FooterProps {
  content: SiteContent;
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenOpenApiStudio: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  content,
  currentLang,
  onLanguageChange,
  onOpenOpenApiStudio,
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <footer className="relative bg-[#05060a] border-t border-rose-950/60 pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          {/* Brand info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/logo-icon.png"
                alt="Amoorion Emblem"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-brand tracking-[0.2em] text-lg font-bold bg-gradient-to-r from-[#f7d6cd] via-[#fcdad5] to-[#e29d9c] bg-clip-text text-transparent">
                {content.brand.logoText || 'AMOORION'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-800/40 text-rose-300">
                v{content.version || '0.4.33'}
              </span>
            </div>
            <p className="text-sm text-rose-200/70 max-w-sm font-light leading-relaxed">
              {content.brand.tagline || 'Universal tool for administration of chatting and communication platforms.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-rose-300/80 pt-1">
              <span>{t.footer.builtWithLove}</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
          </div>

          {/* Official Subpages Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
              Portal &amp; Subpages
            </h4>
            <ul className="space-y-2 text-sm text-rose-200/75">
              <li>
                <a
                  href={content.links.projectHtml}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Project Overview</span>
                  <ExternalLink className="w-3 h-3 text-rose-400/70 group-hover:text-white" />
                </a>
              </li>
              <li>
                <a
                  href={content.links.releasesHtml}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Releases (v0.4.33)</span>
                  <ExternalLink className="w-3 h-3 text-rose-400/70 group-hover:text-white" />
                </a>
              </li>
              <li>
                <a
                  href={content.links.examplesIndex}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>20+ Marimo Notebooks</span>
                  <ExternalLink className="w-3 h-3 text-rose-400/70 group-hover:text-white" />
                </a>
              </li>
              <li>
                <a
                  href={content.links.llmsTxt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Agent Index (llms.txt)</span>
                  <ExternalLink className="w-3 h-3 text-rose-400/70 group-hover:text-white" />
                </a>
              </li>
              <li>
                <a
                  href={content.links.manifestJson}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Site Manifest (manifest.json)</span>
                  <ExternalLink className="w-3 h-3 text-rose-400/70 group-hover:text-white" />
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation & Tools Column */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
              Sections
            </h4>
            <ul className="space-y-2 text-sm text-rose-200/75">
              <li>
                <a href="#home" className="hover:text-white transition-colors">
                  {t.nav.home}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  {t.nav.features}
                </a>
              </li>
              <li>
                <a href="#contribute" className="hover:text-white transition-colors">
                  {t.nav.contribute}
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenOpenApiStudio}
                  className="hover:text-rose-300 text-rose-400 font-medium transition-colors flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{t.nav.openApiStudio || 'OpenAPI Studio'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Ecosystem Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
              Ecosystem Links
            </h4>
            <div className="space-y-2 text-sm">
              <a
                href={content.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-rose-200/80 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4 text-rose-400" />
                <span>GitHub (sarverott/amoorion)</span>
              </a>
              <a
                href={content.links.readthedocs}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-rose-200/80 hover:text-white transition-colors"
              >
                <BookOpen className="w-4 h-4 text-rose-400" />
                <span>ReadTheDocs Documentation</span>
              </a>
              <a
                href={content.links.pypi}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-rose-200/80 hover:text-white transition-colors"
              >
                <Package className="w-4 h-4 text-rose-400" />
                <span>PyPI (amoorion v0.4.33)</span>
              </a>
              <a
                href={content.links.githubPages}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-rose-200/80 hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4 text-rose-400" />
                <span>sarverott.github.io/amoorion</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar with Language picker and Copyright */}
        <div className="pt-8 border-t border-rose-950/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-rose-300/60">
          <div>
            <span>© {new Date().getFullYear()} Amoorion. {t.footer.allRightsReserved}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Language:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    currentLang === lang.code
                      ? 'bg-rose-950 text-rose-200 border border-rose-700/60 font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {lang.flag} {lang.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
