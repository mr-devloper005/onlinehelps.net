import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, ArrowUpRight, Bookmark, Building2, Download, ExternalLink, FileText,
  Globe2, Mail, MapPin, Phone, Tag, UserRound, Link as LinkIcon, ShieldCheck, Sparkles, Verified,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { taskThemeStyle } from '@/editable/theme/task-themes'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  // Contributor pages must NEVER link to other contributors — pull related from
  // the primary Reference Library instead so the strip stays library-facing.
  const contributorRelated = task === 'profile'
    ? (await fetchTaskPosts('pdf', 5)).slice(0, 4)
    : related
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={task === 'profile' ? contributorRelated : related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_m, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_m, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_m, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
function formatBytes(bytes: number | null | undefined): string | null {
  if (!bytes || !Number.isFinite(bytes) || bytes <= 0) return null
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let n = bytes
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i += 1
  }
  const rounded = n >= 100 || i === 0 ? Math.round(n) : Number(n.toFixed(1))
  return `${rounded} ${units[i]}`
}

async function fetchPdfSizeBytes(url: string): Promise<number | null> {
  if (!url || !/^https?:\/\//i.test(url)) return null
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 3500)
    const doFetch = (method: 'HEAD' | 'GET') =>
      fetch(url, {
        method,
        signal: controller.signal,
        // Some hosts don't advertise Content-Length on HEAD but do on a ranged GET.
        ...(method === 'GET' ? { headers: { Range: 'bytes=0-0' } } : {}),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: { revalidate: 60 * 60 * 24 } as any,
      })
    try {
      let res = await doFetch('HEAD')
      let len = res.headers.get('content-length')
      let range = res.headers.get('content-range')
      if (!len && !range) {
        res = await doFetch('GET')
        len = res.headers.get('content-length')
        range = res.headers.get('content-range')
      }
      const total = range && /\/(\d+)/.exec(range)?.[1]
      const bytes = Number(total || len)
      return Number.isFinite(bytes) && bytes > 0 ? bytes : null
    } finally {
      clearTimeout(timer)
    }
  } catch {
    return null
  }
}

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* ------------------------------ Shared bits ------------------------------ */

function Kicker({ task, children }: { task: TaskKey; children?: React.ReactNode }) {
  const voice = taskPageVoices[task]
  return (
    <div className="editable-mono inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.28em] text-[var(--tk-accent)]">
      <span>{voice?.eyebrow || task}</span>
      {children ? (
        <>
          <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)] opacity-60" />
          <span className="text-[var(--tk-muted)]">{children}</span>
        </>
      ) : null}
    </div>
  )
}

