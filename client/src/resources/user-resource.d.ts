export interface UserResource {
  id: number
  username: string
  email: string
  favorite_chords: string[]
  access_token: string

  created_at: string
}