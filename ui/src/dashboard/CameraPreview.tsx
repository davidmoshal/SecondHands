import { useState } from 'react'
import type { Frame } from './types'

export default function CameraPreview({ frame }: { frame: Frame | null }) {
  const [overlays, setOverlays] = useState(true)
  const facePoints = frame?.recognition.faces.flatMap(face => face.landmarks) ?? []
  const handPoints = frame?.recognition.hands.flatMap(hand => hand.landmarks) ?? []
  return <section className="panel">
    <div className="row"><h2>Camera · live signals</h2><label><input checked={overlays} onChange={e => setOverlays(e.target.checked)} type="checkbox" /> Landmarks</label></div>
    {frame ? <svg key={`${frame.session_id}-${frame.frame_id}`} className="preview"
      viewBox={`0 0 ${frame.recognition.image.width} ${frame.recognition.image.height}`}
      role="img" aria-label="Camera frame with matching face and hand landmarks">
      <image href={frame.preview} width="100%" height="100%" />
      {overlays && <g>
        {facePoints.map((point, i) => <circle key={`f${i}`} cx={point.x * frame.recognition.image.width}
          cy={point.y * frame.recognition.image.height} r="1.5" fill="#7affd4" />)}
        {handPoints.map((point, i) => <circle key={`h${i}`} cx={point.x * frame.recognition.image.width}
          cy={point.y * frame.recognition.image.height} r="4" fill="#ffb85c" />)}
      </g>}
    </svg> : <div className="placeholder">Start the camera to inspect facial movements and static hand gestures.</div>}
    {frame && <p className="muted">Frame {frame.frame_id} · mapping {frame.mapping_version} · unmirrored view</p>}
    <p className="muted">Camera access belongs to the Python process on this computer. Frames remain in memory.</p>
  </section>
}
