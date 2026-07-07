'use client'

import Link from 'next/link'
import { ArrowUpRight, Github, Linkedin, Twitter } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Grabin-style dark footer.
  Multi-column: Brand + description | Discovery (Reference Library ONLY) |
  Resources (About/Contact) | Account (auth actions).
  Huge brand mark at the bottom, hairline divider, tiny legal row.
*/

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const referenceLibrary = SITE_CONFIG.tasks.find((task) => task.enabled && task.key === 'pdf')

  const columns = globalContent.footer?.columns

  return (
    <footer className="relative overflow-hidden border-t border-[var(--editable-border)] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-14 px-[var(--editable-container-pad)] py-20 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)]">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-11 w-11 object-contain" />
            </span>
            <span className="editable-display text-2xl font-semibold tracking-[-0.02em]">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-6 max-w-md text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">
            {globalContent.footer?.description || SITE_CONFIG.description}
          </p>
        </div>

        <div>
          <h3 className="editable-mono text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
            {columns?.[0]?.title || 'Discovery'}
          </h3>
          <div className="mt-6 grid gap-3">
            {referenceLibrary ? (
              <Link
                href={referenceLibrary.route}
                className="inline-flex items-center gap-2 text-[15px] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-accent)]"
              >
                {referenceLibrary.label} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            ) : null}
            <Link href="/search" className="inline-flex items-center gap-2 text-[15px] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-accent)]">
              Search <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div>
          <h3 className="editable-mono text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
            {columns?.[1]?.title || 'Resources'}
          </h3>
          <div className="mt-6 grid gap-3">
            <Link href="/about" className="text-[15px] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
              About
            </Link>
            <Link href="/contact" className="text-[15px] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
              Contact
            </Link>
          </div>
        </div>

        <div>
          <h3 className="editable-mono text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Account</h3>
          <div className="mt-6 grid gap-3">
            {session ? (
              <>
                <Link href="/create" className="text-[15px] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
                  Submit
                </Link>
                <button type="button" onClick={logout} className="text-left text-[15px] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[15px] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
                  Sign in
                </Link>
                <Link href="/signup" className="text-[15px] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none select-none overflow-hidden">
        <div className="editable-display px-[var(--editable-container-pad)] pb-2 text-[clamp(4rem,18vw,15rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-white/[0.04]">
          {SITE_CONFIG.name}
        </div>
      </div>

      <div className="border-t border-[var(--editable-border)]">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-center justify-between gap-3 px-[var(--editable-container-pad)] py-6 text-xs text-[var(--slot4-soft-muted-text)] sm:flex-row">
          <p>© {year} {SITE_CONFIG.name}. All rights reserved.</p>
          <p className="editable-mono uppercase tracking-[0.24em]">
            {globalContent.footer?.bottomNote || 'Built for open knowledge'}
          </p>
        </div>
      </div>
    </footer>
  )
}
