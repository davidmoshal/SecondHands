import { useState } from 'react'
import { defaultMapping, type Mapping, type Calibration } from './types'

const gestures = ['Open_Palm', 'Closed_Fist', 'Pointing_Up', 'Thumb_Down', 'Thumb_Up', 'Victory', 'ILoveYou']
const faces = ['browInnerUp', 'browOuterUpLeft', 'browOuterUpRight', 'jawOpen', 'mouthSmileLeft', 'mouthSmileRight', 'eyeBlinkLeft', 'eyeBlinkRight', 'mouthPucker']
const times = [
  ['hold_ms', 'Hold duration'], ['release_ms', 'Neutral duration'], ['cooldown_ms', 'Cooldown'],
  ['timeout_ms', 'Confirmation timeout'], ['overlap_ms', 'Combined cue overlap'], ['max_gap_ms', 'Maximum frame gap'],
] as const
interface Props {
  connected: boolean
  calibration: Calibration | null
  activeVersion?: number
  onApply: (mapping: Mapping, simulate: boolean) => void
  onCancel: () => void
}

export default function MappingEditor({ connected, calibration, activeVersion, onApply, onCancel }: Props) {
  const [draft, setDraft] = useState<Mapping>({ ...defaultMapping })
  const [simulate, setSimulate] = useState(false)
  function update<K extends keyof Mapping>(key: K, value: Mapping[K]) {
    setDraft(previous => ({ ...previous, [key]: value }))
  }
  function applySuggestion(signal: 'face' | 'hand') {
    const suggestion = calibration?.[`${signal}_suggestion`]
    if (suggestion) setDraft(previous => ({ ...previous, ...suggestion }))
  }
  return <section className="panel">
    <h2>Compose a command</h2>
    <p className="muted">These defaults are editable experiment settings, not demonstration acceptance criteria. One active mapping controls a simulated lamp.</p>
    <form onSubmit={event => { event.preventDefault(); onApply({ ...draft }, simulate) }}>
      <div className="fields">
        <label>Mapping<select value={draft.mode} onChange={e => update('mode', e.target.value)}>
          <option value="face">Face only</option><option value="hand">Hand only</option><option value="either">Either cue</option><option value="combined">Combined cues</option><option value="sequence">Hand hold → new face cue</option>
        </select></label>
        <label>Face blendshape<input value={draft.face_signal} onChange={e => update('face_signal', e.target.value)} list="face-signals" maxLength={80} required /><datalist id="face-signals">{faces.map(name => <option key={name} value={name} />)}</datalist></label>
        <label>Hand gesture<select value={draft.hand_gesture} onChange={e => update('hand_gesture', e.target.value)}>{gestures.map(name => <option key={name}>{name}</option>)}</select></label>
        <label>Activation score<input value={draft.activate} onChange={e => update('activate', Number(e.target.value))} type="number" min="0.01" max="1" step="0.01" required /></label>
        <label>Release score<input value={draft.release} onChange={e => update('release', Number(e.target.value))} type="number" min="0" max={draft.activate - .01} step="0.01" required /></label>
        {times.map(([key, label]) => <label key={key}>{label} (ms)<input value={draft[key]} onChange={e => update(key, Number(e.target.value))} type="number" min={key === 'timeout_ms' || key === 'max_gap_ms' ? 1 : 0} max="30000" step="1" required /></label>)}
      </div>
      <p className="muted">The activation and release score pair is shared by the selected face and hand cues. Face and hand calibration suggestions each replace this same pair.</p>
      <p className="muted">Combined requires both cues to stay active, with activation edges inside the overlap setting. Sequence requires a hand hold, then a new face activation before timeout. Release is required before another action.</p>
      <div className="row">
        <button type="button" disabled={!calibration?.face_suggestion} onClick={() => applySuggestion('face')}>Use face calibration in draft</button>
        <button type="button" disabled={!calibration?.hand_suggestion} onClick={() => applySuggestion('hand')}>Use hand calibration in draft</button>
      </div>
      <label className="check"><input checked={simulate} onChange={e => setSimulate(e.target.checked)} type="checkbox" /> Enable simulated commands when applying</label>
      <div className="row"><button className="primary" disabled={!connected} type="submit">Apply experiment settings</button><button disabled={!connected} type="button" onClick={onCancel}>Cancel pending command</button></div>
      <p className="muted">Active mapping version: {activeVersion ?? 'none'}. Applying clears calibration and pending evidence. Observe mode is the default for each new session.</p>
    </form>
  </section>
}
