import { SiteContent } from '../types/content';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  brand: {
    name: 'Amoorion',
    tagline: 'One hub. Many connections.',
    logoText: 'AMOORION',
  },
  hero: {
    badge: 'Early stage',
    title: 'One heart for all your conversations.',
    titleHighlight: 'One heart',
    subtitle: 'Publish, read and connect across platforms.',
    primaryCtaText: 'Explore the project',
    primaryCtaLink: '#features',
    secondaryCtaText: 'View on GitHub',
    secondaryCtaLink: 'https://github.com/sarverott/amoorion',
    pipCommand: 'pip install amoorion',
  },
  featuresSection: {
    title: 'One hub. Many connections.',
    subtitle:
      'Amoorion brings your conversations together, so you can publish, read and connect openly across the social web.',
    cards: [
      {
        id: 'publish',
        title: 'Publish',
        subtitle: 'Write Once, Broadcast Everywhere',
        description: 'Share your thoughts, ideas and creations, your way.',
        icon: 'publish',
        image: '/assets/generated/card-publish.png',
        badge: 'Decentralized',
        details: [
          'Unified message posting syntax',
          'Cross-posting across decentralized fediverse platforms',
          'Rich markdown & media attachment formatting',
          'Cryptographic authenticity verification',
        ],
      },
      {
        id: 'reply',
        title: 'Read & reply',
        subtitle: 'Universal Aggregated Stream',
        description: 'Follow conversations and join in, wherever they happen.',
        icon: 'reply',
        image: '/assets/generated/card-reply.png',
        badge: 'Real-time',
        details: [
          'Aggregated timeline across multiple platforms',
          'Context-aware threading and citation tracking',
          'Smart notification deduplication',
          'Low latency stream ingestion via async python',
        ],
      },
      {
        id: 'connect',
        title: 'Connect',
        subtitle: 'Bridges & Protocol Drivers',
        description: 'Bridging platforms and communities, together.',
        icon: 'connect',
        image: '/assets/generated/card-connect.png',
        badge: 'Interoperable',
        details: [
          'Extensible plug-in architecture for social protocols',
          'ActivityPub, Bluesky/ATProto, Matrix, and RSS drivers',
          'Federated identity and key management',
          'Self-hostable daemon or standalone library',
        ],
      },
    ],
  },
  meetAmoorion: {
    title: 'Meet Amoorion',
    badge: 'Our Mission & Philosophy',
    paragraphs: [
      'Amoorion is an early-stage, open-source social communication hub. It helps people publish, read and connect across platforms, with a focus on an open, humane and interoperable social web.',
      "It's built by a small group of dreamers who believe conversations make a kinder, more connected internet. You're welcome here.",
    ],
    highlightQuote:
      'A digital sanctuary where conversations flow freely, owned by people rather than walled gardens.',
    welcomeMessage: "You're welcome here.",
    tags: ['Open Source', 'Decentralized', 'Humane Web', 'Python Powered', 'Zero Tracking'],
  },
  links: {
    github: 'https://github.com/sarverott/amoorion',
    readthedocs: 'https://amoorion.readthedocs.io',
    pypi: 'https://pypi.org/project/amoorion/',
    githubPages: 'https://sarverott.github.io/amoorion',
  },
  cmsConfig: {
    repoOwner: 'sarverott',
    repoName: 'amoorion',
    branch: 'main',
    contentFilePath: 'content/site-content.json',
    lastSyncedAt: new Date().toISOString(),
    lastCommitSha: 'latest',
  },
};
