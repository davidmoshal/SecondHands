import { useEffect, useRef, useState } from 'react'
import { SessionTransport, type Message } from './transport'
import type { Frame, SessionStatus } from './types'

export function useDashboard() {
  const [status, setStatus] = useState<SessionStatus | null>(null)
  const [frame, setFrame] = useState<Frame | null>(null)
  const [comparison, setComparison] = useState<Frame | null>(null)
  const [error, setError] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [loadMs, setLoadMs] = useState<number | null>(null)
  const transport = useRef<SessionTransport | null>(null)

  useEffect(() => {
    function clearSession() {
      setConnected(false)
      setConnecting(false)
      setStatus(null)
      setFrame(null)
      setComparison(null)
    }
    const session = new SessionTransport(
      () => new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/api/session`),
      (data: Message) => {
        if (data.type === 'error') {
          setError(String(data.message))
          setConnecting(false)
          if (data.fatal) clearSession()
        } else if (['stopped', 'disconnected'].includes(String(data.type))) {
          clearSession()
          if (data.type === 'disconnected') setError('Session disconnected. Camera capture has stopped.')
        } else if (data.type === 'comparison') {
          setComparison(data as unknown as Frame)
        } else if (data.session_id) {
          setStatus(data as unknown as SessionStatus)
          if (data.type === 'started') {
            setConnected(true)
            setConnecting(false)
            setLoadMs(Number(data.model_load_ms))
          }
          if (data.type === 'frame') setFrame(data as unknown as Frame)
          if (['configured', 'calibrating', 'cancelled'].includes(String(data.type))) {
            setFrame(null)
            setComparison(null)
          }
        }
      },
    )
    transport.current = session
    return () => {
      // StrictMode and unmount must close this session without updating removed UI.
      session.stop(false)
      transport.current = null
    }
  }, [])

  function start(index: number) {
    setError('')
    setConnecting(true)
    setComparison(null)
    transport.current?.start(index)
  }
  function command(message: Message) {
    setError('')
    if (!transport.current?.command(message)) setError('Wait for the current command to finish.')
  }
  return { status, frame, comparison, error, connecting, connected, loadMs, start, command,
    stop: () => transport.current?.stop() }
}
