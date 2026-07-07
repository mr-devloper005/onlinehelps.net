import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Task surfaces share one visual language — warm off-white base (#F5F2F2),
  white panels, orange #FEB05D accent, hairline 10% ink stroke, Inter fonts.
  Only the kicker/note copy varies per task. Public labels come from
  taskPageVoices; kicker/note here are the section eyebrow + intro voice.
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  fontMono: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const FONT = "'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, monospace"

const base = {
  dark: false,
  fontDisplay: FONT,
  fontBody: FONT,
  fontMono: MONO,
  bg: '#F5F2F2',
  surface: '#FFFFFF',
  raised: '#EDE9E7',
  text: '#2B2A2A',
  muted: '#6B6968',
  line: 'rgba(43,42,42,0.10)',
  accent: '#FEB05D',
  accentSoft: 'rgba(254,176,93,0.18)',
  onAccent: '#2B2A2A',
  glow: 'rgba(254,176,93,0.28)',
  radius: '20px',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Editorial', note: 'Long-form pieces from across the library.' },
  listing: { ...base, kicker: 'Directory', note: 'Places, spaces and services worth knowing.' },
  classified: { ...base, kicker: 'Notice', note: 'Time-sensitive offers and opportunities.' },
  image: { ...base, kicker: 'Visual', note: 'A curated visual index.' },
  sbm: { ...base, kicker: 'Bookmarks', note: 'Curated links worth saving.' },
  pdf: { ...base, kicker: 'Reference Library', note: 'Downloadable references, briefs, and working documents — free to open, share, and cite.' },
  profile: { ...base, kicker: 'Contributor', note: 'A closer look at one of the people behind the library.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.pdf
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
