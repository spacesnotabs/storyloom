import type { User } from 'firebase/auth'

export type AuthStatus = 'loading' | 'signed-out' | 'signed-in' | 'missing-config'

export type AuthContextValue = {
  status: AuthStatus
  user: User | null
  signInGuest: () => Promise<void>
  signOut: () => Promise<void>
}
