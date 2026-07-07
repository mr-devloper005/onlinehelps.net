import Link from 'next/link'
import { ArrowUpRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing on this shelf yet',
  description = 'Fresh references will appear here as soon as they are filed.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        'rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-12 text-center',
        className
      )}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
        <SearchX className="h-6 w-6" />
      </div>
      <h2 className="editable-display mt-6 text-2xl font-semibold tracking-[-0.03em]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">{description}</p>
      <Link
        href={actionHref}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-6 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
      >
        {actionLabel}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'references', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`New ${taskLabel} filed to the library will appear here as soon as they are ready.`}
      actionLabel="Explore the library"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. We reply from a real inbox — usually within a working day."
      actionLabel="Back to library"
      actionHref="/"
    />
  )
}
