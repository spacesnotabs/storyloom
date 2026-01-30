import { describe, expect, it } from 'vitest'
import { normalizeStory } from '../stories/firestore'

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
