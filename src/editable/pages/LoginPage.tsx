import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pagesContent } from '@/editable/content/pages.content'

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-container-pad)]'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Sign in', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main>
        <section className={`${container} grid min-h-[calc(100vh-12rem)] items-center gap-14 py-20 lg:grid-cols-[1fr_0.9fr]`}>
          <EditableReveal>
            <div>
              <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
                {pagesContent.auth.login.badge}
              </span>
              <h1 className="editable-display mt-8 max-w-xl text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1] tracking-[-0.04em]">
                {pagesContent.auth.login.title}
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-[1.65] text-[var(--slot4-muted-text)]">
                {pagesContent.auth.login.description}
              </p>
            </div>
          </EditableReveal>
          <EditableReveal>
            <div className="rounded-[28px] border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] p-8 sm:p-10">
              <h2 className="editable-display text-2xl font-semibold tracking-[-0.03em]">{pagesContent.auth.login.formTitle}</h2>
              <EditableLocalLoginForm />
              <p className="mt-8 text-sm text-[var(--slot4-muted-text)]">
                New here?{' '}
                <Link href="/signup" className="font-medium text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                  {pagesContent.auth.login.createCta}
                </Link>
              </p>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
