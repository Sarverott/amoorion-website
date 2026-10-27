export type SupportedLanguage = 'en' | 'pl' | 'es' | 'de' | 'ja' | 'fr';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
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
}

export interface SiteContent {
  brand: {
    name: string;
    tagline: string;
    logoText: string;
  };
  hero: {
    badge: string;
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
  };
  cmsConfig: {
    repoOwner: string;
    repoName: string;
    branch: string;
    contentFilePath: string;
    lastSyncedAt?: string;
    lastCommitSha?: string;
  };
}

export interface GitCommitInfo {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  html_url?: string;
}

export interface GitHubAuthStatus {
  hasServerToken: boolean;
  user: string | null;
  defaultRepo: string;
}

export interface TranslationDictionary {
  nav: {
    home: string;
    about: string;
    features: string;
    contribute: string;
    docs: string;
    viewOnGithub: string;
    contentStudio: string;
    pypi: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    exploreBtn: string;
    githubBtn: string;
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
  cms: {
    title: string;
    description: string;
    syncWithGit: string;
    commitToGit: string;
    localPreview: string;
    repoConfig: string;
    statusConnected: string;
    statusReadOnly: string;
    commitMessagePrompt: string;
  };
  footer: {
    builtWithLove: string;
    allRightsReserved: string;
    openProtocol: string;
  };
}
