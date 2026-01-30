import { onAuthStateChanged, signInAnonymously, signOut } from 'firebase/auth'
import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './context'
import { getFirebaseAuth, isFirebaseConfigured } from './firebase'
import type { AuthContextValue, AuthStatus } from './types'

const initialStatus: AuthStatus = isFirebaseConfigured()
  ? 'loading'
  : 'missing-config'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(initialStatus)
  const [user, setUser] = useState<import('firebase/auth').User | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured()) return

    const auth = getFirebaseAuth()
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setStatus(nextUser ? 'signed-in' : 'signed-out')
    })

    return () => unsub()
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    return {
      status,
      user,
      async signInGuest() {
        if (!isFirebaseConfigured()) {
          throw new Error('Firebase is not configured')
        }
        await signInAnonymously(getFirebaseAuth())
      },
      async signOut() {
        if (!isFirebaseConfigured()) return
        await signOut(getFirebaseAuth())
      },
    }
  }, [status, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
