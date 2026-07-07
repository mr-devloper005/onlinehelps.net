import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Reference library for open knowledge',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Open reference library',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get started', href: '/signup' },
      secondary: { label: 'Submit', href: '/create' },
    },
  },
  footer: {
    tagline: 'A quiet, well-organized reference library',
    description:
      'A curated shelf of downloadable references — briefs, guides, working papers and technical notes — kept open, searchable and cite-friendly.',
    columns: [
      { title: 'Discovery', links: [] },
      { title: 'Resources', links: [] },
      { title: 'Account', links: [] },
    ],
    bottomNote: 'Built for open reference',
  },
  commonLabels: {
    readMore: 'Open resource',
    viewAll: 'Browse all',
    explore: 'Explore the library',
    latest: 'Freshly added',
    related: 'Related in the library',
    published: 'Filed under',
  },
} as const
