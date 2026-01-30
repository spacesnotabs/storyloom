import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import { StoryPage } from '../pages/StoryPage'

vi.mock('../stories/firestore', () => {
  return {
    getStoryById: vi.fn(async () => ({
      id: 'story_1',
      title: 'Original Title',
      ownerUid: 'user_123',
    })),
    setStoryTitle: vi.fn(async () => undefined),
  }
})

it('loads a story title and enables Save only when changed', async () => {
  render(
    <MemoryRouter initialEntries={['/stories/story_1']}>
      <Routes>
        <Route path="/stories/:storyId" element={<StoryPage />} />
      </Routes>
    </MemoryRouter>
  )

  const input = await screen.findByPlaceholderText('Untitled story')
  expect(input).toHaveValue('Original Title')

  const saveBtn = screen.getByRole('button', { name: /^save$/i })
  expect(saveBtn).toBeDisabled()

  fireEvent.change(input, { target: { value: 'Updated Title' } })
  expect(saveBtn).toBeEnabled()
})
