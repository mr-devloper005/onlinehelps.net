import Link from 'next/link'
import { ChevronDown, Download, Search, Sparkles } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { taskThemeStyle } from '@/editable/theme/task-themes'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-container-pad)]'

export async function EditableTaskArchiveRoute({
  task, searchParams, basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const voice = taskPageVoices[task]
  const page = pagination.page || 1
  const total = posts.length
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        <header className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_60%_at_20%_10%,var(--tk-glow),transparent_65%)]" />
          <div className={`${container} relative pt-24 pb-16 sm:pt-32`}>
            <EditableReveal index={0}>
              <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--tk-accent)]" />
                {voice?.eyebrow || 'Library'}
              </span>
            </EditableReveal>

            <EditableReveal index={1}>
              <h1 className="editable-display mt-8 max-w-4xl text-balance text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
                {voice?.headline || 'The library'}
              </h1>
            </EditableReveal>

            <EditableReveal index={2}>
              <p className="mt-8 max-w-2xl text-lg leading-[1.65] text-[var(--tk-muted)]">{voice?.description}</p>
            </EditableReveal>

            {voice?.chips?.length ? (
              <EditableReveal index={3}>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  {voice.chips.map((chip) => (
                    <span key={chip} className="editable-mono rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                      {chip}
                    </span>
                  ))}
                </div>
              </EditableReveal>
            ) : null}

            <EditableReveal index={4}>
              <div className="mt-14 flex flex-col gap-6 border-t border-[var(--tk-line)] pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="editable-mono text-[11px] uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                  <span className="text-[var(--tk-text)]">{total}</span> · {categoryLabel}
                </p>
                <form action={basePath} className="flex items-center gap-2.5">
                  <div className="relative">
                    <select
                      name="category"
                      defaultValue={category}
                      className="h-11 appearance-none rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] pl-5 pr-11 text-sm font-medium text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-accent)]"
                      aria-label={voice?.filterLabel || 'Filter category'}
                    >
                      <option value="all">All categories</option>
                      {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                  </div>
                  <button className="inline-flex h-11 items-center rounded-full bg-[var(--tk-accent)] px-6 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:brightness-105">Apply</button>
                </form>
              </div>
            </EditableReveal>

            {task === 'pdf' ? (
              <EditableReveal index={5}>
                <div className="mt-10">
                  <Ads slot="header" size={pickRandom(getSlotSizes('header'))} showLabel className="mx-auto w-full" />
                </div>
              </EditableReveal>
            ) : null}
          </div>
        </header>

        <section className={`${container} pb-24`}>
          {posts.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={index % 6}>
                  <ArchivePostCard post={post} task={task} basePath={basePath} index={index} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-[24px] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] px-8 py-20 text-center">
              <Search className="mx-auto h-7 w-7 text-[var(--tk-accent)]" />
              <h2 className="editable-display mt-6 text-2xl font-semibold tracking-[-0.03em]">Nothing on this shelf yet</h2>
              <p className="mt-3 text-[15px] leading-[1.7] text-[var(--tk-muted)]">Try another category, or check back after new references are filed.</p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-20 flex items-center justify-center gap-3">
              {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="editable-mono inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[var(--tk-text)] transition hover:border-[var(--tk-accent)]">Previous</Link> : null}
              <span className="editable-mono inline-flex items-center rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[var(--tk-muted)]">Page {page} of {pagination.totalPages || 1}</span>
              {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="editable-mono inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[var(--tk-text)] transition hover:border-[var(--tk-accent)]">Next</Link> : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  // The public archive that we promote is the Reference Library. Every task
  // archive card renders using the reference/library visual language.
  return <ReferenceCard post={post} href={href} />
}

function ReferenceCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'Reference')
  const filename = getField(post, ['filename', 'fileName']) || `${post.slug}.pdf`
  const size = getField(post, ['fileSize', 'size']) || 'PDF'
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 transition duration-500 hover:-translate-y-1 hover:border-[var(--tk-accent)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="editable-display flex h-16 w-16 items-center justify-center rounded-[16px] bg-[var(--tk-raised)] text-lg font-semibold tracking-[-0.03em] text-[var(--tk-accent)]">
          PDF
        </div>
        <span className="editable-mono rounded-full border border-[var(--tk-line)] px-3.5 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[var(--tk-muted)]">{category}</span>
      </div>
      <h2 className="editable-display mt-8 line-clamp-3 text-xl font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--tk-text)]">
        {post.title}
      </h2>
      <p className="mt-4 line-clamp-3 flex-1 text-[14px] leading-[1.65] text-[var(--tk-muted)]">{getSummary(post)}</p>
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-[var(--tk-line)] pt-5">
        <span className="editable-mono truncate text-[10px] uppercase tracking-[0.22em] text-[var(--tk-muted)]">
          {size} · {filename}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-accent)]">
          <Download className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
