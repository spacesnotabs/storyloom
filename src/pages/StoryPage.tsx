import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getStoryById, setStoryTitle } from '../stories/firestore'

export function StoryPage() {
  const { storyId } = useParams()
  const id = useMemo(() => storyId ?? null, [storyId])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [initialTitle, setInitialTitle] = useState('')
  const [saving, setSaving] = useState(false)

  const isDirty = title !== initialTitle

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

        const nextTitle = (story.data.title as string) ?? 'Untitled story'
        setTitle(nextTitle)
        setInitialTitle(nextTitle)
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
    if (!isDirty) return

    setError(null)

    try {
      setSaving(true)
      await setStoryTitle({ storyId: id, title })
      setInitialTitle(title)
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
            <span>
              Title {isDirty ? <em style={{ opacity: 0.65 }}>(unsaved)</em> : null}
            </span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  void onSave()
                }
              }}
              placeholder="Untitled story"
              style={{ padding: 8, fontSize: 16 }}
            />
          </label>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={onSave} disabled={saving || !isDirty}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            {!isDirty ? <span style={{ opacity: 0.65 }}>Saved</span> : null}
          </div>

          <p style={{ opacity: 0.7 }}>Next: add chapters/scenes + editor UI.</p>
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
