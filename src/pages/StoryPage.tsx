import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  createScene,
  deleteSceneById,
  deleteStoryById,
  getStoryById,
  listScenesByStoryId,
  setStoryTitle,
} from '../stories/firestore'
import type { Scene } from '../stories/types'

export function StoryPage() {
  const { storyId } = useParams()
  const nav = useNavigate()
  const id = useMemo(() => storyId ?? null, [storyId])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [initialTitle, setInitialTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [scenes, setScenes] = useState<Scene[] | null>(null)
  const [scenesLoading, setScenesLoading] = useState(false)
  const [newSceneBody, setNewSceneBody] = useState('')
  const [addingScene, setAddingScene] = useState(false)
  const [deletingSceneId, setDeletingSceneId] = useState<string | null>(null)

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

        const nextTitle = story.title ?? 'Untitled story'
        setTitle(nextTitle)
        setInitialTitle(nextTitle)

        setScenesLoading(true)
        const sceneRows = await listScenesByStoryId({ storyId: id })
        if (!cancelled) setScenes(sceneRows)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
          setScenesLoading(false)
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

  async function onDelete() {
    if (!id) return

    const ok = window.confirm('Delete this story? This cannot be undone.')
    if (!ok) return

    setError(null)

    try {
      setDeleting(true)
      await deleteStoryById({ storyId: id })
      nav('/')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setDeleting(false)
    }
  }

  async function onAddScene() {
    if (!id) return

    const body = newSceneBody.trim()
    if (!body) {
      setError('Scene text cannot be empty')
      return
    }

    setError(null)

    try {
      setAddingScene(true)
      const sceneId = await createScene({ storyId: id, body })
      setScenes((prev) => [...(prev ?? []), { id: sceneId, storyId: id, body }])
      setNewSceneBody('')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setAddingScene(false)
    }
  }

  async function onDeleteScene(sceneId: string) {
    if (!id) return

    const ok = window.confirm('Delete this scene? This cannot be undone.')
    if (!ok) return

    setError(null)

    try {
      setDeletingSceneId(sceneId)
      await deleteSceneById({ storyId: id, sceneId })
      setScenes((prev) => (prev ? prev.filter((s) => s.id !== sceneId) : prev))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setDeletingSceneId(null)
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

            <span style={{ flex: 1 }} />

            <button
              onClick={onDelete}
              disabled={deleting}
              style={{ color: 'crimson' }}
            >
              {deleting ? 'Deleting…' : 'Delete story'}
            </button>
          </div>

          <hr style={{ margin: '16px 0' }} />

          <h2 style={{ marginBottom: 8 }}>Scenes</h2>

          {scenesLoading ? <p>Loading scenes…</p> : null}

          {!scenesLoading && scenes && scenes.length === 0 ? (
            <p style={{ opacity: 0.7 }}>
              No scenes yet. Add the first chunk of prose below.
            </p>
          ) : null}

          {!scenesLoading && scenes && scenes.length > 0 ? (
            <ol style={{ display: 'grid', gap: 10, paddingLeft: 18 }}>
              {scenes.map((s) => (
                <li key={s.id}>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <pre
                      style={{
                        whiteSpace: 'pre-wrap',
                        background: '#1111110a',
                        padding: 10,
                        borderRadius: 6,
                        margin: 0,
                      }}
                    >
                      {s.body}
                    </pre>

                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ flex: 1 }} />
                      <button
                        onClick={() => void onDeleteScene(s.id)}
                        disabled={deletingSceneId === s.id}
                        style={{ color: 'crimson' }}
                      >
                        {deletingSceneId === s.id ? 'Deleting…' : 'Delete scene'}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          ) : null}

          <label style={{ display: 'grid', gap: 6 }}>
            <span>New scene</span>
            <textarea
              value={newSceneBody}
              onChange={(e) => setNewSceneBody(e.target.value)}
              placeholder="Write the next scene…"
              rows={6}
              style={{ padding: 10, fontSize: 14, lineHeight: 1.4 }}
            />
          </label>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={onAddScene} disabled={addingScene}>
              {addingScene ? 'Adding…' : 'Add scene'}
            </button>
            <span style={{ opacity: 0.7 }}>
              Next: edit/reorder scenes; attach POV/notes.
            </span>
          </div>
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
