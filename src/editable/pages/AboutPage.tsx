import Link from 'next/link'
import { ArrowUpRight, BookOpen, Compass, Feather } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-container-pad)]'

const valueIcons = [Feather, BookOpen, Compass]

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main>
        <section className={`${container} pt-24 pb-16 sm:pt-32`}>
          <EditableReveal index={0}>
            <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
              {pagesContent.about.badge}
            </span>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className="editable-display mt-8 max-w-4xl text-balance text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
              {pagesContent.about.title}
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mt-8 max-w-2xl text-lg leading-[1.65] text-[var(--slot4-muted-text)]">
              {pagesContent.about.description}
            </p>
          </EditableReveal>
        </section>

        <section className={`${container} pb-[var(--editable-section-y)]`}>
          <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
            <EditableReveal>
              <div className="space-y-6 text-[17px] leading-[1.8] text-[var(--slot4-muted-text)]">
                {pagesContent.about.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </EditableReveal>
            <div className="grid gap-5">
              {pagesContent.about.values.map((value, i) => {
                const Icon = valueIcons[i] || Feather
                return (
                  <EditableReveal key={value.title} index={i}>
                    <div className="rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-8 transition duration-500 hover:border-[var(--slot4-accent)]">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h2 className="editable-display mt-6 text-xl font-semibold tracking-[-0.02em]">{value.title}</h2>
                      <p className="mt-3 text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">{value.description}</p>
                    </div>
                  </EditableReveal>
                )
              })}
            </div>
          </div>

          <EditableReveal>
            <div className="mt-24 flex flex-col items-start gap-4 border-t border-[var(--editable-border)] pt-14 sm:flex-row sm:items-center sm:justify-between">
              <p className="editable-mono text-[11px] uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
                {SITE_CONFIG.name} · {SITE_CONFIG.domain}
              </p>
              <Link
                href="/pdf"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-105"
              >
                Open the library <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
