import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, vi } from 'vitest'

const { navigateMock, createStoryMock } = vi.hoisted(() => {
  return {
    navigateMock: vi.fn(),
    createStoryMock: vi.fn(async () => 'story_123'),
  }
})

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  )
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('../auth/context', () => {
  return {
    useAuth: () => ({
      user: { uid: 'user_123', isAnonymous: true },
      signOut: vi.fn(),
    }),
  }
})

vi.mock('../stories/firestore', () => {
  return {
    createStory: createStoryMock,
    listStoriesByOwnerUid: vi.fn(async () => []),
  }
})

import { HomePage } from '../pages/HomePage'

beforeEach(() => {
  navigateMock.mockClear()
  createStoryMock.mockClear()
})

it('creates a story with the provided title and navigates to it', async () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )

  await screen.findByText(/no stories yet/i)

  const input = screen.getByLabelText(/new story title/i)
  fireEvent.change(input, { target: { value: 'A New Hope' } })

  fireEvent.click(screen.getByRole('button', { name: /create story/i }))

  expect(createStoryMock).toHaveBeenCalledWith({
    title: 'A New Hope',
    ownerUid: 'user_123',
  })

  await waitFor(() => {
    expect(navigateMock).toHaveBeenCalledWith('/stories/story_123')
  })
})

it('creates a story when pressing Enter in the title input', async () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )

  await screen.findByText(/no stories yet/i)

  const input = screen.getByLabelText(/new story title/i)
  fireEvent.change(input, { target: { value: 'Keyboard Story' } })
  fireEvent.keyDown(input, { key: 'Enter' })

  expect(createStoryMock).toHaveBeenCalledWith({
    title: 'Keyboard Story',
    ownerUid: 'user_123',
  })

  await waitFor(() => {
    expect(navigateMock).toHaveBeenCalledWith('/stories/story_123')
  })
})
