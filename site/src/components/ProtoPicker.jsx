import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// Prototype picker, per .claude/skills/prototype/PICKER.md. Chrome, not design:
// its styles are in proto-picker.css, copied verbatim. Only shown with ?proto=1.
export function ProtoPicker({ variants, current, onChange, onReplay }) {
  const navRef = useRef(null)
  const itemRefs = useRef([])
  const [highlight, setHighlight] = useState({ width: 0, x: 0 })
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    const move = () => {
      const el = itemRefs.current[current]
      if (el) setHighlight({ width: el.offsetWidth, x: el.offsetLeft })
    }
    move()
    window.addEventListener('resize', move)
    return () => window.removeEventListener('resize', move)
  }, [current])

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= variants.length) onChange(num - 1)
      else if (e.key === 'ArrowRight') onChange((current + 1) % variants.length)
      else if (e.key === 'ArrowLeft') onChange((current - 1 + variants.length) % variants.length)
      else if (e.key === 'r' || e.key === 'R') onReplay()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [current, variants.length, onChange, onReplay])

  return (
    <nav className="proto-picker" aria-label="Prototype variants" data-position="top" data-ready={ready || undefined} ref={navRef}>
      <span
        className="proto-picker-highlight"
        aria-hidden="true"
        style={{ width: highlight.width, transform: `translateX(${highlight.x}px)` }}
      />
      {variants.map((v, i) => (
        <button
          key={v.id}
          ref={(el) => (itemRefs.current[i] = el)}
          className="proto-picker-item"
          data-active={i === current || undefined}
          aria-current={i === current ? 'true' : undefined}
          onClick={() => onChange(i)}
        >
          {v.name}
        </button>
      ))}
      <span className="proto-picker-divider" aria-hidden="true" />
      <button className="proto-picker-item proto-picker-replay" aria-label="Replay animation (R)" onClick={onReplay}>
        ↻
      </button>
    </nav>
  )
}
