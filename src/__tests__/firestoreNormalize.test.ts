import { describe, expect, it } from 'vitest'
import { normalizeScene, normalizeStory } from '../stories/firestore'

describe('normalizeStory', () => {
  it('fills defaults when fields are missing', () => {
    expect(normalizeStory('s1', {})).toEqual({
      id: 's1',
      title: 'Untitled story',
      ownerUid: '',
      createdAt: undefined,
      updatedAt: undefined,
    })
  })

  it('passes through known fields', () => {
    const createdAt = { __type: 'ts' }
    const updatedAt = { __type: 'ts2' }

    expect(
      normalizeStory('s2', {
        title: 'Hello',
        ownerUid: 'u1',
        createdAt,
        updatedAt,
      })
    ).toEqual({
      id: 's2',
      title: 'Hello',
      ownerUid: 'u1',
      createdAt,
      updatedAt,
    })
  })
})

describe('normalizeScene', () => {
  it('fills defaults when fields are missing', () => {
    expect(normalizeScene({ storyId: 'story_1', id: 'scene_1' }, {})).toEqual({
      id: 'scene_1',
      storyId: 'story_1',
      body: '',
      createdAt: undefined,
      updatedAt: undefined,
    })
  })

  it('passes through known fields', () => {
    const createdAt = { __type: 'ts' }
    const updatedAt = { __type: 'ts2' }

    expect(
      normalizeScene(
        { storyId: 'story_2', id: 'scene_2' },
        {
          body: 'hello world',
          createdAt,
          updatedAt,
        }
      )
    ).toEqual({
      id: 'scene_2',
      storyId: 'story_2',
      body: 'hello world',
      createdAt,
      updatedAt,
    })
  })
})
