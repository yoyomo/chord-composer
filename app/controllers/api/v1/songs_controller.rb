# class CreateSongs < ActiveRecord::Migration[5.2]
#   def change
#     create_table :songs do |t|
#
#       t.references :user
#       t.references :synth
#
#       t.string :title
#       t.string :author
#
# # [{chord: "o2[Ceg]1^1^1", lyric: "I am a C chord's lyric"} ,...]
# # melody: [{note: "o2a2", syllable: "I"},{note: "o2[ce]8", syllable: "am"} ,...]
# t.jsonb :chords_and_lyrics, array: true, default: [], null: false
#
# t.timestamps
# end
# end
# end

class Api::V1::SongsController < APIController
  before_action :set_song, only: [:show, :update, :destroy]

  def index
    @songs = Song.all

    render json: @songs
  end

  def show
    render json: @song
  end

  def create
    @song = Song.new(song_params)

    if @song.save
      render json: @song, status: :created, location: @song
    else
      render json: @song.errors, status: :unprocessable_entity
    end
  end

  def update
    if @song.update(song_params)
      render json: @song
    else
      render json: @song.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @song.destroy
  end

  private

    def set_song
      @song = Song.find(params[:id])
    end

    def song_params
      params.require(:user).permit(lyrics: [], chords: [])
    end
end
