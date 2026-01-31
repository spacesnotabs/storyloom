import {
  addDoc,
  collection,
  deleteDoc,
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
import type { Scene, Story } from './types'

export type CreateStoryInput = {
  title: string
  ownerUid: string
}

export function normalizeStory(id: string, data: Record<string, unknown>): Story {
  return {
    id,
    title: (data.title as string) ?? 'Untitled story',
    ownerUid: (data.ownerUid as string) ?? '',
    updatedAt: data.updatedAt,
    createdAt: data.createdAt,
  }
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

export async function getStoryById(storyId: string): Promise<Story | null> {
  const db = getFirestoreDb()
  const ref = doc(db, 'stories', storyId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return normalizeStory(snap.id, snap.data() as Record<string, unknown>)
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

export async function deleteStoryById(params: {
  storyId: string
}): Promise<void> {
  const db = getFirestoreDb()
  const ref = doc(db, 'stories', params.storyId)
  await deleteDoc(ref)
}

export async function listStoriesByOwnerUid(params: {
  ownerUid: string
  max?: number
}): Promise<Story[]> {
  const db = getFirestoreDb()
  const max = params.max ?? 20

  const q = query(
    collection(db, 'stories'),
    where('ownerUid', '==', params.ownerUid),
    orderBy('updatedAt', 'desc'),
    limit(max)
  )

  const snap = await getDocs(q)
  return snap.docs.map((d) =>
    normalizeStory(d.id, d.data() as Record<string, unknown>)
  )
}

export function normalizeScene(
  params: { storyId: string; id: string },
  data: Record<string, unknown>
): Scene {
  return {
    id: params.id,
    storyId: params.storyId,
    body: (data.body as string) ?? '',
    updatedAt: data.updatedAt,
    createdAt: data.createdAt,
  }
}

export async function createScene(params: {
  storyId: string
  body: string
}): Promise<string> {
  const db = getFirestoreDb()
  const ref = await addDoc(collection(db, 'stories', params.storyId, 'scenes'), {
    body: params.body,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function listScenesByStoryId(params: {
  storyId: string
  max?: number
}): Promise<Scene[]> {
  const db = getFirestoreDb()
  const max = params.max ?? 50

  const q = query(
    collection(db, 'stories', params.storyId, 'scenes'),
    orderBy('createdAt', 'asc'),
    limit(max)
  )

  const snap = await getDocs(q)
  return snap.docs.map((d) =>
    normalizeScene(
      { storyId: params.storyId, id: d.id },
      d.data() as Record<string, unknown>
    )
  )
}

export async function deleteSceneById(params: {
  storyId: string
  sceneId: string
}): Promise<void> {
  const db = getFirestoreDb()
  const ref = doc(db, 'stories', params.storyId, 'scenes', params.sceneId)
  await deleteDoc(ref)
}
