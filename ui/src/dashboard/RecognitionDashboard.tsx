import { useState } from 'react'
import CameraPreview from './CameraPreview'
import SignalReadings from './SignalReadings'
import MappingEditor from './MappingEditor'
import ExperimentPanel from './ExperimentPanel'
import TriggerHistory from './TriggerHistory'
import { useDashboard } from './useDashboard'

export default function RecognitionDashboard() {
  const [camera, setCamera] = useState(0)
  const { status, frame, comparison, error, connecting, connected, loadMs, start, stop, command } = useDashboard()
  return <main className="dashboard">
    <header className="header">
      <div><p className="eyebrow">SECONDHANDS / LOCAL EXPLORATION</p><h1>Movement into possibility.</h1><p>Inspect facial movements, try hand gestures, and compose a simulated command.</p></div>
      <div className="controls">
        <label>Camera index <input value={camera} onChange={e => setCamera(Number(e.target.value))} type="number" min="0" max="10" disabled={connected || connecting} /></label>
        <button className="primary" disabled={connected || connecting} onClick={() => start(camera)}>{connecting ? 'Starting…' : 'Start camera'}</button>
        <button disabled={!connected && !connecting} onClick={stop}>Stop</button>
      </div>
    </header>
    {error && <p className="error" role="alert">{error}</p>}
    <div className="grid">
      <CameraPreview frame={frame} />
      <SignalReadings frame={frame} loadMs={loadMs} />
      <MappingEditor connected={connected} calibration={status?.calibration ?? null} activeVersion={status?.mapping_version}
        onApply={(mapping, simulate) => command({ type: 'configure', mapping, simulate })} onCancel={() => command({ type: 'cancel' })} />
      <TriggerHistory status={status} frame={frame} />
      <ExperimentPanel status={status} comparison={comparison} hasFrame={!!frame}
        onCalibrate={label => command({ type: 'calibrate', label })} onCompare={() => command({ type: 'compare' })} />
    </div>
    <footer>One participant, one visible hand for command experiments. Frame observations are not proof of intent. Calibration and snapshots are cleared on session end.</footer>
  </main>
}
