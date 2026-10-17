import type { Frame } from './types'

export default function SignalReadings({ frame, loadMs }: { frame: Frame | null; loadMs: number | null }) {
  const shapes = Object.entries(frame?.recognition.faces[0]?.blendshapes ?? {}).sort((a, b) => b[1] - a[1])
  return <section className="panel">
    <h2>Recognition measurements</h2>
    <p>MediaPipe CPU · Face Landmarker + Gesture Recognizer</p>
    {frame ? <>
      <div className="metrics"><span>Face <b>{frame.recognition.timing_ms.face.toFixed(1)} ms</b></span>
        <span>Hand <b>{frame.recognition.timing_ms.hand.toFixed(1)} ms</b></span>
        <span>Frame work <b>{frame.processing_ms.toFixed(1)} ms</b></span></div>
      <p className="muted">Camera read {frame.capture_ms.toFixed(1)} ms. Frame work includes resizing, inference and JPEG encoding; excludes network and display. Capture timestamps use the server's monotonic clock.</p>
      <h3>Hands · {frame.recognition.hands.length}</h3>
      {!frame.recognition.hands.length && <p className="muted">No hand detected.</p>}
      {frame.recognition.hands.length > 1 && <p className="warning">More than one hand detected: hand commands are suspended. Use one participant and one hand.</p>}
      {frame.recognition.hands.map((hand, i) => <div key={i} className="reading">
        <b>{hand.handedness[0]?.label ?? 'Unknown side'}</b>
        {hand.gestures.map(gesture => <span key={gesture.label}>{gesture.label} · {gesture.score.toFixed(3)}</span>)}
      </div>)}
      <h3>Facial blendshapes · {shapes.length}</h3>
      {!shapes.length && <p className="muted">No face detected.</p>}
      <div className="shapes">
        {shapes.map(([name, score]) => <div key={name} className="shape">
          <label htmlFor={`shape-${name}`}>{name}</label><span>{score.toFixed(3)}</span>
          <meter id={`shape-${name}`} value={score} min="0" max="1" />
        </div>)}
      </div>
    </> : <p className="muted">Measurements appear when a frame arrives.</p>}
    {loadMs !== null && <p className="muted">Both models loaded in {loadMs.toFixed(0)} ms for this session.</p>}
    <p className="muted">Scores measure visible features. They do not establish intent or emotion.</p>
  </section>
}
