import { useAuth } from '../auth/context'

export function HomePage() {
  const auth = useAuth()

  return (
    <div style={{ maxWidth: 640 }}>
      <h1>StoryLoom</h1>
      <p>Authenticated shell ✅</p>

      <p>
        User:{' '}
        <code>
          {auth.user
            ? auth.user.isAnonymous
              ? 'anonymous'
              : auth.user.uid
            : 'none'}
        </code>
      </p>

      <button onClick={() => auth.signOut()}>Sign out</button>
    </div>
  )
}
