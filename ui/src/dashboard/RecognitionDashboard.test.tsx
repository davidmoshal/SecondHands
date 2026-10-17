// @vitest-environment happy-dom
import { StrictMode } from 'react'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import RecognitionDashboard from './RecognitionDashboard'
import { defaultMapping, type Frame, type SessionStatus } from './types'

class Socket {
  static instances: Socket[] = []
  onopen: (() => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  onclose: (() => void) | null = null
  onerror: (() => void) | null = null
  sent: Record<string, unknown>[] = []
  closed = false
  constructor(readonly url: string) { Socket.instances.push(this) }
  send(raw: string) { this.sent.push(JSON.parse(raw)) }
  close() { this.closed = true; this.onclose?.() }
  receive(data: object) { act(() => this.onmessage?.(new MessageEvent('message', { data: JSON.stringify(data) }))) }
}
const status: SessionStatus = {
  session_id: 'test-session', mapping_version: 1, running: true, simulate: false,
  lamp: false, state: 'neutral', mapping: defaultMapping, models: [], events: [],
  calibration: {
    collecting: null, remaining: 0,
    neutral: { count: 30, face_mean: .1, hand_mean: .1 },
    deliberate: { count: 30, face_mean: .9, hand_mean: .9 },
    face_suggestion: { activate: .8, release: .2 }, hand_suggestion: null,
  },
}
const frame: Frame = {
  ...status, type: 'frame', frame_id: 7, captured_ms: 100, processing_ms: 15, capture_ms: 2,
  preview: 'data:image/jpeg;base64,dGVzdA==', signals: { face: .9, hand: .8 },
  recognition: {
    image: { width: 640, height: 480 }, timing_ms: { face: 8, hand: 4, total: 12 },
    faces: [{ landmarks: [{ x: .5, y: .25, z: 0 }], blendshapes: { browInnerUp: .9 } }],
    hands: [{ landmarks: [{ x: .2, y: .5, z: 0 }], gestures: [{ label: 'Open_Palm', score: .8 }], handedness: [{ label: 'Right', score: .99 }] }],
  },
}
beforeEach(() => { vi.useFakeTimers(); Socket.instances = []; vi.stubGlobal('WebSocket', Socket) })
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.useRealTimers() })
function start() {
  const view = render(<StrictMode><RecognitionDashboard /></StrictMode>)
  expect(Socket.instances).toHaveLength(0)
  expect(screen.getByRole('button', { name: 'Stop' })).toBeDisabled()
  fireEvent.change(screen.getByLabelText('Camera index'), { target: { value: '2' } })
  fireEvent.click(screen.getByRole('button', { name: 'Start camera' }))
  const socket = Socket.instances[0]!
  act(() => socket.onopen?.())
  expect(socket.sent).toEqual([{ type: 'start', camera_index: 2 }])
  socket.receive({ ...status, type: 'started', model_load_ms: 123 })
  return { socket, ...view }
}

test('explicit camera start renders matched frame, overlays, scores and lamp; stop discards late results', () => {
  const { socket } = start()
  act(() => vi.advanceTimersByTime(80))
  expect(socket.sent.at(-1)).toEqual({ type: 'frame' })
  socket.receive({ ...frame, simulate: true, lamp: true, state: 'cooldown', events: [
    { id: 'event-1', state: 'triggered', reason: 'Deliberate hold accepted', frame_id: 7, mapping_version: 1 },
  ] })
  const preview = screen.getByRole('img', { name: 'Camera frame with matching face and hand landmarks' })
  expect(preview).toHaveAttribute('viewBox', '0 0 640 480')
  expect(preview.querySelector('image')).toHaveAttribute('href', frame.preview)
  expect(preview.querySelector('circle')).toHaveAttribute('cx', '320')
  expect(preview.querySelector('circle')).toHaveAttribute('cy', '120')
  expect(preview.querySelectorAll('circle')).toHaveLength(2)
  expect(screen.getByLabelText('browInnerUp')).toHaveAttribute('value', '0.9')
  expect(screen.getByText('Open_Palm · 0.800')).toBeVisible()
  expect(screen.getByRole('img', { name: 'Simulated lamp on' })).toBeVisible()
  expect(screen.getByText('Deliberate hold accepted')).toBeVisible()
  fireEvent.click(screen.getByLabelText('Landmarks'))
  expect(preview.querySelectorAll('circle')).toHaveLength(0)
  fireEvent.click(screen.getByRole('button', { name: 'Stop' }))
  expect(socket.closed).toBe(true)
  socket.receive(frame)
  expect(screen.queryByRole('img', { name: 'Camera frame with matching face and hand landmarks' })).toBeNull()
  expect(screen.getByRole('button', { name: 'Start camera' })).toBeEnabled()
})

