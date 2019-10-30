import { Action } from "../core/root-reducer";
import { State } from "../state";
import { Effect } from "../core/services/service";
import { calculateMML } from "../utils/mml-utils";

export type AddChordAndLyricAction = {
  type: "add-chord-and-lyric"
  songId: string
}

export const addChordAndLyric = (songId = ""): AddChordAndLyricAction => {
  return {
    type: "add-chord-and-lyric",
    songId
  }
};

export type SongPageActions =
  AddChordAndLyricAction;

export const reduceSongPage = (state: State, action: Action) => {
  let effects: Effect[] = [];

  switch (action.type) {
    case "add-chord-and-lyric": {
      state = { ...state };
      state.newSong = { ...state.newSong };
      state.newSong.chordsAndLyrics = state.newSong.chordsAndLyrics.slice();
      if (!state.selectedGridChord) break;
      state.newSong.chordsAndLyrics.push({ chord: calculateMML(state.selectedGridChord), lyric: state.inputs.lyric });
      break;
    }
  }
  return { state, effects };
};