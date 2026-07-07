'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X, PlusCircle, LogIn, UserPlus, LogOut } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Grabin-style dark pill navbar.

  - No task-page links (no directory, no library, no profile).
  - Center: About + Contact.
  - Right: search icon → /search, then auth actions.
  - Mobile menu mirrors the same links; no task labels.
*/

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const staticLinks: Array<{ label: string; href: string }> = [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[linear-gradient(180deg,rgba(245,242,242,0.96),rgba(245,242,242,0.82))] backdrop-blur-md" />
      <nav className="mx-auto flex min-h-[76px] w-full max-w-[var(--editable-container)] items-center gap-4 px-[var(--editable-container-pad)] py-4">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center  border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] transition group-hover:border-[var(--slot4-accent)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="editable-display block max-w-[220px] truncate text-lg font-semibold leading-none tracking-[-0.01em] text-[var(--slot4-page-text)]">
              {SITE_CONFIG.name}
            </span>
            <span className="editable-mono mt-1.5 block max-w-[220px] truncate text-[10px] uppercase tracking-[0.28em] text-[var(--slot4-muted-text)]">
              {globalContent.nav?.tagline || SITE_CONFIG.tagline}
            </span>
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)]/70 px-1.5 py-1.5 lg:flex">
          {staticLinks.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-[var(--slot4-accent)] text-[var(--slot4-on-accent)]'
                    : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-3">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)]/70 text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-105 sm:inline-flex"
              >
                <PlusCircle className="h-4 w-4" /> Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                aria-label="Logout"
                className="hidden h-11 w-11 items-center justify-center rounded-full border border-[var(--editable-border-strong)] text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-105 sm:inline-flex"
              >
                <UserPlus className="h-4 w-4" /> Get started
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--editable-border-strong)] text-[var(--slot4-page-text)] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-[var(--editable-container-pad)] py-6 lg:hidden">
          <div className="grid gap-1">
            {staticLinks.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-base font-medium transition ${
                    active
                      ? 'bg-[var(--slot4-accent)] text-[var(--slot4-on-accent)]'
                      : 'text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-panel-bg)] hover:text-[var(--slot4-page-text)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="my-3 h-px bg-[var(--editable-border)]" />
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-base font-medium text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-panel-bg)] hover:text-[var(--slot4-page-text)]"
            >
              Search
            </Link>
            {session ? (
              <>
                <Link href="/create" onClick={() => setOpen(false)} className="rounded-2xl bg-[var(--slot4-accent)] px-4 py-3 text-base font-semibold text-[var(--slot4-on-accent)]">
                  Submit
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                  className="rounded-2xl px-4 py-3 text-left text-base font-medium text-[var(--slot4-muted-text)]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-2xl border border-[var(--editable-border-strong)] px-4 py-3 text-base font-medium text-[var(--slot4-page-text)]">
                  Sign in
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-2xl bg-[var(--slot4-accent)] px-4 py-3 text-base font-semibold text-[var(--slot4-on-accent)]">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
