'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, FileText, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'
const container = 'mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-container-pad)]'

const fieldClass =
  'w-full rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-5 py-3.5 text-[15px] text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  // Public Create UI is for resource submission only. Never surface profile
  // creation as a public option, even when the profile task is enabled.
  const publishableTasks = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile'),
    []
  )
  const defaultTask = (publishableTasks.find((t) => t.key === 'pdf')?.key || publishableTasks[0]?.key || 'pdf') as TaskKey
  const [task, setTask] = useState<TaskKey>(defaultTask)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main>
          <section className={`${container} py-24`}>
            <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <EditableReveal>
                <div className="flex aspect-[4/5] items-center justify-center rounded-[28px] border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)]">
                  <Lock className="h-24 w-24 text-[var(--slot4-accent)] opacity-80" />
                </div>
              </EditableReveal>
              <EditableReveal>
                <div>
                  <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
                    {pagesContent.create.locked.badge}
                  </span>
                  <h1 className="editable-display mt-8 text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[1] tracking-[-0.04em]">
                    {pagesContent.create.locked.title}
                  </h1>
                  <p className="mt-8 max-w-xl text-lg leading-[1.65] text-[var(--slot4-muted-text)]">
                    {pagesContent.create.locked.description}
                  </p>
                  <div className="mt-10 flex flex-wrap gap-3">
                    <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-105">
                      Sign in <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">
                      Get started
                    </Link>
                  </div>
                </div>
              </EditableReveal>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main>
        <section className={`${container} py-20`}>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <EditableReveal>
              <aside>
                <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
                  {pagesContent.create.hero.badge}
                </span>
                <h1 className="editable-display mt-8 text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[1] tracking-[-0.04em]">
                  {pagesContent.create.hero.title}
                </h1>
                <p className="mt-8 max-w-lg text-lg leading-[1.65] text-[var(--slot4-muted-text)]">
                  {pagesContent.create.hero.description}
                </p>
                {publishableTasks.length > 1 ? (
                  <div className="mt-10 grid gap-3 sm:grid-cols-2">
                    {publishableTasks.map((item) => {
                      const active = item.key === task
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setTask(item.key as TaskKey)}
                          className={`rounded-2xl border p-5 text-left transition ${
                            active
                              ? 'border-[var(--slot4-accent)] bg-[var(--slot4-accent)] text-[var(--slot4-on-accent)]'
                              : 'border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] text-[var(--slot4-page-text)] hover:border-[var(--slot4-accent)]'
                          }`}
                        >
                          <FileText className="h-5 w-5" />
                          <span className="editable-display mt-4 block text-lg font-semibold tracking-[-0.02em]">{item.label}</span>
                          <span className={`mt-1.5 block text-[13px] leading-[1.55] ${active ? 'opacity-80' : 'text-[var(--slot4-muted-text)]'}`}>
                            {item.description}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                ) : null}
              </aside>
            </EditableReveal>

            <EditableReveal>
              <form onSubmit={submit} className="rounded-[28px] border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] p-8 sm:p-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="editable-mono text-[10px] uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Filing to the library</p>
                    <h2 className="editable-display mt-2 text-2xl font-semibold tracking-[-0.03em]">{pagesContent.create.formTitle}</h2>
                  </div>
                  <span className="editable-mono rounded-full border border-[var(--editable-border)] px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
                    {session.name}
                  </span>
                </div>

                <div className="mt-8 grid gap-4">
                  <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Reference title" required />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
                    <input className={fieldClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Source URL" />
                  </div>
                  <input className={fieldClass} value={image} onChange={(e) => setImage(e.target.value)} placeholder="Cover image URL (optional)" />
                  <textarea className={`${fieldClass} min-h-28`} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short summary — one paragraph" required />
                  <textarea className={`${fieldClass} min-h-56`} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Full description, notes, or content" required />
                </div>

                {created ? (
                  <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[var(--slot4-accent)] bg-[var(--slot4-accent-soft)] p-4 text-[var(--slot4-accent)]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5" />
                    <div>
                      <p className="font-semibold">{pagesContent.create.successTitle}</p>
                      <p className="mt-1 text-sm opacity-90">{created.title}</p>
                    </div>
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent)] px-6 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-105"
                >
                  <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
                </button>
              </form>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
