import { SiteContent, SupportedLanguage } from '../types/content';
import { TRANSLATIONS } from '../locales/translations';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates the structure and necessary fields of a SiteContent object
 */
export function validateContentSchema(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Content payload must be a non-null object'] };
  }

  const obj = data as Partial<SiteContent>;

  if (!obj.brand || typeof obj.brand !== 'object') {
    errors.push('Missing or invalid brand object');
  } else {
    if (!obj.brand.name) errors.push('brand.name is required');
    if (!obj.brand.logoText) errors.push('brand.logoText is required');
  }

  if (!obj.hero || typeof obj.hero !== 'object') {
    errors.push('Missing or invalid hero object');
  } else {
    if (!obj.hero.title) errors.push('hero.title is required');
    if (!obj.hero.subtitle) errors.push('hero.subtitle is required');
  }

  if (!obj.featuresSection || typeof obj.featuresSection !== 'object') {
    errors.push('Missing or invalid featuresSection object');
  } else {
    if (!obj.featuresSection.title) errors.push('featuresSection.title is required');
    if (!Array.isArray(obj.featuresSection.cards) || obj.featuresSection.cards.length === 0) {
      errors.push('featuresSection.cards must be a non-empty array');
    }
  }

  if (!obj.meetAmoorion || typeof obj.meetAmoorion !== 'object') {
    errors.push('Missing or invalid meetAmoorion object');
  } else {
    if (!obj.meetAmoorion.title) errors.push('meetAmoorion.title is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Safely merges user-supplied or remote git content with full fallback defaults
 */
export function mergeContentWithDefaults(
  custom: Partial<SiteContent> | null | undefined,
  defaultContent: SiteContent
): SiteContent {
  if (!custom) return { ...defaultContent };

  return {
    ...defaultContent,
    ...custom,
    brand: {
      ...defaultContent.brand,
      ...(custom.brand || {}),
    },
    hero: {
      ...defaultContent.hero,
      ...(custom.hero || {}),
    },
    featuresSection: {
      ...defaultContent.featuresSection,
      ...(custom.featuresSection || {}),
      cards:
        custom.featuresSection?.cards && custom.featuresSection.cards.length > 0
          ? custom.featuresSection.cards.map((card, i) => ({
              ...(defaultContent.featuresSection.cards[i] || {}),
              ...card,
            }))
          : defaultContent.featuresSection.cards,
    },
    meetAmoorion: {
      ...defaultContent.meetAmoorion,
      ...(custom.meetAmoorion || {}),
      paragraphs:
        custom.meetAmoorion?.paragraphs && custom.meetAmoorion.paragraphs.length > 0
          ? custom.meetAmoorion.paragraphs
          : defaultContent.meetAmoorion.paragraphs,
    },
    links: {
      ...defaultContent.links,
      ...(custom.links || {}),
    },
    cmsConfig: {
      ...defaultContent.cmsConfig,
      ...(custom.cmsConfig || {}),
    },
  };
}

/**
 * Prepares the Git commit payload with base64 encoded content for GitHub REST API / isomorphic-git
 */
export function createGitCommitPayload(
  content: SiteContent,
  message: string,
  branch = 'main',
  sha?: string
) {
  const jsonString = JSON.stringify(content, null, 2);
  const contentBase64 = Buffer.from(jsonString).toString('base64');

  return {
    message: message.trim() || `Update site content via Amoorion Headless CMS [${new Date().toISOString()}]`,
    content: contentBase64,
    branch,
    ...(sha ? { sha } : {}),
  };
}

/**
 * Formats ISO date into human readable timestamp
 */
export function formatCommitDate(isoDate?: string): string {
  if (!isoDate) return 'Just now';
  try {
    const d = new Date(isoDate);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoDate;
  }
}

/**
 * Resolves localized text using active language dictionary with fallback to English
 */
export function getTranslatedHeroTitle(lang: SupportedLanguage, defaultTitle: string): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return dict.hero.title || defaultTitle;
}
