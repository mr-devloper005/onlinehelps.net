import Link from 'next/link'
import { ArrowUpRight, Download, Quote, Search, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, getEditableExcerpt, getEditableCategory, postHref } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'

/*
  Grabin-style home surface — every section rides the same dark palette and
  lime accent. Section rhythm follows --editable-section-y. Reveal animation
  is applied via EditableReveal + staggered index.

  Public focus: the Reference Library. No profile content is surfaced.
*/

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-container-pad)]'

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* ------------------------------ Hero ------------------------------ */

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const featured = pool[0]
  const heroTitle = pagesContent.home.hero.title || ['A quiet reference library.', 'Open, searchable, cite-ready.']

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(60%_60%_at_15%_10%,rgba(136,239,86,0.10),transparent_65%)]" />
      <div className={`${container} pt-24 pb-24 sm:pt-28 lg:pt-32 lg:pb-32`}>
        <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <EditableReveal index={0}>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)]/60 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent)]" />
                {pagesContent.home.hero.badge}
              </span>
            </EditableReveal>

            <EditableReveal index={1}>
              <h1 className="editable-display mt-8 text-[clamp(2.5rem,7vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
                {heroTitle[0]}
                <br />
                <span className="text-[var(--slot4-muted-text)]">{heroTitle[1]}</span>
              </h1>
            </EditableReveal>

            <EditableReveal index={2}>
              <p className="mt-8 max-w-xl text-lg leading-[1.65] text-[var(--slot4-muted-text)]">
                {pagesContent.home.hero.description}
              </p>
            </EditableReveal>

            <EditableReveal index={3}>
              <form action="/search" className="mt-10 flex w-full max-w-xl overflow-hidden rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)]">
                <div className="flex flex-1 items-center gap-2.5 pl-6 pr-3">
                  <Search className="h-5 w-5 shrink-0 text-[var(--slot4-muted-text)]" />
                  <input
                    name="q"
                    placeholder={pagesContent.home.hero.searchPlaceholder}
                    className="w-full bg-transparent py-4 text-sm text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                  />
                </div>
                <button className="m-1.5 shrink-0 rounded-full bg-[var(--slot4-accent)] px-6 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-105">
                  Search
                </button>
              </form>
            </EditableReveal>

            <EditableReveal index={4}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={pagesContent.home.hero.primaryCta.href}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-105"
                >
                  {pagesContent.home.hero.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href={pagesContent.home.hero.secondaryCta.href}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
                >
                  {pagesContent.home.hero.secondaryCta.label}
                </Link>
              </div>
            </EditableReveal>
          </div>

          {featured ? (
            <EditableReveal index={5}>
              <Link
                href={postHref(primaryTask, featured, primaryRoute)}
                className="group relative block overflow-hidden rounded-[28px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]"
              >
                <div className="aspect-[4/5] w-full overflow-hidden">
                  <img
                    src={getEditablePostImage(featured)}
                    alt={featured.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(43,42,42,0.92))]" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <span className="editable-mono inline-flex items-center gap-1.5 rounded-full bg-[var(--slot4-accent)] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--slot4-on-accent)]">
                    {pagesContent.home.hero.featureCardBadge}
                  </span>
                  <h3 className="editable-display mt-4 line-clamp-3 text-2xl font-semibold leading-[1.1] tracking-[-0.02em] text-white">
                    {featured.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm text-white/70">{getEditableExcerpt(featured, 130)}</p>
                </div>
              </Link>
            </EditableReveal>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------- Stats band ---------------------------- */

export function EditableStoryRail({ posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const totalCount = pool.length
  const categories = new Set<string>()
  pool.forEach((p) => {
    const cat = getEditableCategory(p)
    if (cat) categories.add(cat)
  })
  const stats = [
    { value: totalCount ? `${totalCount}+` : 'Open', label: 'Live references' },
    { value: categories.size ? `${categories.size}` : '—', label: 'Categories on the shelf' },
    { value: 'Weekly', label: 'New additions filed' },
    { value: 'Free', label: 'To open & cite' },
  ]

  return (
    <section className={`${container} border-y border-[var(--editable-border)] py-[clamp(60px,7vw,90px)]`}>
      <EditableReveal>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <EditableReveal key={stat.label} index={i}>
              <div>
                <p className="editable-display text-[clamp(2.6rem,4.8vw,4.2rem)] font-semibold leading-none tracking-[-0.03em] text-[var(--slot4-accent)]">
                  {stat.value}
                </p>
                <p className="editable-mono mt-4 text-[11px] uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
                  {stat.label}
                </p>
              </div>
            </EditableReveal>
          ))}
        </div>
      </EditableReveal>
    </section>
  )
}

