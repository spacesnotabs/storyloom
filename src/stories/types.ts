export type Story = {
  id: string
  title: string
  ownerUid: string
  createdAt?: unknown
  updatedAt?: unknown
}

export type Scene = {
  id: string
  storyId: string
  body: string
  createdAt?: unknown
  updatedAt?: unknown
}
