export type NotificationsType = Notification[]

export interface Notification {
  _id: string
  recipient: Recipient
  actor: Actor
  type: string
  entityType: string
  entityId: string
  isRead: boolean
  createdAt: string
  entity: Entity
}

export interface Recipient {
  _id: string
  name: string
  photo: string
}

export interface Actor {
  _id: string
  name: string
  photo: string
}

export interface Entity {
  _id: string
  body?: string
  user?: string
  commentsCount?: number
  topComment?: TopComment
  sharesCount?: number
  likesCount?: number
  isShare?: boolean
  id?: string
  content?: string
  commentCreator?: CommentCreator2
  post?: string
  isReply?: boolean
  unavailable?: boolean
  name?: string
  username?: string
  photo?: string
  followersCount?: number
  followingCount?: number
  bookmarksCount?: number
}

export interface TopComment {
  _id: string
  content: string
  commentCreator: CommentCreator
  post: string
  parentComment: any
  likes: any[]
  createdAt: string
}

export interface CommentCreator {
  _id: string
  name: string
  username: string
  photo: string
}

export interface CommentCreator2 {
  _id: string
  name: string
  username: string
  photo: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}