test('calibration suggestions edit only the draft; applying sends selected settings and clears old evidence', () => {
  const { socket } = start()
  socket.receive(frame)
  fireEvent.click(screen.getByRole('button', { name: 'Freeze current observation for comparison' }))
  expect(socket.sent.at(-1)).toEqual({ type: 'compare' })
  socket.receive({ ...frame, type: 'comparison', note: 'Frozen result' })
  expect(screen.getByRole('img', { name: 'Frozen comparison observation' })).toBeVisible()
  const sent = socket.sent.length
  fireEvent.click(screen.getByRole('button', { name: 'Use face calibration in draft' }))
  expect(screen.getByLabelText('Activation score')).toHaveValue(.8)
  expect(screen.getByLabelText('Release score')).toHaveValue(.2)
  expect(socket.sent).toHaveLength(sent)
  fireEvent.change(screen.getByLabelText('Mapping'), { target: { value: 'sequence' } })
  fireEvent.change(screen.getByLabelText('Hold duration (ms)'), { target: { value: '750' } })
  fireEvent.click(screen.getByLabelText('Enable simulated commands when applying'))
  // Happy DOM misclassifies decimal steps; native validity is checked in the browser.
  fireEvent.submit(screen.getByRole('button', { name: 'Apply experiment settings' }).closest('form')!)
  expect(socket.sent.at(-1)).toEqual({ type: 'configure', simulate: true,
    mapping: { ...defaultMapping, mode: 'sequence', hold_ms: 750, activate: .8, release: .2 } })
  socket.receive({ ...status, type: 'configured', mapping_version: 2 })
  expect(screen.queryByRole('img', { name: 'Frozen comparison observation' })).toBeNull()
  expect(screen.getByRole('button', { name: 'Freeze current observation for comparison' })).toBeDisabled()
})

test('calibration and cancellation use the existing protocol; unmount closes the socket and stops polling', () => {
  const { socket, unmount } = start()
  fireEvent.click(screen.getByRole('button', { name: 'Collect neutral · 30 frames' }))
  expect(socket.sent.at(-1)).toEqual({ type: 'calibrate', label: 'neutral' })
  socket.receive({ ...status, type: 'calibrating', calibration: { ...status.calibration, collecting: 'neutral', remaining: 30 } })
  expect(screen.getByRole('button', { name: 'Collect deliberate · 30 frames' })).toBeDisabled()
  fireEvent.click(screen.getByRole('button', { name: 'Cancel pending command' }))
  expect(socket.sent.at(-1)).toEqual({ type: 'cancel' })
  socket.receive({ ...status, type: 'cancelled' })
  unmount()
  const sent = socket.sent.length
  expect(socket.closed).toBe(true)
  act(() => vi.advanceTimersByTime(1000))
  expect(socket.sent).toHaveLength(sent)
})

test.each(['disconnect', 'error'])('%s clears session results and permits a new camera session', reason => {
  const { socket } = start()
  socket.receive(frame)
  act(() => reason === 'error' ? socket.onerror?.() : socket.onclose?.())
  expect(screen.getByRole('alert')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Start camera' })).toBeEnabled()
  expect(screen.queryByRole('img', { name: 'Camera frame with matching face and hand landmarks' })).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Start camera' }))
  expect(Socket.instances).toHaveLength(2)
  socket.receive(frame)
  expect(screen.queryByRole('img', { name: 'Camera frame with matching face and hand landmarks' })).toBeNull()
})
