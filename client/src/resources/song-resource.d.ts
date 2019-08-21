export interface SongResource {
  id: number
  user_id: string
  title: string
  author: string

  chordsAndLyrics: ChordAndLyricResource[]

  created_at: string

}

export interface ChordAndLyricResource {
  chord: string
  lyric: string
}