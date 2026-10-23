import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

// Hold to confirm, for irreversible steps: 2s linear fill on press,
// 200ms ease-out snap back on release (asymmetric timing).
const HOLD_MS = 2000

export function HoldButton({ children, onConfirm, className, holdMs = HOLD_MS }) {
  const [pressing, setPressing] = useState(false)
  const timer = useRef(null)

  const start = () => {
    if (timer.current) return
    setPressing(true)
    timer.current = setTimeout(() => {
      timer.current = null
      setPressing(false)
      onConfirm()
    }, holdMs)
  }

  const cancel = () => {
    clearTimeout(timer.current)
    timer.current = null
    setPressing(false)
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <button
      type="button"
      className={clsx('btn hold', className)}
      style={{ '--hold-ms': `${holdMs}ms` }}
      data-pressing={pressing || undefined}
      onPointerDown={(e) => {
        if (e.button !== 0) return
        e.currentTarget.setPointerCapture(e.pointerId)
        start()
      }}
      onPointerUp={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
          e.preventDefault()
          start()
        }
      }}
      onKeyUp={(e) => {
        if (e.key === ' ' || e.key === 'Enter') cancel()
      }}
      onBlur={cancel}
    >
      <span className="hold-fill" aria-hidden="true" />
      {children}
    </button>
  )
}