/* -------------------------- Featured spotlight -------------------------- */

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const featured = pool.slice(0, 6)
  if (!featured.length) return null

  return (
    <section className={`${container} py-[var(--editable-section-y)]`}>
      <EditableReveal>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Featured shelf</p>
            <h2 className="editable-display mt-4 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
              Hand-picked references, this month.
            </h2>
          </div>
          <Link
            href={primaryRoute}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-6 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
          >
            Browse the shelf <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </EditableReveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {featured.map((post, i) => (
          <EditableReveal key={post.id || post.slug} index={i}>
            <Link
              href={postHref(primaryTask, post, primaryRoute)}
              className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-accent)]"
            >
              <div className="relative aspect-[16/11] overflow-hidden">
                <img
                  src={getEditablePostImage(post)}
                  alt={post.title}
                  className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.04]"
                />
                <span className="editable-mono absolute left-5 top-5 rounded-full bg-[var(--slot4-page-bg)]/85 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[var(--slot4-page-text)] backdrop-blur-sm">
                  {getEditableCategory(post)}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="editable-display line-clamp-3 text-2xl font-semibold leading-[1.15] tracking-[-0.02em]">
                  {post.title}
                </h3>
                <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]">
                  {getEditableExcerpt(post, 150)}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-accent)]">
                  Open resource <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </EditableReveal>
        ))}
      </div>
    </section>
  )
}

/* ------------------------ Process (how it works) ------------------------ */

export function EditableProcessSteps() {
  const steps = [
    { title: 'Search or browse', body: 'Filter by category, or search by topic, author or keyword to reach a reference in a keystroke.' },
    { title: 'Open the record', body: 'Every reference opens with a lead paragraph, complete metadata and a full preview of the file.' },
    { title: 'Download & cite', body: 'One click to download. Complete metadata attached so citations are trivial.' },
  ]

  return (
    <section className={`${container} py-[var(--editable-section-y)]`}>
      <EditableReveal>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-[var(--slot4-accent)]">How it works</p>
            <h2 className="editable-display mt-4 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
              Designed to sit inside your workflow.
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">
            The library is intentionally quiet. Three steps between you and a citation-ready reference.
          </p>
        </div>
      </EditableReveal>

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {steps.map((step, i) => (
          <EditableReveal key={step.title} index={i}>
            <div className="group h-full rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-8 transition duration-500 hover:border-[var(--slot4-accent)]">
              <p className="editable-display text-[3.5rem] font-semibold leading-none tracking-[-0.04em] text-[var(--slot4-accent)]">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="editable-display mt-8 text-2xl font-semibold tracking-[-0.02em]">{step.title}</h3>
              <p className="mt-4 text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">{step.body}</p>
            </div>
          </EditableReveal>
        ))}
      </div>
    </section>
  )
}

/* --------------------------- Recent additions --------------------------- */

const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: 'This week', title: 'Freshly added references' },
  browse: { eyebrow: 'Popular', title: 'Most opened this month' },
  index: { eyebrow: 'From the archive', title: 'Evergreen references' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections = timeSections.length > 0
    ? timeSections
    : ([
        { key: 'spotlight', posts: posts.slice(0, 6), href: primaryRoute },
        { key: 'browse', posts: posts.slice(6, 12), href: primaryRoute },
      ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])
  const visible = sections.filter((s) => s.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More from the shelf' }
        return (
          <section key={section.key} className={`${container} py-[var(--editable-section-y)]`}>
            <EditableReveal>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                    {copy.eyebrow}
                  </p>
                  <h2 className="editable-display mt-4 text-[clamp(1.8rem,3.4vw,2.8rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                    {copy.title}
                  </h2>
                </div>
                <Link
                  href={section.href || primaryRoute}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
                >
                  Browse all <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </EditableReveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {section.posts.slice(0, 8).map((post, i) => (
                <EditableReveal key={post.id || post.slug} index={i}>
                  <Link
                    href={postHref(primaryTask, post, primaryRoute)}
                    className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-accent)]"
                  >
                    <div className="relative aspect-[16/11] overflow-hidden">
                      <img
                        src={getEditablePostImage(post)}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="editable-mono text-[10px] uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                        {getEditableCategory(post)}
                      </p>
                      <h3 className="editable-display mt-2 line-clamp-3 text-lg font-semibold leading-[1.2] tracking-[-0.01em]">
                        {post.title}
                      </h3>
                      <p className="mt-3 line-clamp-2 flex-1 text-[13px] leading-[1.6] text-[var(--slot4-muted-text)]">
                        {getEditableExcerpt(post, 100)}
                      </p>
                    </div>
                  </Link>
                </EditableReveal>
              ))}
            </div>
          </section>
        )
      })}
    </>
  )
}

