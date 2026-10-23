import { useCallback, useState } from 'react'
import { Toaster } from 'sonner'
import { Hero } from './components/Hero.jsx'
import { Network } from './components/Network.jsx'
import { Log } from './components/Log.jsx'
import { Waitlist } from './components/Waitlist.jsx'
import { ProtoPicker } from './components/ProtoPicker.jsx'
import { LOG } from './data.js'
import './proto-picker.css'

const params = new URLSearchParams(window.location.search)
// Dev-only chrome: the worst-case data toggle (break-ui) and the variant picker (prototype).
const SHOW_DATA_TOGGLE = import.meta.env.DEV || params.has('dev')
const SHOW_PICKER = params.has('proto')

const DATASETS = [
  { id: 'demo', name: 'Demo' },
  { id: 'worst', name: 'Peor caso' },
  { id: 'empty', name: 'Vacío' },
  { id: 'one', name: 'Uno' },
]

const ASK_VARIANTS = [
  { id: 'anden', name: 'Andén' },
  { id: 'panel', name: 'Panel' },
  { id: 'billete', name: 'Billete' },
]

function setParam(key, value) {
  const url = new URL(window.location)
  url.searchParams.set(key, value)
  window.history.replaceState(null, '', url)
}

export default function App() {
  const [dataset, setDataset] = useState(() => {
    const d = params.get('data')
    return DATASETS.some((x) => x.id === d) ? d : 'demo'
  })
  const [runs, setRuns] = useState([])
  const [variant, setVariant] = useState(() => {
    const v = parseInt(params.get('v'), 10)
    return v >= 1 && v <= ASK_VARIANTS.length ? v - 1 : 0
  })
  const [replay, setReplay] = useState(0)

  const addRun = useCallback((entry) => setRuns((r) => [entry, ...r.filter((x) => x.id !== entry.id)]), [])
  const changeVariant = useCallback((i) => {
    setVariant(i)
    setParam('v', i + 1)
  }, [])
  const doReplay = useCallback(() => setReplay((r) => r + 1), [])

  return (
    <>
      <header className="top">
        <a className="wordmark" href="#">
          <span className="badge" style={{ background: 'var(--l1)', color: '#fff' }} aria-hidden="true">
            A
          </span>
          Ai-agent
        </a>
        <nav aria-label="Secciones">
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#registro">Registro</a>
          <a href="#lista">Lista de espera</a>
        </nav>
      </header>

      <main>
        <Hero key={replay} onComplete={addRun} askVariant={ASK_VARIANTS[variant].id} autoStart={SHOW_PICKER} />
        <Network />
        <Log entries={[...runs, ...LOG[dataset]]} />
        <Waitlist />
      </main>

      <footer className="foot">
        <span>Ai-agent · web de demostración</span>
        <span>Recorridos, nombres y cifras son de ejemplo.</span>
      </footer>

      <Toaster
        position="bottom-center"
        theme="light"
        offset={24}
        mobileOffset={16}
        toastOptions={{
          style: {
            fontFamily: 'var(--font)',
            fontSize: '15px',
            borderRadius: '16px',
            border: '2px solid var(--ink)',
            color: 'var(--ink)',
          },
        }}
      />

      {SHOW_DATA_TOGGLE && (
        <div className="data-toggle" role="group" aria-label="Datos del registro (solo desarrollo)">
          {DATASETS.map((d) => (
            <button
              key={d.id}
              type="button"
              aria-pressed={dataset === d.id}
              onClick={() => {
                setDataset(d.id)
                setParam('data', d.id)
              }}
            >
              {d.name}
            </button>
          ))}
        </div>
      )}

      {SHOW_PICKER && (
        <ProtoPicker variants={ASK_VARIANTS} current={variant} onChange={changeVariant} onReplay={doReplay} />
      )}
    </>
  )
}
