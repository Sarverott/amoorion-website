import React from 'react';
import { Github, BookOpen, Package, Globe, Heart } from 'lucide-react';
import { SiteContent, SupportedLanguage } from '../types/content';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../locales/translations';

interface FooterProps {
  content: SiteContent;
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenCms: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  content,
  currentLang,
  onLanguageChange,
  onOpenCms,
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <footer className="relative bg-[#05060a] border-t border-rose-950/60 pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          {/* Brand info */}
          <div className="md:col-span-5 space-y-4">
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
            </div>
            <p className="text-sm text-rose-200/70 max-w-sm font-light leading-relaxed">
              {content.featuresSection.subtitle}
            </p>
            <div className="flex items-center gap-2 text-xs text-rose-300/80 pt-1">
              <span>{t.footer.builtWithLove}</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
              Navigation & Resources
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
                  onClick={onOpenCms}
                  className="hover:text-rose-300 text-rose-400 font-medium transition-colors"
                >
                  {t.nav.contentStudio}
                </button>
              </li>
            </ul>
          </div>

          {/* Ecosystem Column */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
              Official Ecosystem Links
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
                <span>Documentation (ReadTheDocs)</span>
              </a>
              <a
                href={content.links.pypi}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-rose-200/80 hover:text-white transition-colors"
              >
                <Package className="w-4 h-4 text-rose-400" />
                <span>Python Package (PyPI)</span>
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
