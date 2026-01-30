import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getStoryById, setStoryTitle } from '../stories/firestore'

export function StoryPage() {
  const { storyId } = useParams()
  const id = useMemo(() => storyId ?? null, [storyId])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!id) {
        setError('Missing story id')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const story = await getStoryById(id)
        if (cancelled) return

        if (!story) {
          setError('Story not found')
          return
        }

        setTitle((story.data.title as string) ?? 'Untitled story')
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [id])

  async function onSave() {
    if (!id) return
    setError(null)

    try {
      setSaving(true)
      await setStoryTitle({ storyId: id, title })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <p>
        <Link to="/">← Home</Link>
      </p>

      <h1>Story</h1>

      {loading ? <p>Loading…</p> : null}

      {!loading && !error ? (
        <div style={{ display: 'grid', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled story"
              style={{ padding: 8, fontSize: 16 }}
            />
          </label>

          <div>
            <button onClick={onSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>

          <p style={{ opacity: 0.7 }}>
            Next: add chapters/scenes + editor UI.
          </p>
        </div>
      ) : null}

      {error ? (
        <p style={{ color: 'crimson' }}>
          <strong>Error:</strong> {error}
        </p>
      ) : null}
    </div>
  )
}
