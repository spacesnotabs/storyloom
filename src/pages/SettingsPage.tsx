import { Link } from 'react-router-dom'
import { useAuth } from '../auth/context'

export function SettingsPage() {
  const auth = useAuth()

  return (
    <div style={{ maxWidth: 720 }}>
      <p>
        <Link to="/">← Home</Link>
      </p>

      <h1>Settings</h1>

      <p style={{ opacity: 0.75 }}>
        Placeholder for account + writing preferences.
      </p>

      <button onClick={() => auth.signOut()}>Sign out</button>
    </div>
  )
}
