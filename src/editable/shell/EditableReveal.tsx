'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/*
  IntersectionObserver-driven fade + slide-up reveal used throughout the site.
  - Applies the hidden state ONLY after mount so JS-off visitors see content.
  - Per-item stagger via `index` (default step 90ms).
  - Respects prefers-reduced-motion (handled in editable-global.css).
*/

type IntrinsicTag = 'div' | 'section' | 'article' | 'span' | 'header' | 'main' | 'aside' | 'ul' | 'li'

export function EditableReveal({
  children,
  as: Tag = 'div',
  index = 0,
  step = 90,
  className = '',
  style,
  threshold = 0.12,
  once = true,
}: {
  children: ReactNode
  as?: IntrinsicTag
  index?: number
  step?: number
  className?: string
  style?: CSSProperties
  threshold?: number
  once?: boolean
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const node = ref.current
    if (!node) return
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [mounted, threshold, once])

  const inlineStyle: CSSProperties = {
    ...style,
    transitionDelay: mounted && !visible ? `${index * step}ms` : `${index * step}ms`,
  }

  const classes = [
    className,
    mounted ? 'editable-reveal' : '',
    mounted && visible ? 'is-visible' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const Element = Tag as unknown as 'div'
  return (
    <Element
      ref={ref as React.Ref<HTMLDivElement>}
      className={classes}
      style={inlineStyle}
    >
      {children}
    </Element>
  )
}
