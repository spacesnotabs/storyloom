import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import { StoryPage } from '../pages/StoryPage'

const { setStoryTitleMock, deleteStoryByIdMock, createSceneMock } = vi.hoisted(() => {
  return {
    setStoryTitleMock: vi.fn(async () => undefined),
    deleteStoryByIdMock: vi.fn(async () => undefined),
    createSceneMock: vi.fn(async () => 'scene_1'),
  }
})

vi.mock('../stories/firestore', () => {
  return {
    getStoryById: vi.fn(async () => ({
      id: 'story_1',
      title: 'Original Title',
      ownerUid: 'user_123',
    })),
    listScenesByStoryId: vi.fn(async () => [
      { id: 'scene_a', storyId: 'story_1', body: 'Opening line.' },
    ]),
    createScene: createSceneMock,
    setStoryTitle: setStoryTitleMock,
    deleteStoryById: deleteStoryByIdMock,
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

it('saves on Enter', async () => {
  render(
    <MemoryRouter initialEntries={['/stories/story_1']}>
      <Routes>
        <Route path="/stories/:storyId" element={<StoryPage />} />
      </Routes>
    </MemoryRouter>
  )

  const input = await screen.findByPlaceholderText('Untitled story')

  fireEvent.change(input, { target: { value: 'Enter Saved' } })
  fireEvent.keyDown(input, { key: 'Enter' })

  await waitFor(() => {
    expect(setStoryTitleMock).toHaveBeenCalledWith({
      storyId: 'story_1',
      title: 'Enter Saved',
    })
  })
})

it('deletes after confirmation', async () => {
  const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

  render(
    <MemoryRouter initialEntries={['/stories/story_1']}>
      <Routes>
        <Route path="/" element={<div>home</div>} />
        <Route path="/stories/:storyId" element={<StoryPage />} />
      </Routes>
    </MemoryRouter>
  )

  const deleteBtn = await screen.findByRole('button', { name: /delete story/i })
  fireEvent.click(deleteBtn)

  await waitFor(() => {
    expect(deleteStoryByIdMock).toHaveBeenCalledWith({ storyId: 'story_1' })
  })

  confirmSpy.mockRestore()
})

it('adds a new scene', async () => {
  render(
    <MemoryRouter initialEntries={['/stories/story_1']}>
      <Routes>
        <Route path="/stories/:storyId" element={<StoryPage />} />
      </Routes>
    </MemoryRouter>
  )

  // existing scene loads
  await screen.findByText('Opening line.')

  const textarea = screen.getByPlaceholderText('Write the next scene…')
  fireEvent.change(textarea, { target: { value: 'Second scene.' } })

  const addBtn = screen.getByRole('button', { name: /add scene/i })
  fireEvent.click(addBtn)

  await waitFor(() => {
    expect(createSceneMock).toHaveBeenCalledWith({
      storyId: 'story_1',
      body: 'Second scene.',
    })
  })

  await screen.findByText('Second scene.')
})
