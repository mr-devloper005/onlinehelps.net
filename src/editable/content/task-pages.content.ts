import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

/*
  Public-facing surface centers entirely on the Reference Library (pdf).
  The profile voice is used only on the direct-URL profile detail page and
  should read as a quiet "contributor record", never as a directory pitch.
*/

export const taskPageVoices = {
  pdf: {
    eyebrow: 'Reference Library',
    headline: 'A working library of references, briefs and open documents.',
    description:
      'Every entry is free to open, download and cite. Filter by category, or use search to jump straight to what you need — the library is designed to disappear into your workflow.',
    filterLabel: 'Filter category',
    secondaryNote: 'References are grouped by topic and kept up to date as new material is added.',
    chips: ['Free to open', 'Cite-ready', 'Updated regularly'],
  },
  profile: {
    eyebrow: 'Contributor',
    headline: 'A closer look at one of the people behind the library.',
    description:
      'Contributor pages exist so a resource can be traced back to a real person or organisation — with the work they have filed into the library alongside their contact card.',
    filterLabel: 'Filter category',
    secondaryNote: 'Contributor pages are reachable directly and never listed in feeds.',
    chips: ['Verified', 'Reachable', 'Traceable authorship'],
  },
  article: {
    eyebrow: 'Notes',
    headline: 'Working notes from around the library.',
    description: 'Short reads that support the primary reference collection.',
    filterLabel: 'Filter topic',
    secondaryNote: 'Supporting material for the library.',
    chips: ['Notes', 'Context', 'Background'],
  },
  classified: {
    eyebrow: 'Notice',
    headline: 'Time-sensitive notices from around the library.',
    description: 'Notices are archived quickly — they are here for reference only.',
    filterLabel: 'Filter notice',
    secondaryNote: 'Kept for record.',
    chips: ['Notices', 'Archived'],
  },
  sbm: {
    eyebrow: 'Bookmarks',
    headline: 'External resources worth pinning next to the library.',
    description: 'A small collection of outside links we point to often.',
    filterLabel: 'Filter collection',
    secondaryNote: 'External to the primary shelf.',
    chips: ['External', 'Curated'],
  },
  listing: {
    eyebrow: 'Directory',
    headline: 'A directory of supporting institutions and organisations.',
    description: 'Ancillary records; the library remains the primary surface.',
    filterLabel: 'Filter directory',
    secondaryNote: 'Reference-only entries.',
    chips: ['Directory', 'Ancillary'],
  },
  image: {
    eyebrow: 'Visual index',
    headline: 'Visual assets attached to library resources.',
    description: 'Charts, plates and illustrations pulled from the primary shelf.',
    filterLabel: 'Filter visual',
    secondaryNote: 'Supporting visuals only.',
    chips: ['Visuals', 'Companion'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
