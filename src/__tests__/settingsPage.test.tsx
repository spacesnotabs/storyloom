import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { SettingsPage } from '../pages/SettingsPage'

vi.mock('../auth/context', () => {
  return {
    useAuth: () => ({
      user: { uid: 'user_123', isAnonymous: true },
      signOut: vi.fn(),
    }),
  }
})

it('renders settings placeholder', () => {
  render(
    <MemoryRouter>
      <SettingsPage />
    </MemoryRouter>
  )

  expect(screen.getByText(/settings/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
})
