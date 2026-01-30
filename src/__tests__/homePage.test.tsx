import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { HomePage } from '../pages/HomePage'

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
    createStory: vi.fn(async () => 'story_1'),
    listStoriesByOwnerUid: vi.fn(async () => [
      { id: 'story_1', title: 'My First Story' },
      { id: 'story_2', title: 'Second Story' },
    ]),
  }
})

it('renders a list of stories for the current user', async () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )

  expect(await screen.findByText('My First Story')).toBeInTheDocument()
  expect(screen.getByText('Second Story')).toBeInTheDocument()
})
