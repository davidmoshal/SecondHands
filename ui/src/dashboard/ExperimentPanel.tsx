import type { Frame, SessionStatus } from './types'

interface Props {
  status: SessionStatus | null
  comparison: Frame | null
  hasFrame: boolean
  onCalibrate: (label: string) => void
  onCompare: () => void
}
export default function ExperimentPanel({ status, comparison, hasFrame, onCalibrate, onCompare }: Props) {
  return <section className="panel">
    <h2>Calibrate and compare</h2>
    <p>Choose and apply your signals first. Hold a neutral posture, collect samples, then repeat with your deliberate movement. Sampling disables simulation and stores measurements only in session memory.</p>
    <div className="row"><button disabled={!status || !!status.calibration.collecting} onClick={() => onCalibrate('neutral')}>Collect neutral · 30 frames</button><button disabled={!status || !!status.calibration.collecting} onClick={() => onCalibrate('deliberate')}>Collect deliberate · 30 frames</button></div>
    {status && <>
      {status.calibration.collecting && <p role="status">Collecting {status.calibration.collecting}: {status.calibration.remaining} valid frames remain. Keep the required face/hand visible.</p>}
      {(['neutral', 'deliberate'] as const).map(label => <div key={label} className="sample">
        <b>{label} · {status.calibration[label].count} samples</b>
        <span>Face mean {status.calibration[label].face_mean?.toFixed(3) ?? 'unavailable'}</span>
        <span>Hand mean {status.calibration[label].hand_mean?.toFixed(3) ?? 'unavailable'}</span>
      </div>)}
      <p className="muted">A suggested range appears only when the observed deliberate minimum exceeds the neutral maximum by at least 0.1. This small sample does not establish reliability. Review the draft before applying.</p>
    </>}
    <button disabled={!hasFrame} onClick={onCompare}>Freeze current observation for comparison</button>
    {comparison && <>
      <h3>Frozen frame {comparison.frame_id} · mapping {comparison.mapping_version}</h3>
      <img className="snapshot" src={comparison.preview} alt="Frozen comparison observation" />
      <p>{comparison.note}</p>
      <ul>{comparison.models.map(model => <li key={model.name}><b>{model.name}</b> — {model.available ? model.runtime : 'Not integrated; no result'}</li>)}</ul>
      <p>Face: {comparison.recognition.faces.length} detected · {comparison.recognition.timing_ms.face.toFixed(1)} ms.<br />Hand: {comparison.recognition.hands.length} detected · {comparison.recognition.timing_ms.hand.toFixed(1)} ms.</p>
      <p>Selected face score: {comparison.signals.face?.toFixed(3) ?? 'missing'} · selected hand score: {comparison.signals.hand?.toFixed(3) ?? 'missing'}.</p>
    </>}
    <p className="muted">Two recognition tasks are installed. ExecuTorch's synthetic smoke check is separate and is not a recognition model.</p>
  </section>
}
