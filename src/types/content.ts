export type SupportedLanguage = 'en' | 'pl' | 'es' | 'de' | 'ja' | 'fr';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export interface MarimoExample {
  id: string;
  title: string;
  description: string;
  category: 'core' | 'protocols' | 'daemons' | 'workflows';
  htmlPath: string; // e.g. "examples/01-getting-started.html"
  badge: string;
}

export interface PackageVersion {
  name: string;
  version: string;
  category: 'core' | 'publication' | 'communication' | 'bridge';
  description: string;
}

export interface SubpageLink {
  title: string;
  url: string;
  description: string;
  isExternal?: boolean;
  category: 'portal' | 'docs' | 'agents' | 'examples';
}

export interface FeatureCardContent {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: 'publish' | 'reply' | 'connect';
  image?: string;
  badge?: string;
  details?: string[];
  relatedExamples?: string[];
  docAnchor?: string;
}

export interface SiteContent {
  version: string;
  brand: {
    name: string;
    tagline: string;
    logoText: string;
  };
  hero: {
    badge: string;
    versionBadge: string;
    title: string;
    titleHighlight?: string;
    subtitle: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    pipCommand: string;
  };
  featuresSection: {
    title: string;
    subtitle: string;
    cards: FeatureCardContent[];
  };
  meetAmoorion: {
    title: string;
    badge?: string;
    paragraphs: string[];
    highlightQuote: string;
    welcomeMessage: string;
    tags: string[];
  };
  links: {
    github: string;
    readthedocs: string;
    pypi: string;
    githubPages: string;
    projectHtml: string;
    releasesHtml: string;
    examplesIndex: string;
    manifestJson: string;
    llmsTxt: string;
    agentSkill: string;
  };
  subpages: SubpageLink[];
  featuredExamples: MarimoExample[];
  packages: PackageVersion[];
  openApiConfig: {
    specUrl: string;
    setupSourceUrl: string;
    activeServer: string;
  };
}

export interface TranslationDictionary {
  nav: {
    home: string;
    about: string;
    features: string;
    contribute: string;
    project: string;
    releases: string;
    examples: string;
    docs: string;
    viewOnGithub: string;
    openApiStudio: string;
    pypi: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    exploreBtn: string;
    githubBtn: string;
    projectBtn: string;
    copyCommand: string;
    copied: string;
  };
  features: {
    sectionTitle: string;
    sectionSubtitle: string;
    publishTitle: string;
    publishDesc: string;
    replyTitle: string;
    replyDesc: string;
    connectTitle: string;
    connectDesc: string;
    learnMore: string;
  };
  meet: {
    title: string;
    p1: string;
    p2: string;
    tags: {
      openSource: string;
      interoperable: string;
      privacyFirst: string;
      humane: string;
    };
  };
  ecosystem: {
    title: string;
    subtitle: string;
    terminalTitle: string;
    codeTitle: string;
    examplesTitle: string;
  };
  footer: {
    builtWithLove: string;
    allRightsReserved: string;
    openProtocol: string;
  };
}
