import NumberFlow from '@number-flow/react'
import { LINES } from '../data.js'

const plural = new Intl.PluralRules('es')
const MARK = {
  done: { cls: 'mark--done', text: 'Hecho' },
  corrected: { cls: 'mark--corrected', text: 'Corregido, a la vista' },
  discarded: { cls: 'mark--discarded', text: 'Paso saltado' },
}

export function Log({ entries }) {
  const n = entries.length
  return (
    <section className="section" id="registro" aria-labelledby="registro-title">
      <div className="section-inner">
        <div className="log-head">
          <div>
            <h2 id="registro-title">Todo queda en el registro.</h2>
            <p className="intro">
              Lo que hizo, quién lo aprobó y lo que se corrigió. Los recorridos que lances arriba aparecen aquí.
            </p>
          </div>
          <p className="log-count" aria-live="polite">
            <NumberFlow value={n} /> {plural.select(n) === 'one' ? 'recorrido' : 'recorridos'}
          </p>
        </div>

        {n === 0 ? (
          <p className="empty">Aún no hay recorridos. Lanza uno desde arriba y aparecerá aquí.</p>
        ) : (
          <ul className="log">
            {entries.map((e) => (
              <li key={e.id} data-new={e.isNew || undefined}>
                <span className="badge" style={{ background: LINES[e.line].color, color: LINES[e.line].on }}>
                  {e.line}
                </span>
                <div>
                  <p className="log-task">{e.task || 'Sin título'}</p>
                  {e.result ? <p className="log-result">{e.result}</p> : null}
                  <p className="log-mark">
                    <i className={`mark ${MARK[e.state].cls}`} aria-hidden="true" />
                    {MARK[e.state].text}
                    {e.approvedBy ? ` · aprobó ${e.approvedBy}` : ''}
                  </p>
                </div>
                <p className="log-meta">{e.at}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
