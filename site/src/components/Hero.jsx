import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { EXAMPLES, LINES, planFor } from '../data.js'
import { Route } from './Route.jsx'
import { AskCard } from './AskCard.jsx'

const STEP_MS = 750

function freshStates(plan) {
  return plan.steps.map(() => 'pending')
}

export function Hero({ onComplete, askVariant, autoStart = false }) {
  const [text, setText] = useState('')
  const [plan, setPlan] = useState(EXAMPLES[0])
  const [run, setRun] = useState(0) // bump to remount the route (replays the reveal)
  const [states, setStates] = useState(() => freshStates(EXAMPLES[0]))
  const [trainAt, setTrainAt] = useState(0)
  const [phase, setPhase] = useState('idle') // idle | running | asking | done
  const announce = useRef(null)

  const start = (next) => {
    setPlan(next)
    setStates(freshStates(next))
    setTrainAt(0)
    setRun((r) => r + 1)
    setPhase('running')
  }

  // The prototype picker re-mounts the hero and runs straight to the red stop.
  useEffect(() => {
    if (autoStart) setPhase('running')
  }, [autoStart])

  // Advance one station at a time; stop at the station that asks.
  useEffect(() => {
    if (phase !== 'running') return
    const step = plan.steps[trainAt]
    if (!step) return
    if (step.kind === 'ask' && states[trainAt] === 'pending') {
      setStates((s) => s.map((v, i) => (i === trainAt ? 'ask' : v)))
      setPhase('asking')
      return
    }
    const t = setTimeout(() => {
      setStates((s) => s.map((v, i) => (i === trainAt && v === 'pending' ? 'done' : v)))
      if (trainAt + 1 < plan.steps.length) {
        setTrainAt(trainAt + 1)
      } else {
        setPhase('done')
      }
    }, STEP_MS)
    return () => clearTimeout(t)
  }, [phase, trainAt, plan, states])

  // Finishing a route is the moment for a toast: an occasional event.
  useEffect(() => {
    if (phase !== 'done') return
    const skipped = states.includes('discarded')
    const entry = {
      id: `run-${run}`,
      line: plan.line,
      task: plan.task,
      result: skipped ? 'Terminado sin el paso irreversible, que saltaste tú' : plan.result,
      approvedBy: skipped ? null : 'Tú',
      at: 'Ahora',
      state: skipped ? 'discarded' : 'done',
      isNew: true,
    }
    onComplete(entry)
    toast.success(skipped ? 'Recorrido terminado, con un paso saltado' : 'Recorrido terminado', {
      id: `run-${run}`,
      description: entry.result,
      action: {
        label: 'Ver registro',
        onClick: () => document.getElementById('registro')?.scrollIntoView(),
      },
    })
    // Runs once per finished route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const resolveAsk = (approved) => {
    setStates((s) => s.map((v, i) => (i === trainAt ? (approved ? 'done' : 'discarded') : v)))
    announce.current.textContent = approved ? 'Paso aprobado. El agente sigue.' : 'Paso saltado. El agente sigue sin hacerlo.'
    if (trainAt + 1 < plan.steps.length) setTrainAt(trainAt + 1)
    setPhase(trainAt + 1 < plan.steps.length ? 'running' : 'done')
  }

  const submit = (e) => {
    e.preventDefault()
    const value = text.trim()
    if (!value) {
      start(plan)
      return
    }
    start(planFor(value))
  }

  const askStep = plan.steps[trainAt]
  const statusText = {
    idle: 'Ejemplo listo. Pulsa «Trazar recorrido» para verlo en marcha.',
    running: `Parada ${trainAt + 1} de ${plan.steps.length}`,
    asking: 'Parado. Espera tu permiso.',
    done: 'Recorrido terminado. Queda en el registro.',
  }[phase]

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div>
        <h1 id="hero-title">Tu agente te enseña el recorrido antes de salir.</h1>
        <p className="lede">
          Le pides algo con tus palabras. Ai-agent lo convierte en paradas que puedes ver, las recorre por ti y se
          detiene antes de cualquier cosa que no se pueda deshacer.
        </p>

        <form className="search" onSubmit={submit}>
          <label htmlFor="task">¿Qué quieres quitarte de encima?</label>
          <div className="search-row">
            <input
              id="task"
              name="task"
              type="text"
              autoComplete="off"
              enterKeyHint="go"
              placeholder="Por ejemplo: ordena mis facturas"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="btn" type="submit" disabled={phase === 'asking'}>
              Trazar recorrido
            </button>
          </div>
          <div className="chips" role="group" aria-label="Encargos de ejemplo">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                type="button"
                className="chip"
                aria-pressed={plan.id === ex.id}
                disabled={phase === 'asking'}
                onClick={() => {
                  setText('')
                  start(ex)
                }}
              >
                <span className="badge" style={{ background: LINES[ex.line].color, color: LINES[ex.line].on }}>
                  {ex.line}
                </span>
                {ex.chip}
              </button>
            ))}
          </div>
          <p className="note">Web de prueba: el agente y los datos son de ejemplo.</p>
        </form>
      </div>

      <div className="route-panel" aria-labelledby="route-task">
        <div className="route-head">
          <span className="badge" style={{ background: LINES[plan.line].color, color: LINES[plan.line].on }}>
            {plan.line}
          </span>
          <div>
            <p className="task" id="route-task">
              {plan.task}
            </p>
            <p className="status" aria-live="polite">
              {statusText}
            </p>
          </div>
        </div>
        <Route
          key={run}
          plan={plan}
          states={states}
          trainAt={trainAt}
          live={phase === 'running'}
          askSlot={
            phase === 'asking' && askStep?.kind === 'ask' ? (
              <AskCard
                step={askStep}
                variant={askVariant}
                onApprove={() => resolveAsk(true)}
                onSkip={() => resolveAsk(false)}
              />
            ) : null
          }
        />
        <p className="visually-hidden" aria-live="polite" ref={announce} />
      </div>
    </section>
  )
}