/* ----------------------- Testimonial / trust band ----------------------- */

export function EditableTrustBand() {
  const lines = [
    'A quiet, well-organized reference library.',
    'Free to open. Free to cite.',
    'Metadata on every entry.',
    'New references filed weekly.',
    'No gates. No ads inside your reading.',
    'Built to disappear into your workflow.',
  ]
  return (
    <section className="overflow-hidden border-y border-[var(--editable-border)] py-14">
      <div className="editable-marquee flex whitespace-nowrap will-change-transform">
        {[...lines, ...lines].map((line, i) => (
          <span
            key={i}
            className="editable-display mx-10 inline-flex items-center gap-10 text-[clamp(2rem,4vw,3.2rem)] font-semibold tracking-[-0.03em] text-[var(--slot4-muted-text)]"
          >
            {line}
            <Quote className="h-6 w-6 text-[var(--slot4-accent)]" />
          </span>
        ))}
      </div>
    </section>
  )
}

/* -------------------------------- FAQ ---------------------------------- */

export function EditableFaqSection() {
  const items = [
    {
      q: 'Is every reference really free to download?',
      a: 'Yes. Every entry is free to open, download and cite — no accounts, no gates, no gated PDFs.',
    },
    {
      q: 'How often are new references added?',
      a: 'New references are filed weekly. Older entries get updates when the underlying material changes.',
    },
    {
      q: 'Can I suggest a topic that is missing?',
      a: `Yes. Use the contact page — the library grows from what visitors actually ask for.`,
    },
    {
      q: 'How is the library organised?',
      a: 'Every entry is filed under a clear category and paired with metadata (pages, size, updated date) so filtering and citing are both trivial.',
    },
  ]
  return (
    <section className={`${container} py-[var(--editable-section-y)]`}>
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <EditableReveal>
          <div>
            <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-[var(--slot4-accent)]">FAQ</p>
            <h2 className="editable-display mt-4 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
              Questions answered up front.
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">
              The library is intentionally simple. The details below cover the usual questions.
            </p>
          </div>
        </EditableReveal>

        <div className="divide-y divide-[var(--editable-border)] border-y border-[var(--editable-border)]">
          {items.map((item, i) => (
            <EditableReveal key={item.q} index={i}>
              <details className="group py-7">
                <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                  <span className="editable-display text-lg font-medium tracking-[-0.02em] sm:text-xl">{item.q}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border-strong)] text-[var(--slot4-accent)] transition group-open:rotate-45">
                    <span className="text-lg leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-5 max-w-2xl text-[15px] leading-[1.75] text-[var(--slot4-muted-text)]">{item.a}</p>
              </details>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- CTA band ------------------------------- */

export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section className={`${container} pb-[var(--editable-section-y)]`}>
      <EditableReveal>
        <div className="relative overflow-hidden rounded-[32px] border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] px-8 py-20 sm:px-14 lg:px-20">
          <div className="pointer-events-none absolute inset-0 [background:radial-gradient(70%_60%_at_100%_0%,rgba(136,239,86,0.14),transparent_60%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <span className="editable-mono inline-flex items-center gap-1.5 rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                {cta.badge}
              </span>
              <h2 className="editable-display mt-6 max-w-3xl text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
                {cta.title}
              </h2>
              <p className="mt-6 max-w-xl text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">{cta.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <Link
                href={cta.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-105"
              >
                <Download className="h-4 w-4" /> {cta.primaryCta.label}
              </Link>
              <Link
                href={cta.secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
              >
                {cta.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </EditableReveal>
    </section>
  )
}
