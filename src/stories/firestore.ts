import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
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

export type StoryListItem = {
  id: string
  title: string
  updatedAt?: unknown
  createdAt?: unknown
}

export async function listStoriesByOwnerUid(params: {
  ownerUid: string
  max?: number
}): Promise<StoryListItem[]> {
  const db = getFirestoreDb()
  const max = params.max ?? 20

  const q = query(
    collection(db, 'stories'),
    where('ownerUid', '==', params.ownerUid),
    orderBy('updatedAt', 'desc'),
    limit(max)
  )

  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data() as Record<string, unknown>
    return {
      id: d.id,
      title: (data.title as string) ?? 'Untitled story',
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
    }
  })
}
