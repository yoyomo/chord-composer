export interface UserResource {
  id: number
  username: string
  email: string
  favorite_chords: string[]

  allow_password_change: boolean
  created_at: string
  provider: string
  uid: string
  updated_at: string
}