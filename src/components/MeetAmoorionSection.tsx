import React from 'react';
import { Heart, ShieldCheck, Sparkles, Code2, Users, Compass, ExternalLink } from 'lucide-react';
import { SiteContent, SupportedLanguage } from '../types/content';
import { TRANSLATIONS } from '../locales/translations';

interface MeetAmoorionSectionProps {
  content: SiteContent;
  currentLang: SupportedLanguage;
}

export const MeetAmoorionSection: React.FC<MeetAmoorionSectionProps> = ({ content, currentLang }) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <section id="about" className="relative py-24 bg-[#07090e] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-10 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Center divider flourish ornament */}
      <div className="flex items-center justify-center mb-16">
        <div className="flex items-center gap-3 text-rose-400/40">
          <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-rose-500/40" />
          <span className="text-rose-400 text-sm">❦</span>
          <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-rose-500/40" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Mascot Artwork matching mockup (Winged kitten holding heart among roses) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden border border-rose-900/50 shadow-[0_0_40px_rgba(225,76,98,0.25)] bg-[#0c0f18] group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent z-10 opacity-70 pointer-events-none" />

              <img
                src="/assets/generated/meet-cat.png"
                alt="Amoorion mascot - winged horned kitten holding glowing ruby heart among roses and butterflies"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/aistudio/Amoorion__One_hub__many_connections_e358613b.png';
                }}
              />

              {/* Heart glow accent pill */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-[#0c0e17]/85 backdrop-blur-md border border-rose-800/40 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-600/30 flex items-center justify-center border border-rose-500/40">
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-500/60" />
                </div>
                <div className="text-xs text-rose-200">
                  <span className="font-semibold text-rose-100">Kindness & Openness</span>
                  <div className="text-[11px] text-rose-300/70">Connecting hearts across decentralized webs</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mission Narrative & Philosophical Vision matching mockup */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h2 className="text-4xl sm:text-5xl font-serif text-[#fbf6f3] tracking-tight">
                {t.meet.title || content.meetAmoorion.title}
              </h2>
              {/* Ornate subtle line flourish under title */}
              <div className="flex items-center gap-2 text-rose-400/50">
                <div className="h-[1px] w-12 bg-rose-500/40" />
                <span className="text-xs">◆</span>
                <div className="h-[1px] w-24 bg-gradient-to-r from-rose-500/40 to-transparent" />
              </div>
            </div>

            {/* Narrative text matching mockup */}
            <div className="space-y-4 text-base sm:text-lg text-rose-100/80 leading-relaxed font-light">
              <p>
                {t.meet.p1 || content.meetAmoorion.paragraphs[0]}
              </p>
              <p className="text-rose-200/90 font-normal">
                {t.meet.p2 || content.meetAmoorion.paragraphs[1]}
              </p>
            </div>

            {/* Core Pillars / Value Tags */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#131622] border border-rose-800/40 text-xs text-rose-200 font-medium">
                <Code2 className="w-3.5 h-3.5 text-rose-400" />
                <span>{t.meet.tags.openSource}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#131622] border border-rose-800/40 text-xs text-rose-200 font-medium">
                <Compass className="w-3.5 h-3.5 text-rose-400" />
                <span>{t.meet.tags.interoperable}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#131622] border border-rose-800/40 text-xs text-rose-200 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>{t.meet.tags.privacyFirst}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#131622] border border-rose-800/40 text-xs text-rose-200 font-medium">
                <Users className="w-3.5 h-3.5 text-rose-400" />
                <span>{t.meet.tags.humane}</span>
              </div>
            </div>

            {/* Ecosystem links */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={content.links.readthedocs}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-[#0f1320] border border-rose-900/40 hover:border-rose-500/60 hover:bg-[#151a2c] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-rose-100 group-hover:text-white flex items-center gap-1.5">
                    <span>ReadTheDocs</span>
                    <ExternalLink className="w-3 h-3 text-rose-400/70" />
                  </div>
                  <div className="text-[11px] text-rose-300/60">Comprehensive guides & API architecture</div>
                </div>
              </a>

              <a
                href={content.links.pypi}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-[#0f1320] border border-rose-900/40 hover:border-rose-500/60 hover:bg-[#151a2c] transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-rose-100 group-hover:text-white flex items-center gap-1.5">
                    <span>PyPI Package</span>
                    <ExternalLink className="w-3 h-3 text-rose-400/70" />
                  </div>
                  <div className="text-[11px] text-rose-300/60">Install with pip install amoorion</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
