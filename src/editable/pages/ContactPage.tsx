'use client'

import { BookOpen, Bug, Compass, MessageCircle } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-container-pad)]'

const lanes = [
  {
    icon: BookOpen,
    title: 'Suggest a reference',
    body: 'Point us at a reference, brief or paper worth filing to the open shelf. The library grows from what visitors ask for.',
  },
  {
    icon: Compass,
    title: 'Fix or update',
    body: 'Spot a broken link, wrong metadata, or a stale entry? Send the URL — corrections land the same day.',
  },
  {
    icon: Bug,
    title: 'Report an issue',
    body: 'Site behaviour that reads wrong, accessibility gaps, or download failures. Tell us what and where.',
  },
  {
    icon: MessageCircle,
    title: 'Everything else',
    body: 'Partnerships, syndication requests, licensing questions — start here and we will route it to the right shelf.',
  },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main>
        <section className={`${container} pt-24 pb-16 sm:pt-32`}>
          <div className="grid gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <EditableReveal index={0}>
                <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
                  {pagesContent.contact.eyebrow}
                </span>
              </EditableReveal>
              <EditableReveal index={1}>
                <h1 className="editable-display mt-8 text-[clamp(2.2rem,4.6vw,4rem)] font-semibold leading-[1] tracking-[-0.04em]">
                  {pagesContent.contact.title}
                </h1>
              </EditableReveal>
              <EditableReveal index={2}>
                <p className="mt-8 max-w-xl text-lg leading-[1.65] text-[var(--slot4-muted-text)]">
                  {pagesContent.contact.description}
                </p>
              </EditableReveal>

              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {lanes.map((lane, i) => (
                  <EditableReveal key={lane.title} index={i}>
                    <div className="rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-6 transition duration-500 hover:border-[var(--slot4-accent)]">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                        <lane.icon className="h-4.5 w-4.5" />
                      </span>
                      <h2 className="editable-display mt-5 text-lg font-semibold tracking-[-0.02em]">{lane.title}</h2>
                      <p className="mt-2 text-[14px] leading-[1.65] text-[var(--slot4-muted-text)]">{lane.body}</p>
                    </div>
                  </EditableReveal>
                ))}
              </div>
            </div>

            <EditableReveal>
              <div className="rounded-[28px] border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] p-8 lg:p-10">
                <h2 className="editable-display text-2xl font-semibold tracking-[-0.03em]">{pagesContent.contact.formTitle}</h2>
                <p className="mt-3 text-[14px] leading-[1.65] text-[var(--slot4-muted-text)]">
                  A short message is enough. We reply from a real inbox.
                </p>
                <div className="mt-6">
                  <EditableContactLeadForm />
                </div>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
