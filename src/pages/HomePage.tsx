import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/context'
import { createStory } from '../stories/firestore'

export function HomePage() {
  const auth = useAuth()
  const nav = useNavigate()
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onNewStory() {
    setError(null)

    if (!auth.user) {
      setError('No user session. Try reloading or signing in again.')
      return
    }

    try {
      setCreating(true)
      const storyId = await createStory({
        title: 'Untitled story',
        ownerUid: auth.user.uid,
      })
      nav(`/stories/${storyId}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setCreating(false)
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h1>StoryLoom</h1>
      <p>Authenticated shell ✅</p>

      <p>
        User:{' '}
        <code>
          {auth.user
            ? auth.user.isAnonymous
              ? 'anonymous'
              : auth.user.uid
            : 'none'}
        </code>
      </p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button onClick={onNewStory} disabled={creating}>
          {creating ? 'Creating…' : 'New story'}
        </button>

        <button onClick={() => auth.signOut()}>Sign out</button>
      </div>

      {error ? (
        <p style={{ color: 'crimson' }}>
          <strong>Error:</strong> {error}
        </p>
      ) : null}
    </div>
  )
}
