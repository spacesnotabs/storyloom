import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

export type FirebaseConfig = {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket?: string
  messagingSenderId?: string
  appId: string
}

function readFirebaseConfig(): FirebaseConfig | null {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as
    | string
    | undefined
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID as
    | string
    | undefined
  const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as
    | string
    | undefined
  const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as
    | string
    | undefined
  const appId = import.meta.env.VITE_FIREBASE_APP_ID as string | undefined

  if (!apiKey || !authDomain || !projectId || !appId) return null

  return { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId }
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let firestore: Firestore | null = null

export function isFirebaseConfigured(): boolean {
  return readFirebaseConfig() !== null
}

export function getFirebaseApp(): FirebaseApp {
  if (app) return app

  const config = readFirebaseConfig()
  if (!config) {
    throw new Error(
      'Firebase is not configured. Create .env.local (see .env.example) with VITE_FIREBASE_* values.'
    )
  }

  app = initializeApp(config)
  return app
}

export function getFirebaseAuth(): Auth {
  if (auth) return auth
  auth = getAuth(getFirebaseApp())
  return auth
}

export function getFirestoreDb(): Firestore {
  if (firestore) return firestore
  firestore = getFirestore(getFirebaseApp())
  return firestore
}
