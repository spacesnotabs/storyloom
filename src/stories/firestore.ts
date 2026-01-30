import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { getFirestoreDb } from '../auth/firebase'

export type CreateStoryInput = {
  title: string
  ownerUid: string
}

export async function createStory(input: CreateStoryInput): Promise<string> {
  const db = getFirestoreDb()
  const ref = await addDoc(collection(db, 'stories'), {
    title: input.title,
    ownerUid: input.ownerUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function getStoryById(
  storyId: string
): Promise<{ id: string; data: Record<string, unknown> } | null> {
  const db = getFirestoreDb()
  const ref = doc(db, 'stories', storyId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, data: snap.data() as Record<string, unknown> }
}

export async function setStoryTitle(params: {
  storyId: string
  title: string
}): Promise<void> {
  const db = getFirestoreDb()
  const ref = doc(db, 'stories', params.storyId)
  await setDoc(
    ref,
    {
      title: params.title,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}
