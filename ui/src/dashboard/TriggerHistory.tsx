import type { SessionStatus, Frame } from './types'

export default function TriggerHistory({ status, frame }: { status: SessionStatus | null; frame: Frame | null }) {
  const events = [...(status?.events ?? [])].reverse()
  return <section className="panel">
    <div className="row"><h2>Simulated action</h2><span className="badge">{status?.simulate ? 'Simulation enabled' : 'Observe · no actions'}</span></div>
    <div className={`lamp${status?.lamp ? ' lit' : ''}`} role="img" aria-label={status?.lamp ? 'Simulated lamp on' : 'Simulated lamp off'}>{status?.lamp ? 'ON' : 'OFF'}</div>
    <p role="status"><b>{status?.state.replaceAll('_', ' ') ?? 'stopped'}</b></p>
    <p>Selected face: {frame?.signals.face?.toFixed(3) ?? 'missing'} · hand: {frame?.signals.hand?.toFixed(3) ?? 'missing'}.</p>
    <p className="muted">Missing input cancels pending evidence. A held command cannot repeat until release. No physical device is connected.</p>
    <h3>Event history · latest 100</h3>
    <ol className="events">{events.map(event => <li key={event.id}><b>{event.state.replaceAll('_', ' ')}</b> · frame {event.frame_id} / mapping {event.mapping_version}<br /><span>{event.reason}</span></li>)}</ol>
    {!events.length && <p className="muted">State transitions will appear here.</p>}
  </section>
}
