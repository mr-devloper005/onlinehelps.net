import type { CSSProperties } from 'react'

/*
  Design contract.

  Warm off-white surface (#F5F2F2), pure-white panels, orange primary accent
  (#FEB05D), blue secondary accent (#5A7ACD), near-black ink (#2B2A2A).
  Inter display + body, Roboto Mono for labels/mono chips. Pill buttons,
  hairline 10% ink strokes, section rhythm clamp(80px, 10vw, 120px),
  container padding clamp(20px, 5vw, 96px).
*/

// Warm off-white surface, orange primary accent, blue secondary accent,
// near-black text. Borders are subtle 8-16% ink over the warm background.
export const editableRootStyle = {
  '--slot4-page-bg': '#F5F2F2',
  '--slot4-page-text': '#2B2A2A',
  '--slot4-panel-bg': '#FFFFFF',
  '--slot4-surface-bg': '#FFFFFF',
  '--slot4-raised-bg': '#EDE9E7',
  '--slot4-muted-text': '#6B6968',
  '--slot4-soft-muted-text': '#8F8C8B',
  '--slot4-accent': '#FEB05D',
  '--slot4-accent-fill': '#FEB05D',
  '--slot4-accent-soft': 'rgba(254,176,93,0.18)',
  '--slot4-on-accent': '#2B2A2A',
  '--slot4-secondary': '#5A7ACD',
  '--slot4-secondary-soft': 'rgba(90,122,205,0.14)',
  '--slot4-dark-bg': '#2B2A2A',
  '--slot4-dark-text': '#F5F2F2',
  '--slot4-media-bg': '#EDE9E7',
  '--slot4-cream': '#FFFFFF',
  '--slot4-warm': '#F5F2F2',
  '--slot4-lavender': '#EEF1FA',
  '--slot4-gray': '#EDE9E7',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#F5F2F2',
  '--editable-page-text': '#2B2A2A',
  '--editable-container': '1440px',
  '--editable-container-pad': 'clamp(20px, 5vw, 96px)',
  '--editable-section-y': 'clamp(80px, 10vw, 120px)',
  '--editable-border': 'rgba(43,42,42,0.10)',
  '--editable-border-strong': 'rgba(43,42,42,0.18)',
  '--editable-nav-bg': '#F5F2F2',
  '--editable-nav-text': '#2B2A2A',
  '--editable-nav-active': '#FEB05D',
  '--editable-nav-active-text': '#2B2A2A',
  '--editable-cta-bg': '#FEB05D',
  '--editable-cta-text': '#2B2A2A',
  '--editable-search-bg': '#FFFFFF',
  '--editable-footer-bg': '#2B2A2A',
  '--editable-footer-text': '#F5F2F2',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-[var(--editable-border)]',
  shadow: 'shadow-[0_1px_2px_rgba(43,42,42,0.05)]',
  shadowStrong: 'shadow-[0_24px_60px_rgba(43,42,42,0.12)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(43,42,42,0.05)_0%,rgba(43,42,42,0.86)_100%)]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-container-pad)]',
    sectionY: 'py-[var(--editable-section-y)]',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    eyebrow: 'font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]',
    heroTitle: 'font-semibold leading-[1.04] tracking-[-0.03em] text-[clamp(2.4rem,6vw,4.6rem)]',
    sectionTitle: 'font-semibold leading-[1.06] tracking-[-0.03em] text-[clamp(1.9rem,3.6vw,3rem)]',
    body: 'text-base leading-[1.6] text-[var(--slot4-muted-text)]',
    emphasis: 'italic text-[var(--slot4-page-text)]',
  },
  surface: {
    card: `rounded-[20px] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    soft: `rounded-[20px] border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-[24px] ${editablePalette.darkBg} ${editablePalette.darkText}`,
  },
  button: {
    primary: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-sm font-semibold tracking-[-0.01em] text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-105 active:scale-[0.98]`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-transparent px-7 py-3.5 text-sm font-semibold tracking-[-0.01em] text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] active:scale-[0.98]`,
    accent: `inline-flex items-center justify-center gap-2 rounded-full ${editablePalette.accentBg} px-7 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-105 active:scale-[0.98]`,
    ghost: `inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]`,
  },
  badge: {
    pill: 'inline-flex items-center gap-1.5 rounded-full border border-[var(--editable-border-strong)] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]',
    accentPill: 'inline-flex items-center gap-1.5 rounded-full bg-[var(--slot4-accent)] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--slot4-on-accent)]',
    softPill: 'inline-flex items-center gap-1.5 rounded-full bg-[var(--slot4-accent-soft)] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--slot4-accent)]',
  },
  media: {
    frame: `relative overflow-hidden rounded-[20px] ${editablePalette.mediaBg}`,
    frameFull: `relative overflow-hidden rounded-[24px] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[16/10]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-accent)]',
    fade: 'transition duration-300 hover:opacity-90',
    zoom: 'transition duration-700 group-hover:scale-[1.04]',
  },
} as const

export const aiLayoutRules = [
  'Palette and container tokens live in editableRootStyle — change them there and every section updates via CSS variables.',
  'Section rhythm is driven by --editable-section-y; do not hardcode py-* on top-level sections.',
  'Use pill buttons (rounded-full) matching dc.button.* everywhere; do not introduce rounded-lg CTAs.',
  'Reference Library (pdf) is the only publicly promoted task — never surface profile cards in feeds, nav, footer, or archives.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Wrap section headers and grid items in EditableReveal for the site-wide fade-in cadence.',
] as const
