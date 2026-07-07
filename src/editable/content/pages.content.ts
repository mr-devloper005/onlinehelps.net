import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Open reference library',
      description:
        'A curated shelf of downloadable references — briefs, guides, working papers and technical notes — kept open, searchable and cite-friendly.',
      openGraphTitle: 'Open reference library',
      openGraphDescription:
        'Search, open and cite a growing library of downloadable references, working papers and technical notes.',
      keywords: ['reference library', 'open documents', 'downloadable references', 'working papers'],
    },
    hero: {
      badge: 'Open library, updated regularly',
      title: ['A quiet reference library.', 'Open, searchable, cite-ready.'],
      description:
        'A curated shelf of downloadable references — free to open, share and cite. Filter by category, or search to jump straight to what you need.',
      primaryCta: { label: 'Browse the library', href: '/pdf' },
      secondaryCta: { label: 'How it works', href: '/about' },
      searchPlaceholder: 'Search the library by topic, author or keyword',
      focusLabel: 'Latest',
      featureCardBadge: 'Featured this week',
      featureCardTitle: 'Fresh references, added at a steady cadence.',
      featureCardDescription:
        'New entries filter in weekly. The most recent additions surface here first so returning visitors see what is new at a glance.',
    },
    intro: {
      badge: 'What is inside',
      title: 'Curated references, presented as a working library.',
      paragraphs: [
        'Every resource is filed under a clear category, kept downloadable, and paired with a short summary of what is inside.',
        'The library is designed to be quiet — no ads in your reading, no gated downloads, no distracting overlays. Just the reference and the metadata you actually need.',
        'If you cite regularly, the library is meant to disappear into your workflow.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Every entry is free to open and download.',
        'Metadata is complete: category, pages, size and updated date.',
        'Search jumps to a specific resource in a keystroke.',
        'New references are added weekly.',
      ],
      primaryLink: { label: 'Browse the library', href: '/pdf' },
      secondaryLink: { label: 'Read the story', href: '/about' },
    },
    cta: {
      badge: 'Start reading',
      title: 'Open the library, or point us at what is missing.',
      description:
        'Every reference is free to download. If a topic you rely on is not on the shelf yet, let us know — the library grows from what visitors actually ask for.',
      primaryCta: { label: 'Open the library', href: '/pdf' },
      secondaryCta: { label: 'Suggest a reference', href: '/contact' },
    },
    taskSection: {
      heading: 'Fresh in the library',
      descriptionSuffix: 'The most recent references added to the shelf.',
    },
  },
  about: {
    badge: 'About the library',
    title: 'An open, cite-friendly reference shelf.',
    description: `${slot4BrandConfig.siteName} is a quiet reference library — a curated shelf of downloadable resources kept open, searchable and cite-ready.`,
    paragraphs: [
      'The library was built to sit inside your workflow, not compete with it. No gated downloads, no ads inside your reading, no walls between you and a resource.',
      'Every entry is paired with the metadata you actually need — category, pages, size, updated date and a short summary of what is inside.',
    ],
    values: [
      {
        title: 'Open by default',
        description: 'Every reference is free to open, download and cite. No accounts required to read.',
      },
      {
        title: 'Cite-ready metadata',
        description: 'Category, pages, size and updated date attached to every resource so citations are trivial.',
      },
      {
        title: 'Steady cadence',
        description: 'New references are filed weekly. Older entries get updates when the underlying material changes.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Suggest a reference, flag a broken link, or point out something missing.',
    description:
      'The library grows from what visitors actually ask for. Send a note and we will route it to the right shelf.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search the library',
      description: 'Search references, categories and topics across the library.',
    },
    hero: {
      badge: 'Search the shelf',
      title: 'Jump straight to a reference.',
      description: 'Search by topic, author or keyword. Filter by category to narrow the shelf.',
      placeholder: 'Search by topic, author or keyword',
    },
    resultsTitle: 'Matching references',
  },
  create: {
    metadata: {
      title: 'Submit',
      description: 'Submit a new reference to the library.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to submit a reference.',
      description: 'Contributors can file new references, attach metadata and add a short summary.',
    },
    hero: {
      badge: 'Submit',
      title: 'File a new reference to the library.',
      description:
        'Add the resource, a short summary, category and any relevant tags. Submissions are reviewed before they land on the public shelf.',
    },
    formTitle: 'Reference details',
    submitLabel: 'File to the library',
    successTitle: 'Reference submitted for review.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to your contributor account.',
      badge: 'Contributor',
      title: 'Welcome back.',
      description: 'Sign in to file new references, manage your entries and keep your metadata current.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then sign in.',
      success: 'Signed in. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create a contributor account.',
      badge: 'Get started',
      title: 'Create your contributor account.',
      description: 'Create an account to file references, edit your entries and keep metadata current.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting...',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related notes',
      fallbackTitle: 'Note',
    },
    listing: {
      relatedTitle: 'Related entries',
      fallbackTitle: 'Directory entry',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Visual',
    },
    profile: {
      relatedTitle: 'From this contributor',
      fallbackDescription: 'Contributor details will appear here once available.',
      visitButton: 'Visit website',
    },
  },
} as const
