import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/context'
import { createStory, listStoriesByOwnerUid } from '../stories/firestore'
import type { Story } from '../stories/types'

export function HomePage() {
  const auth = useAuth()
  const nav = useNavigate()
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('Untitled story')

  const [stories, setStories] = useState<Story[] | null>(null)
  const [storiesLoading, setStoriesLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!auth.user) return

      try {
        setStoriesLoading(true)
        const rows = await listStoriesByOwnerUid({ ownerUid: auth.user.uid })
        if (!cancelled) setStories(rows)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e))
        }
      } finally {
        if (!cancelled) setStoriesLoading(false)
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [auth.user])

  async function onNewStory() {
    setError(null)

    if (!auth.user) {
      setError('No user session. Try reloading or signing in again.')
      return
    }

    try {
      setCreating(true)
      const storyId = await createStory({
        title: newTitle.trim() || 'Untitled story',
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
    <div style={{ maxWidth: 720 }}>
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

      <div style={{ display: 'grid', gap: 10 }}>
        <label style={{ display: 'grid', gap: 6, maxWidth: 420 }}>
          <span>New story title</span>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                void onNewStory()
              }
            }}
            placeholder="Untitled story"
            style={{ padding: 8, fontSize: 16 }}
          />
        </label>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={onNewStory} disabled={creating}>
            {creating ? 'Creating…' : 'Create story'}
          </button>

          <button onClick={() => auth.signOut()}>Sign out</button>
        </div>
      </div>

      <hr style={{ margin: '20px 0' }} />

      <h2 style={{ marginBottom: 8 }}>My stories</h2>

      {storiesLoading ? <p>Loading stories…</p> : null}

      {!storiesLoading && stories && stories.length === 0 ? (
        <p style={{ opacity: 0.7 }}>No stories yet. Click “New story” to start.</p>
      ) : null}

      {!storiesLoading && stories && stories.length > 0 ? (
        <ul style={{ display: 'grid', gap: 6, paddingLeft: 18 }}>
          {stories.map((s) => (
            <li key={s.id}>
              <Link to={`/stories/${s.id}`}>{s.title}</Link>
            </li>
          ))}
        </ul>
      ) : null}

      {error ? (
        <p style={{ color: 'crimson' }}>
          <strong>Error:</strong> {error}
        </p>
      ) : null}
    </div>
  )
}
