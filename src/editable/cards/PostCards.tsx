import Link from 'next/link'
import { ArrowUpRight, FileText } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Reference'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/*
  All four card shapes are dark, hairline-bordered surfaces with the lime
  accent applied to the eyebrow and the arrow ligature. Buttons are pills.
*/

export function EditorialFeatureCard({ post, href, label = 'Featured resource' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden ${dc.surface.dark} border border-[var(--editable-border)] transition duration-500 hover:border-[var(--slot4-accent)]`}>
      <div className="relative min-h-[520px] p-8 sm:p-10 lg:min-h-[620px]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-55" />
        <div className={`absolute inset-0 ${pal.overlay}`} />
        <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-end lg:min-h-[560px]">
          <span className={dc.badge.accentPill}>{label}</span>
          <h3 className="editable-display mt-6 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">{post.title}</h3>
          <p className="mt-6 max-w-2xl text-[15px] leading-[1.7] text-white/75 sm:text-base">{getEditableExcerpt(post, 190)}</p>
          <span className={`mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-6 py-3 text-sm font-semibold text-[var(--slot4-on-accent)]`}>
            Open resource <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} aspect-[4/3]`}>
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <span className={`editable-mono absolute left-5 top-5 rounded-full bg-[var(--slot4-page-bg)]/85 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-page-text)] backdrop-blur-sm`}>
          №{String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-6">
        <p className={dc.type.eyebrow}>{getEditableCategory(post)}</p>
        <h3 className={`editable-display mt-3 line-clamp-3 text-xl font-semibold leading-[1.15] tracking-[-0.02em] ${pal.pageText}`}>{post.title}</h3>
        <p className={`mt-3 line-clamp-3 text-sm leading-[1.65] ${pal.mutedText}`}>{getEditableExcerpt(post, 135)}</p>
        <span className={`mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-accent)]`}>
          Open <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 ${dc.surface.soft} p-6 ${dc.motion.lift}`}>
      <div className="flex items-start gap-5">
        <span className={`editable-mono flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-page-bg)] text-[11px] font-medium tracking-[0.02em] text-[var(--slot4-accent)]`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className={dc.type.eyebrow}>{getEditableCategory(post)}</p>
          <h3 className={`editable-display mt-2 line-clamp-2 text-lg font-semibold leading-[1.18] tracking-[-0.02em] ${pal.pageText}`}>{post.title}</h3>
          <p className={`mt-2.5 line-clamp-2 text-sm leading-[1.6] ${pal.mutedText}`}>{getEditableExcerpt(post, 105)}</p>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-6 overflow-hidden ${dc.surface.card} p-5 ${dc.motion.lift} sm:grid-cols-[240px_minmax(0,1fr)]`}>
      <div className={`${dc.media.frame} aspect-[16/12] sm:aspect-auto sm:min-h-[200px]`}>
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="min-w-0 p-2 sm:py-4 sm:pr-4">
        <p className={dc.type.eyebrow}>{String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}</p>
        <h2 className={`editable-display mt-3 line-clamp-3 text-2xl font-semibold leading-[1.12] tracking-[-0.03em] ${pal.pageText} sm:text-3xl`}>{post.title}</h2>
        <p className={`mt-4 line-clamp-3 text-[15px] leading-[1.65] ${pal.mutedText}`}>{getEditableExcerpt(post, 180)}</p>
        <span className={`mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--slot4-accent)]`}>
          Open resource <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}

export { FileText as CardIcon }
