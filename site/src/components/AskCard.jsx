import { HoldButton } from './HoldButton.jsx'

// The stop where the agent waits for you. `variant` comes from the
// prototype picker (?proto=1); the shipped default is "anden".
export function AskCard({ step, onApprove, onSkip, variant = 'anden' }) {
  return (
    <div
      className="ask"
      data-variant={variant}
      data-enter
      role="group"
      aria-labelledby="ask-title"
    >
      <h3 id="ask-title">{step.question}</h3>
      <p>{step.detail}</p>
      <div className="ask-actions">
        <HoldButton onConfirm={onApprove}>Mantén para aprobar</HoldButton>
        <button type="button" className="btn btn--ghost" onClick={onSkip}>
          Saltar este paso
        </button>
      </div>
    </div>
  )
}
