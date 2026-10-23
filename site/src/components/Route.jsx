import { Fragment, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { LINES } from '../data.js'

const STOP_X = 48 // width of the line column
const X = STOP_X / 2

const KIND_LABEL = {
  done: 'Hecho',
  pending: 'Pendiente',
  ask: 'Espera tu permiso',
  discarded: 'Descartado',
  current: 'En curso',
}

// One task drawn as a metro line. State is a mark, not a hue:
// filled disc = done, ring = pending, vermilion bar = waiting for you, cross = discarded.
export function Route({ plan, states, trainAt, askSlot, live }) {
  const listRef = useRef(null)
  const stopRefs = useRef([])
  const [ys, setYs] = useState([])
  const [height, setHeight] = useState(0)
  const reduce = useReducedMotion()
  const color = LINES[plan.line].color

  useLayoutEffect(() => {
    const measure = () => {
      const list = listRef.current
      if (!list) return
      setHeight(list.offsetHeight)
      setYs(
        stopRefs.current
          .slice(0, plan.steps.length)
          .map((el) => (el ? el.offsetTop + el.offsetHeight / 2 : 0)),
      )
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(listRef.current)
    return () => ro.disconnect()
  }, [plan, states, askSlot])

  const first = ys[0] ?? 0
  const last = ys[ys.length - 1] ?? 0
  const askIndex = plan.steps.findIndex((s) => s.kind === 'ask')
  const trainY = ys[Math.min(trainAt, ys.length - 1)] ?? 0

  return (
    <div className="route" ref={listRef} data-reveal style={{ '--stop-x': `${STOP_X}px`, '--row': '52px' }}>
      <svg className="route-svg" width="100%" height={height} aria-hidden="true">
        {ys.length > 0 && (
          <>
            <line x1={X} x2={X} y1={first} y2={last} stroke={color} strokeWidth="10" strokeLinecap="round" />
            {ys.map((y, i) => (
              <Mark key={i} x={X} y={y} state={states[i]} />
            ))}
          </>
        )}
      </svg>

      {ys.length > 0 && (
        <motion.div
          className="train"
          aria-hidden="true"
          initial={false}
          animate={{ transform: `translate(${X}px, ${trainY}px)` }}
          transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0, duration: 0.45 }}
        />
      )}

      <ol className="route-list">
      {plan.steps.map((step, i) => (
        <Fragment key={i}>
          {i === askIndex && (
            <li className="threshold" aria-hidden="true">
              Desde aquí no hay vuelta atrás
            </li>
          )}
          <li
            className="stop"
            ref={(el) => (stopRefs.current[i] = el)}
            data-state={states[i]}
            style={{ '--i': i }}
          >
            <span />
            <span className="stop-label">
              {step.label}
              <span className="stop-kind">
                {live && i === trainAt && states[i] === 'pending' ? KIND_LABEL.current : KIND_LABEL[states[i]]}
              </span>
            </span>
          </li>
          {i === askIndex && askSlot && <li className="ask-row">{askSlot}</li>}
        </Fragment>
      ))}
      </ol>
    </div>
  )
}

function Mark({ x, y, state }) {
  if (state === 'ask') {
    return <rect x={x - 15} y={y - 9} width="30" height="18" rx="9" fill="var(--ask)" stroke="var(--ink)" strokeWidth="3" />
  }
  if (state === 'discarded') {
    return (
      <g>
        <circle cx={x} cy={y} r="10" fill="var(--white)" stroke="var(--ink)" strokeWidth="3" />
        <path d={`M${x - 5} ${y - 5} L${x + 5} ${y + 5} M${x + 5} ${y - 5} L${x - 5} ${y + 5}`} stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      </g>
    )
  }
  if (state === 'done') {
    return <circle cx={x} cy={y} r="10" fill="var(--ink)" stroke="var(--white)" strokeWidth="3" />
  }
  return <circle cx={x} cy={y} r="9" fill="var(--white)" stroke="var(--ink)" strokeWidth="5" />
}
