import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pagesContent } from '@/editable/content/pages.content'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]
const container = 'mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-container-pad)]'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  // Never surface contributor pages in the public search UI.
  if (derivedTask === 'profile') return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function ResultCard({ post }: { post: SitePost }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'pdf'}`}/${post.slug}`
  const summary = summaryOf(post)
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-[24px] border border-[var(--slot4-panel-bg)] bg-[var(--slot4-panel-bg)] p-8 transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-accent)]"
    >
      <div className="editable-display flex h-14 w-14 items-center justify-center rounded-[14px] bg-[var(--slot4-page-bg)] text-base font-semibold tracking-[-0.03em] text-[var(--slot4-accent)]">
        PDF
      </div>
      <h3 className="editable-display mt-6 line-clamp-3 text-xl font-semibold leading-[1.15] tracking-[-0.02em]">
        {post.title}
      </h3>
      {summary ? (
        <p className="mt-4 line-clamp-3 flex-1 text-[14px] leading-[1.65] text-[var(--slot4-muted-text)]">{stripHtml(summary)}</p>
      ) : null}
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-accent)]">
        Open resource <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  // Public search is Reference Library only.
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: 'pdf' } : undefined)
  const posts = feed?.posts?.length ? feed.posts : (useMaster ? [] : getMockPostsForTask('pdf'))
  const results = posts.filter((post) => matches(post, normalized, category)).slice(0, normalized ? 80 : 36)

  return (
    <EditableSiteShell>
      <main>
        <section className={`${container} pt-24 pb-12 sm:pt-32`}>
          <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <EditableReveal index={0}>
                <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
                  {pagesContent.search.hero.badge}
                </span>
              </EditableReveal>
              <EditableReveal index={1}>
                <h1 className="editable-display mt-8 text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[1] tracking-[-0.04em]">
                  {pagesContent.search.hero.title}
                </h1>
              </EditableReveal>
              <EditableReveal index={2}>
                <p className="mt-8 max-w-xl text-lg leading-[1.65] text-[var(--slot4-muted-text)]">
                  {pagesContent.search.hero.description}
                </p>
              </EditableReveal>
            </div>

            <EditableReveal>
              <form action="/search" className="rounded-[28px] border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] p-6">
                <input type="hidden" name="master" value="1" />
                <label className="flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-5 py-3">
                  <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
                  <input
                    name="q"
                    defaultValue={query}
                    placeholder={pagesContent.search.hero.placeholder}
                    className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                  />
                </label>
                <label className="mt-3 flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-5 py-3">
                  <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                  <input
                    name="category"
                    defaultValue={category}
                    placeholder="Category"
                    className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                  />
                </label>
                <button type="submit" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent)] px-6 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-105">
                  Search the library
                </button>
              </form>
            </EditableReveal>
          </div>
        </section>

        <section className={`${container} pb-[var(--editable-section-y)]`}>
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-[var(--editable-border)] pt-14">
            <div>
              <p className="editable-mono text-[11px] uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
                {results.length} results
              </p>
              <h2 className="editable-display mt-3 text-[clamp(1.8rem,3.4vw,2.8rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                {query ? `Results for “${query}”` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link href="/pdf" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">
              Browse the shelf <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {results.length ? (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((post, i) => (
                <EditableReveal key={post.id || post.slug} index={i % 6}>
                  <ResultCard post={post} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-[24px] border border-dashed border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-14 text-center">
              <p className="editable-display text-2xl font-semibold tracking-[-0.03em]">No matches on the shelf.</p>
              <p className="mt-3 text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">Try another keyword or category.</p>
            </div>
          )}

          <div className="mt-16">
            <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel className="mx-auto w-full" />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
