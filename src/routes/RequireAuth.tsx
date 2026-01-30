import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/context'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  const location = useLocation()

  if (auth.status === 'loading') return <div>Loading…</div>

  if (auth.status === 'missing-config') {
    return (
      <div style={{ maxWidth: 640 }}>
        <h1>StoryLoom</h1>
        <p>
          Firebase isn’t configured yet. Create <code>.env.local</code> from{' '}
          <code>.env.example</code>.
        </p>
        <p>
          Once configured, refresh and you’ll be able to sign in.
        </p>
      </div>
    )
  }

  if (auth.status !== 'signed-in') {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
