import { useEffect, useState } from 'react'
import { Drawer } from '@base-ui/react/drawer'
import { LINES } from '../data.js'

// Two drawings of the same network: wide for desktop, tall for phones.
// Every line runs at 0 or 45 degrees and all three cross at the hub.
const MAPS = {
  wide: {
    w: 760,
    h: 520,
    lines: {
      1: 'M40 140 H260 L380 260 H720',
      2: 'M410 40 V480',
      3: 'M60 440 H230 L410 260 L570 420 H720',
    },
    hub: [410, 260],
    stops: {
      pides: [110, 140],
      ves: [620, 260],
      pregunta: [410, 92],
      deshaces: [410, 468],
      escrito: [110, 440],
      revisas: [660, 420],
    },
    left: [],
  },
  tall: {
    w: 360,
    h: 620,
    lines: {
      1: 'M40 170 L180 310 L320 450 V590',
      2: 'M180 30 V590',
      3: 'M320 170 L180 310 L40 450 V590',
    },
    hub: [180, 310],
    stops: {
      pides: [40, 170],
      ves: [320, 480],
      pregunta: [180, 84],
      deshaces: [180, 560],
      escrito: [320, 170],
      revisas: [40, 520],
    },
    left: ['ves', 'escrito'],
  },
}

const STOPS = {
  pides: {
    line: 1,
    label: 'Lo pides',
    title: 'Lo pides con tus palabras',
    body: 'No hay menús ni plantillas. Escribes el encargo como se lo dirías a alguien de confianza, y el agente lo traduce en paradas.',
  },
  ves: {
    line: 1,
    label: 'Ves cada parada',
    title: 'Ves el recorrido antes de salir',
    body: 'Antes de tocar nada, el agente te enseña el plan entero. Si una parada no te convence, la quitas y el recorrido se vuelve a trazar.',
  },
  pregunta: {
    line: 2,
    label: 'Para a preguntar',
    ask: true,
    title: 'Para antes de lo irreversible',
    body: 'Enviar, borrar, pagar o avisar a otras personas son paradas rojas. Ahí el tren se detiene y espera a que mantengas pulsado «Mantén para aprobar».',
  },
  deshaces: {
    line: 2,
    label: 'Puedes saltarla',
    title: 'Puedes saltar cualquier parada',
    body: 'Si saltas una parada roja, el agente termina el resto sin hacerla y te lo deja anotado. Nada ocurre a tus espaldas.',
  },
  escrito: {
    line: 3,
    label: 'Queda escrito',
    title: 'Todo queda escrito',
    body: 'Cada recorrido deja una entrada en el registro: qué hizo, quién aprobó y cuándo. Las correcciones también se quedan, no se borran.',
  },
  revisas: {
    line: 3,
    label: 'Lo revisas luego',
    title: 'Lo revisas cuando quieras',
    body: 'El registro es tuyo. Puedes volver a una entrada y ver las paradas tal y como pasaron.',
  },
  hub: {
    line: null,
    label: 'Tú decides',
    hub: true,
    title: 'Tú decides',
    body: 'Las tres líneas se cruzan en el mismo sitio: el agente trabaja, pero las decisiones que importan pasan por ti.',
  },
}

function useMapShape() {
  const query = '(max-width: 640px)'
  const [tall, setTall] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setTall(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return tall ? MAPS.tall : MAPS.wide
}

export function Network() {
  const map = useMapShape()
  const [openId, setOpenId] = useState(null)
  const [shownId, setShownId] = useState('pides') // keeps content during the exit animation
  const shown = STOPS[shownId]

  const pos = (id) => (id === 'hub' ? map.hub : map.stops[id])
  const pct = ([x, y]) => ({ left: `${(x / map.w) * 100}%`, top: `${(y / map.h) * 100}%` })

  return (
    <section className="section" id="como-funciona" aria-labelledby="red-title">
      <div className="section-inner">
        <h2 id="red-title">Tres líneas que se cruzan en ti.</h2>
        <p className="intro">Toca cualquier parada del plano para ver qué pasa en ella.</p>

        <div className="network">
          <div className="map">
            <svg viewBox={`0 0 ${map.w} ${map.h}`} aria-hidden="true">
              {Object.entries(map.lines).map(([n, d]) => (
                <path key={n} d={d} fill="none" stroke={LINES[n].color} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              ))}
              <rect
                x={map.hub[0] - 26}
                y={map.hub[1] - 16}
                width="52"
                height="32"
                rx="16"
                fill="var(--white)"
                stroke="var(--ink)"
                strokeWidth="6"
              />
            </svg>
            {Object.keys(STOPS).map((id) => {
              const stop = STOPS[id]
              const isLeft = map.left.includes(id)
              return (
                <button
                  key={id}
                  type="button"
                  className="map-stop"
                  data-hub={stop.hub || undefined}
                  data-ask={stop.ask || undefined}
                  data-left={isLeft || undefined}
                  style={pct(pos(id))}
                  onClick={() => {
                    setShownId(id)
                    setOpenId(id)
                  }}
                >
                  {!stop.hub && <i className="dot" aria-hidden="true" />}
                  <span>{stop.label}</span>
                </button>
              )
            })}
          </div>

          <ul className="legend">
            {[1, 2, 3].map((n) => (
              <li key={n}>
                <span className="badge" style={{ background: LINES[n].color, color: LINES[n].on }}>
                  {n}
                </span>
                <div>
                  <strong>{['Ves el plan', 'Para antes de lo irreversible', 'Deja registro'][n - 1]}</strong>
                  <p>
                    {
                      [
                        'Cada encargo se dibuja como una línea con sus paradas, antes de empezar.',
                        'Las paradas rojas esperan tu permiso. Puedes aprobarlas o saltarlas.',
                        'Lo que hizo, lo que saltaste y lo que se corrigió, todo anotado.',
                      ][n - 1]
                    }
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Drawer.Root open={openId !== null} onOpenChange={(open) => !open && setOpenId(null)}>
        <Drawer.Portal>
          <Drawer.Backdrop className="sheet-backdrop" />
          <Drawer.Viewport className="sheet-viewport">
            <Drawer.Popup className="sheet">
              <div className="sheet-handle" aria-hidden="true" />
              <Drawer.Content>
                <Drawer.Title className="sheet-title">
                  {shown.line ? (
                    <span className="badge" style={{ background: LINES[shown.line].color, color: LINES[shown.line].on }}>
                      {shown.line}
                    </span>
                  ) : null}
                  {shown.title}
                </Drawer.Title>
                <Drawer.Description className="sheet-body">{shown.body}</Drawer.Description>
              </Drawer.Content>
              <Drawer.Close className="sheet-close" aria-label="Cerrar">
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 3 L13 13 M13 3 L3 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </Drawer.Close>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    </section>
  )
}
