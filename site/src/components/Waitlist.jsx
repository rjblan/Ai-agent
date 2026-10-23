import { useState } from 'react'
import { toast } from 'sonner'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Waitlist() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const value = email.trim()
    if (!EMAIL.test(value)) {
      setError('Ese correo no parece completo. Revisa que tenga @ y un dominio.')
      return
    }
    setError('')
    setBusy(true)
    // Mock: nothing is sent anywhere.
    const save = new Promise((resolve) => setTimeout(resolve, 900))
    toast.promise(save, {
      loading: 'Apuntándote…',
      success: () => `Listo. Te escribiremos a ${value} en la primera salida.`,
      error: 'No se pudo guardar. Inténtalo otra vez.',
    })
    save.finally(() => {
      setBusy(false)
      setEmail('')
    })
  }

  return (
    <section className="section close" id="lista" aria-labelledby="lista-title">
      <div className="section-inner">
        <h2 id="lista-title">Súbete en la primera salida.</h2>
        <p className="intro">Te avisamos cuando Ai-agent pueda hacer recorridos con tus cuentas de verdad.</p>
        <form className="wait-form" onSubmit={submit} noValidate>
          <label htmlFor="email">Tu correo</label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            enterKeyHint="send"
            placeholder="nombre@ejemplo.com"
            value={email}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'email-error' : undefined}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn" type="submit" disabled={busy}>
            Apuntarme
          </button>
          {error ? (
            <p className="error" id="email-error" role="alert">
              {error}
            </p>
          ) : null}
        </form>
        <p className="fine">Web de prueba: no guardamos tu correo.</p>
      </div>
    </section>
  )
}
