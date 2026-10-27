import React, { useState } from 'react';
import { Feather, MessageSquare, Share2, Sparkles, ChevronRight, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import { SiteContent, SupportedLanguage, FeatureCardContent } from '../types/content';
import { TRANSLATIONS } from '../locales/translations';

interface FeaturesSectionProps {
  content: SiteContent;
  currentLang: SupportedLanguage;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ content, currentLang }) => {
  const [selectedCard, setSelectedCard] = useState<FeatureCardContent | null>(null);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const getIcon = (type: string) => {
    switch (type) {
      case 'publish':
        return <Feather className="w-5 h-5 text-rose-300" />;
      case 'reply':
        return <MessageSquare className="w-5 h-5 text-rose-300" />;
      case 'connect':
      default:
        return <Share2 className="w-5 h-5 text-rose-300" />;
    }
  };

  const getLocalizedTitle = (card: FeatureCardContent) => {
    if (card.icon === 'publish') return t.features.publishTitle || card.title;
    if (card.icon === 'reply') return t.features.replyTitle || card.title;
    if (card.icon === 'connect') return t.features.connectTitle || card.title;
    return card.title;
  };

  const getLocalizedDesc = (card: FeatureCardContent) => {
    if (card.icon === 'publish') return t.features.publishDesc || card.description;
    if (card.icon === 'reply') return t.features.replyDesc || card.description;
    if (card.icon === 'connect') return t.features.connectDesc || card.description;
    return card.description;
  };

  return (
    <section id="features" className="relative py-24 bg-[#080a11]/90 border-t border-rose-950/30">
      {/* Delicate center ornament flourish */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-3 text-rose-400/40">
          <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-rose-500/40" />
          <span className="text-rose-400 text-sm">❦</span>
          <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-rose-500/40" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading matching mockup */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#fbf6f3] tracking-tight">
            {t.features.sectionTitle || content.featuresSection.title}
          </h2>
          <p className="text-base sm:text-lg text-rose-200/70 leading-relaxed font-light">
            {t.features.sectionSubtitle || content.featuresSection.subtitle}
          </p>
        </div>

        {/* 3 Arched Feature Cards matching mockup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8">
          {content.featuresSection.cards.map((card) => {
            const title = getLocalizedTitle(card);
            const desc = getLocalizedDesc(card);

            return (
              <div
                key={card.id}
                className="group relative rounded-t-[44px] rounded-b-3xl overflow-hidden bg-[#0c0f18] border border-rose-800/40 hover:border-rose-400/80 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:shadow-[0_0_40px_rgba(225,76,98,0.3)] flex flex-col"
              >
                {/* Subtle top arch accent highlight */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent opacity-60" />

                {/* Top Section: Glowing Icon and Typography */}
                <div className="p-7 sm:p-8 text-center space-y-4 relative z-10">
                  {/* Glowing Icon Circle */}
                  <div className="mx-auto w-14 h-14 rounded-full bg-[#18111d] border border-rose-700/60 flex items-center justify-center shadow-[0_0_20px_rgba(225,76,98,0.35)] group-hover:scale-110 group-hover:shadow-[0_0_28px_rgba(225,76,98,0.7)] group-hover:border-rose-300 transition-all">
                    {getIcon(card.icon)}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#faedea] group-hover:text-white transition-colors tracking-wide">
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-rose-200/80 leading-relaxed font-light min-h-[44px]">
                    {desc}
                  </p>

                  {/* Protocol tags button */}
                  <button
                    onClick={() => setSelectedCard(card)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400 hover:text-rose-200 transition-colors pt-1 focus:outline-none"
                    aria-label={`View protocol details for ${title}`}
                  >
                    <span>{t.features.learnMore}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Bottom Section: Pristine Artwork extracted from mockup without duplicate text */}
                <div className="relative mt-auto w-full h-48 sm:h-52 overflow-hidden border-t border-rose-950/70 bg-[#07090e]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090e]/80 via-transparent to-[#0c0f18]/60 z-10 pointer-events-none" />
                  <img
                    src={card.image || `/assets/generated/card-${card.icon}.png`}
                    alt={`${title} illustration`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/aistudio/Amoorion__One_hub__many_connections_e358613b.png';
                    }}
                  />
                  {/* Subtle lower badge */}
                  <div className="absolute inset-x-4 bottom-3 flex items-center justify-between text-[11px] text-rose-300/80 z-20 bg-[#07090e]/85 backdrop-blur-sm px-3 py-1.5 rounded-full border border-rose-900/50">
                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      <Cpu className="w-3 h-3 text-rose-400" />
                      {card.badge || 'Open Hub'}
                    </span>
                    <span className="text-[10px] text-rose-400/90 hover:underline cursor-pointer" onClick={() => setSelectedCard(card)}>
                      Details →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Protocol Details Modal when user clicks "Explore Protocol" */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0e121d] border border-rose-800/60 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-500/50 flex items-center justify-center">
                  {getIcon(selectedCard.icon)}
                </div>
                <div>
                  <h4 className="text-2xl font-serif text-[#fbf6f3]">{getLocalizedTitle(selectedCard)}</h4>
                  <p className="text-xs text-rose-300/70">{selectedCard.subtitle || 'Amoorion Core Architecture'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="p-1.5 rounded-full bg-rose-950/40 text-rose-300 hover:text-white hover:bg-rose-900/60 transition-colors"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-rose-100/80 leading-relaxed">
              {getLocalizedDesc(selectedCard)}
            </p>

            {/* Feature Checklist */}
            <div className="space-y-2.5 bg-[#090b12] p-4 rounded-2xl border border-rose-950">
              <div className="text-xs font-semibold text-rose-300 uppercase tracking-wider mb-2">
                Capabilities & Integration Specs:
              </div>
              {(selectedCard.details || [
                'Interoperable with decentralized protocols',
                'Cryptographic verification & signing',
                'High throughput asynchronous python pipeline',
                'Unified metadata envelope format',
              ]).map((detail, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-rose-100/90">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={content.links.readthedocs}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-rose-400 hover:text-white flex items-center gap-1.5"
              >
                <span>Read technical docs on ReadTheDocs</span>
                <span>→</span>
              </a>
              <button
                onClick={() => setSelectedCard(null)}
                className="px-4 py-2 rounded-xl bg-rose-900/40 hover:bg-rose-800/60 border border-rose-600/50 text-xs font-medium text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