function BackLink({ task, label }: { task: TaskKey; label?: string }) {
  const taskConfig = getTaskConfig(task)
  const href = task === 'profile' ? '/' : taskConfig?.route || '/'
  return (
    <Link href={href} className="editable-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
      <ArrowLeft className="h-3.5 w-3.5" /> {label || (task === 'profile' ? 'Back to library' : `Back to ${taskConfig?.label || 'library'}`)}
    </Link>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-10 max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-[1.75]' : 'text-[17px] leading-[1.8]'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function Divider() {
  return <div className="my-12 h-px bg-[var(--tk-line)]" />
}

/* --------------------------------- PDF --------------------------------- */
/*
  Reference Library detail — the primary public surface.
  Document workspace layout: label chip row → huge title → pull-quote lead →
  dual CTA → quick-facts strip → large embedded preview (article visual
  centerpiece) → two-column body → article-bottom Ads → repeated CTA →
  sticky sidebar with document identity + "What's inside" + related strip.
  No dates shown anywhere.
*/

async function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const filename = getField(post, ['filename', 'fileName']) || (fileUrl ? fileUrl.split('/').pop() || 'reference.pdf' : 'reference.pdf')
  const pages = getField(post, ['pages', 'pageCount']) || '—'
  // Prefer explicit metadata on the post, else fetch the actual Content-Length
  // from the file URL via a HEAD request (with a ranged GET fallback for hosts
  // that don't advertise it on HEAD). Result is cached daily.
  const explicitSize = getField(post, ['fileSize', 'size'])
  const measuredBytes = explicitSize ? null : fileUrl ? await fetchPdfSizeBytes(fileUrl) : null
  const size = explicitSize || formatBytes(measuredBytes) || '—'
  const category = categoryOf(post, 'Reference')
  const uploader = getField(post, ['uploader', 'author', 'contributor']) || SITE_CONFIG.name
  const container = 'mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-container-pad)]'

  const inside = (() => {
    const raw = getBody(post)
    const stripped = stripHtml(raw)
    const parts = stripped.split(/\n|\.\s+/).map((s) => s.trim()).filter((s) => s.length >= 20).slice(0, 5)
    return parts.length ? parts : ['Executive summary', 'Method', 'Findings', 'References']
  })()

  return (
    <>
      <section className={`${container} pt-16 pb-10 sm:pt-24`}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="editable-mono inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-accent)] px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[var(--tk-on-accent)]">
            Reference document
          </span>
          <span className="editable-mono inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[var(--tk-muted)]">
            <FileText className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> PDF
          </span>
          <span className="editable-mono inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[var(--tk-muted)]">
            {category}
          </span>
        </div>

        <div className="mt-6">
          <BackLink task="pdf" label="Back to the library" />
        </div>

        <h1 className="editable-display mt-8 max-w-5xl text-balance text-[clamp(2.4rem,6vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
          {post.title}
        </h1>

        {leadText(post) ? (
          <blockquote className="editable-display mt-10 max-w-4xl border-l-2 border-[var(--tk-accent)] pl-6 text-[clamp(1.15rem,1.8vw,1.5rem)] font-medium italic leading-[1.5] tracking-[-0.01em] text-[var(--tk-text)]">
            “{leadText(post)}”
          </blockquote>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center gap-3">
          {fileUrl ? (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-7 py-3.5 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:brightness-105"
            >
              <Download className="h-4 w-4" /> Download PDF
            </a>
          ) : null}
          {fileUrl ? (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-7 py-3.5 text-sm font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]"
            >
              Open in new tab <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-6 border-y border-[var(--tk-line)] py-7 sm:grid-cols-3">
          {[
           
            ['File size', size],
            ['Format', 'PDF'],
            ['Category', category],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="editable-mono text-[10px] uppercase tracking-[0.24em] text-[var(--tk-muted)]">{label}</dt>
              <dd className="editable-display mt-2 text-[15px] font-medium tracking-[-0.01em] text-[var(--tk-text)]">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={`${container} pb-16`}>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            {fileUrl ? (
              <div className="overflow-hidden rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] px-5 py-4">
                  <span className="editable-mono text-[10px] uppercase tracking-[0.24em] text-[var(--tk-muted)]">Document preview</span>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="editable-mono inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-accent)] px-3.5 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[var(--tk-on-accent)]"
                  >
                    Download <Download className="h-3.5 w-3.5" />
                  </a>
                </div>
                <iframe
                  src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  title={post.title}
                  className="h-[80vh] w-full bg-[var(--tk-raised)]"
                />
              </div>
            ) : null}

            <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-[var(--tk-accent)]">Inside the document</p>
                <h2 className="editable-display mt-4 text-[clamp(2rem,3.4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                  A working reference, filed for open citation.
                </h2>
              </div>
              <BodyContent post={post} />
            </div>

            {post.tags?.length ? (
              <div className="mt-12 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="editable-mono rounded-full border border-[var(--tk-line)] px-3.5 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[var(--tk-muted)]">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-12">
              <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel className="mx-auto w-full" />
            </div>

            {fileUrl ? (
              <div className="mt-14 rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-10">
                <p className="editable-mono text-[10px] uppercase tracking-[0.24em] text-[var(--tk-accent)]">Take it with you</p>
                <h3 className="editable-display mt-4 text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
                  Download the full PDF, free.
                </h3>
                <p className="mt-4 max-w-lg text-[15px] leading-[1.7] text-[var(--tk-muted)]">
                  Open, download and cite. Complete metadata attached — pages, size, category — so citations are trivial.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-7 py-3.5 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:brightness-105"
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-7 py-3.5 text-sm font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]"
                  >
                    Open in new tab <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ) : null}
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8">
              <div className="editable-display flex h-24 w-24 items-center justify-center rounded-[18px] bg-[var(--tk-raised)] text-[2rem] font-semibold tracking-[-0.05em] text-[var(--tk-accent)]">
                PDF
              </div>
              <p className="editable-mono mt-6 break-all text-[11px] uppercase tracking-[0.16em] text-[var(--tk-muted)]">{filename}</p>
              <dl className="mt-6 space-y-4 border-t border-[var(--tk-line)] pt-6 text-sm">
                {[
                  ['Category', category, Tag],
                 
                  ['File size', size, Sparkles],
                  ['Filed by', uploader, UserRound],
                ].map(([label, value, Icon]) => (
                  <div key={label as string} className="flex items-start justify-between gap-3">
                    <dt className="editable-mono inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.24em] text-[var(--tk-muted)]">
                      {(() => {
                        const IconEl = Icon as typeof FileText
                        return <IconEl className="h-3.5 w-3.5 text-[var(--tk-accent)]" />
                      })()} {label as string}
                    </dt>
                    <dd className="max-w-[60%] text-right text-[13px] font-medium text-[var(--tk-text)]">{value as string}</dd>
                  </div>
                ))}
              </dl>
              {fileUrl ? (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:brightness-105"
                >
                  <Download className="h-4 w-4" /> Download
                </a>
              ) : null}
            </div>

            <div className="rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8">
              <p className="editable-mono text-[10px] uppercase tracking-[0.24em] text-[var(--tk-accent)]">What&apos;s inside</p>
              <ul className="mt-5 space-y-3 text-sm">
                {inside.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="editable-mono mt-0.5 text-[11px] tracking-[0.02em] text-[var(--tk-accent)]">{String(i + 1).padStart(2, '0')}</span>
                    <span className="line-clamp-2 leading-[1.55] text-[var(--tk-muted)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {related.length ? <PdfRelatedStrip related={related} /> : null}
    </>
  )
}

async function PdfRelatedStrip({ related }: { related: SitePost[] }) {
  const container = 'mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-container-pad)]'
  const sizeChips = await Promise.all(
    related.map(async (item) => {
      const explicit = getField(item, ['fileSize', 'size'])
      if (explicit) return explicit
      const fileUrl = getField(item, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
      const bytes = fileUrl ? await fetchPdfSizeBytes(fileUrl) : null
      return formatBytes(bytes) || 'PDF'
    })
  )
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className={`${container} py-20`}>
        <div className="flex items-end justify-between">
          <div>
            <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-[var(--tk-accent)]">Nearby on the shelf</p>
            <h2 className="editable-display mt-4 text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
              More references worth opening.
            </h2>
          </div>
          <Link href="/pdf" className="editable-mono inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.24em] text-[var(--tk-accent)]">
            Browse all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, idx) => {
            const filename = getField(item, ['filename', 'fileName']) || `${item.slug}.pdf`
            const size = sizeChips[idx] || 'PDF'
            return (
              <Link
                key={item.id || item.slug}
                href={`/pdf/${item.slug}`}
                className="group flex h-full flex-col rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 transition duration-500 hover:-translate-y-1 hover:border-[var(--tk-accent)]"
              >
                <div className="editable-display flex h-16 w-16 items-center justify-center rounded-[14px] bg-[var(--tk-raised)] text-lg font-semibold tracking-[-0.03em] text-[var(--tk-accent)]">
                  PDF
                </div>
                <h3 className="editable-display mt-6 line-clamp-3 text-lg font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--tk-text)]">
                  {item.title}
                </h3>
                <p className="editable-mono mt-auto pt-6 text-[10px] uppercase tracking-[0.22em] text-[var(--tk-muted)]">
                  {size}
                </p>
                <p className="editable-mono truncate text-[10px] text-[var(--tk-muted)]">{filename}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- Profile ------------------------------- */
/*
  Contributor detail — direct URL only, never surfaced. Premium record with
  hero band, avatar, serif-scale name, bio, quick-facts, tags, contributor's
  own filed references (link into the Reference Library), inline map when
  address exists, sticky right sidebar with contact card + Ads sidebar + trust
  panel. No dates. No links to other contributors.
*/

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const container = 'mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-container-pad)]'
  const images = getImages(post)
  const avatar = images[0]
  const role = getField(post, ['role', 'designation', 'title', 'company'])
  const location = getField(post, ['location', 'city', 'address'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const phone = getField(post, ['phone', 'mobile', 'telephone'])
  const twitter = getField(post, ['twitter'])
  const github = getField(post, ['github'])
  const linkedin = getField(post, ['linkedin'])
  const verified = Boolean(getField(post, ['verified']))
  const mapSrc = mapSrcFor(post)
  const bio = leadText(post)

  return (
    <>
      <section className={`${container} pt-16 pb-10 sm:pt-24`}>
        <BackLink task="profile" label="Back to library" />

        <div className="mt-10 grid gap-10 lg:grid-cols-[auto_1fr] lg:items-end">
          <div className="relative">
            <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)] sm:h-48 sm:w-48">
              {avatar ? (
                <img src={avatar} alt={post.title} className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-16 w-16 text-[var(--tk-muted)]" />
              )}
            </div>
            {verified ? (
              <span className="absolute -right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-[var(--tk-accent)] px-2.5 py-1 text-[10px] font-semibold text-[var(--tk-on-accent)]">
                <Verified className="h-3.5 w-3.5" /> Verified
              </span>
            ) : null}
          </div>

          <div className="min-w-0">
            <Kicker task="profile">Contributor record</Kicker>
            <h1 className="editable-display mt-5 text-balance text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
              {post.title}
            </h1>
            {role ? (
              <p className="editable-mono mt-5 text-[13px] uppercase tracking-[0.22em] text-[var(--tk-accent)]">{role}</p>
            ) : null}
          </div>
        </div>

        {bio ? (
          <p className="mt-12 max-w-3xl text-[clamp(1.05rem,1.4vw,1.35rem)] leading-[1.65] text-[var(--tk-muted)]">
            {bio}
          </p>
        ) : null}

        <dl className="mt-12 grid grid-cols-2 gap-6 border-y border-[var(--tk-line)] py-8 sm:grid-cols-3">
          {[
            ['Location', location || '—'],
           
            ['Links', [website, twitter, github, linkedin].filter(Boolean).length || '—'],
            ['Status', verified ? 'Verified' : 'Contributor'],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="editable-mono text-[10px] uppercase tracking-[0.24em] text-[var(--tk-muted)]">{label}</dt>
              <dd className="editable-display mt-2 truncate text-[15px] font-medium tracking-[-0.01em] text-[var(--tk-text)]">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={`${container} pb-16`}>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-[var(--tk-accent)]">About the contributor</p>
            <h2 className="editable-display mt-4 text-[clamp(2rem,3.4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
              A quiet record of the work filed.
            </h2>
            <BodyContent post={post} />

            {post.tags?.length ? (
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="editable-mono rounded-full border border-[var(--tk-line)] px-3.5 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[var(--tk-muted)]">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <Divider />

            {related.length ? (
              <>
                <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-[var(--tk-accent)]">Filed to the library</p>
                <h3 className="editable-display mt-4 text-[clamp(1.6rem,2.8vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
                  References from this contributor.
                </h3>
                <div className="mt-10 grid gap-5 sm:grid-cols-2">
                  {related.map((item) => (
                    <Link
                      key={item.id || item.slug}
                      href={`/pdf/${item.slug}`}
                      className="group flex h-full flex-col rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 transition duration-500 hover:-translate-y-1 hover:border-[var(--tk-accent)]"
                    >
                      <div className="editable-display flex h-14 w-14 items-center justify-center rounded-[14px] bg-[var(--tk-raised)] text-base font-semibold tracking-[-0.03em] text-[var(--tk-accent)]">
                        PDF
                      </div>
                      <h4 className="editable-display mt-6 line-clamp-3 text-lg font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--tk-text)]">
                        {item.title}
                      </h4>
                      <span className="editable-mono mt-auto pt-6 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-[var(--tk-accent)]">
                        Open reference <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            ) : null}

            {mapSrc ? (
              <>
                <Divider />
                <p className="editable-mono text-[11px] uppercase tracking-[0.28em] text-[var(--tk-accent)]">Based in</p>
                <div className="mt-6 overflow-hidden rounded-[20px] border border-[var(--tk-line)]">
                  <iframe src={mapSrc} title="Map" loading="lazy" className="h-80 w-full border-0" />
                </div>
              </>
            ) : null}
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
              <p className="editable-mono text-[10px] uppercase tracking-[0.24em] text-[var(--tk-muted)]">Contact</p>
              <div className="mt-5 space-y-1">
                {location ? <ContactRow icon={MapPin} label="Address" value={location} /> : null}
                {phone ? <ContactRow icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} /> : null}
                {email ? <ContactRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} /> : null}
                {website ? <ContactRow icon={Globe2} label="Website" value={website.replace(/^https?:\/\//, '')} href={website} external /> : null}
                {twitter ? <ContactRow icon={LinkIcon} label="Twitter" value={`@${twitter.replace(/^@/, '')}`} href={twitter.startsWith('http') ? twitter : `https://twitter.com/${twitter.replace(/^@/, '')}`} external /> : null}
                {linkedin ? <ContactRow icon={LinkIcon} label="LinkedIn" value="linkedin" href={linkedin} external /> : null}
                {github ? <ContactRow icon={LinkIcon} label="GitHub" value="github" href={github} external /> : null}
              </div>
              {(website || email) ? (
                <a
                  href={website || `mailto:${email}`}
                  target={website ? '_blank' : undefined}
                  rel={website ? 'noreferrer' : undefined}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:brightness-105"
                >
                  {website ? 'Visit website' : 'Send email'} <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : null}
            </div>

            <div className="rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
              <p className="editable-mono text-[10px] uppercase tracking-[0.24em] text-[var(--tk-accent)]">Trust</p>
              <ul className="mt-5 space-y-4 text-sm">
                {[
                  ['Verified contributor', true],
                  ['References filed to open library', true],
                  ['Reachable via listed contact', Boolean(website || email || phone)],
                ].map(([label, ok]) => (
                  <li key={label as string} className="flex items-start gap-3">
                    {ok ? (
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                    ) : (
                      <span className="mt-1 h-4 w-4 shrink-0 rounded-full border border-[var(--tk-line)]" />
                    )}
                    <span className={`leading-[1.5] ${ok ? 'text-[var(--tk-text)]' : 'text-[var(--tk-muted)]'}`}>{label as string}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-2">
              <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel className="mx-auto w-full" />
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

function ContactRow({ icon: Icon, label, value, href, external = false }: { icon: typeof MapPin; label: string; value: string; href?: string; external?: boolean }) {
  const inner = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--tk-line)] text-[var(--tk-accent)]">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="editable-mono block text-[10px] uppercase tracking-[0.22em] text-[var(--tk-muted)]">{label}</span>
        <span className="mt-0.5 block truncate text-[13px] font-medium text-[var(--tk-text)]">{value}</span>
      </span>
      {external ? <ArrowUpRight className="h-3.5 w-3.5 text-[var(--tk-muted)]" /> : null}
    </>
  )
  if (href) {
    return (
      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className="flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-[var(--tk-raised)]">
        {inner}
      </a>
    )
  }
  return <div className="flex items-center gap-3 px-2 py-2">{inner}</div>
}

/* ------------------------------- Legacy branches (kept functional but not promoted) ------------------------------- */

function ArticleDetail({ post, related: _related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <>
      <article className="mx-auto max-w-3xl px-[var(--editable-container-pad)] py-20">
        <BackLink task="article" />
        <p className="editable-mono mt-10 text-[11px] uppercase tracking-[0.28em] text-[var(--tk-accent)]">{categoryOf(post, 'Note')}</p>
        <h1 className="editable-display mt-6 text-balance text-[clamp(2rem,4.4vw,4rem)] font-semibold leading-[1] tracking-[-0.04em]">{post.title}</h1>
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
    </>
  )
}

function ListingDetail({ post }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-3xl px-[var(--editable-container-pad)] py-20">
      <BackLink task="listing" />
      <div className="mt-10 flex items-center gap-5">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
          {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-10 w-10 text-[var(--tk-muted)]" />}
        </div>
        <div>
          <Kicker task="listing" />
          <h1 className="editable-display mt-3 text-3xl font-semibold tracking-[-0.03em]">{post.title}</h1>
        </div>
      </div>
      <BodyContent post={post} />
    </section>
  )
}

function ClassifiedDetail({ post }: { post: SitePost; related: SitePost[] }) {
  return (
    <section className="mx-auto max-w-3xl px-[var(--editable-container-pad)] py-20">
      <BackLink task="classified" />
      <Kicker task="classified" />
      <h1 className="editable-display mt-6 text-3xl font-semibold tracking-[-0.03em]">{post.title}</h1>
      <BodyContent post={post} />
    </section>
  )
}

function ImageDetail({ post }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-4xl px-[var(--editable-container-pad)] py-20">
      <BackLink task="image" />
      <Kicker task="image" />
      <h1 className="editable-display mt-6 text-3xl font-semibold tracking-[-0.03em]">{post.title}</h1>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {images.map((image, i) => (
          <img key={`${image}-${i}`} src={image} alt="" className="rounded-[16px] border border-[var(--tk-line)]" />
        ))}
      </div>
      <BodyContent post={post} compact />
    </section>
  )
}

function BookmarkDetail({ post }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <section className="mx-auto max-w-3xl px-[var(--editable-container-pad)] py-20">
      <BackLink task="sbm" />
      <div className="mt-10 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><Bookmark className="h-6 w-6" /></div>
      <Kicker task="sbm" />
      <h1 className="editable-display mt-4 text-3xl font-semibold tracking-[-0.03em]">{post.title}</h1>
      {website ? (
        <a href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3 text-sm font-semibold text-[var(--tk-on-accent)]">
          Open resource <ExternalLink className="h-4 w-4" />
        </a>
      ) : null}
      <BodyContent post={post} />
    </section>
  )
}
