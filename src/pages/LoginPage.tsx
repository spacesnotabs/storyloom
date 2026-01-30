import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/context'

export function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)

  const from = (location.state as { from?: string } | null)?.from ?? '/'

  async function onGuest() {
    setError(null)
    try {
      await auth.signInGuest()
      navigate(from)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h1>StoryLoom</h1>
      <h2>Sign in</h2>

      {auth.status === 'missing-config' ? (
        <p>
          Firebase isn’t configured yet. Create <code>.env.local</code> from{' '}
          <code>.env.example</code>.
        </p>
      ) : (
        <>
          <p>
            For now: continue as a guest (anonymous auth). This is a temporary
            login flow.
          </p>
          <button onClick={onGuest}>Continue as guest</button>
        </>
      )}

      {error ? (
        <p role="alert" style={{ color: 'crimson' }}>
          {error}
        </p>
      ) : null}
    </div>
  )
}
