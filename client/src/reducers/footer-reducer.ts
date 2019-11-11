import { State } from "../state";
import { ReductionWithEffect } from "../core/reducers";
import { requestAjax } from "../core/services/ajax-service";
import { ApiV1UsersPath } from "../resources/routes";
import { calculateMML } from "../utils/mml-utils";
import { Action } from "../core/root-reducer";
import { Effect } from "../core/services/services";
import {chordIdentifier, ChordType} from "./recompute-chord-grid";

export type ToggleDraftChordAction = {
  type: "toggle-draft-chord"
  chord: ChordType
}

export const toggleDraftChord = (chord: ChordType): ToggleDraftChordAction => {
  return {
    type: "toggle-draft-chord",
    chord
  };
};

export type ShowStarAction = {
  type: "show-star"
  chord: ChordType
  show: boolean
}

export const showStar = (chord: ChordType, show: boolean): ShowStarAction => {
  return {
    type: "show-star",
    chord,
    show
  };
};


export type SelectSavedChordAction = {
  type: "select-saved-chord"
  savedChordIndex: number
}

export const selectSavedChord = (savedChordIndex: number): SelectSavedChordAction => {
  return {
    type: "select-saved-chord",
    savedChordIndex
  };
};

export type FooterActions =
  | ToggleDraftChordAction
  | ShowStarAction
  | SelectSavedChordAction;

export const reduceFooter = (state: State, action: Action): ReductionWithEffect<State> => {
  let effects: Effect[] = [];

  switch (action.type) {
    case "toggle-draft-chord": {
      state = { ...state };
      state.draftChords = state.draftChords.slice();

      let savedChordIndex = -1;
      for(let i =0;i < state.draftChords.length; i++){
        if(chordIdentifier(state.draftChords[i]) === chordIdentifier(action.chord)){
          savedChordIndex = i;
          break;
        }
      }

      if(savedChordIndex === -1 ){
        state.draftChords.push(action.chord);
      } else {
        state.draftChords.splice(savedChordIndex, 1);
      }


      effects = effects.concat(updateFavoriteChords(state));
      break;
    }

    case "show-star":
      state = {...state};
      state.showStarChord = action.show ? action.chord : undefined;
      break;

    case "select-saved-chord": {
      state = { ...state };
      state.selectedSavedChord = action.savedChordIndex;
      break;
    }

  }

  return { state, effects };
};

export const updateFavoriteChords = (state: State): Effect[] => {
  let effects: Effect[] = [];

  let mmlFavoriteChords = state.draftChords.map(favoriteChord => calculateMML(favoriteChord));

  if (!state.loggedInUser) return [];
  effects.push(requestAjax([updateFavoriteChordRequestName], {
    url: `${ApiV1UsersPath}/${state.loggedInUser.id}`, method: "PUT", headers: state.headers,
    json: {
      user: {
        favorite_chords: mmlFavoriteChords
      }
    }
  }));

  return effects;
};

export const updateFavoriteChordRequestName = "update-favorite-chords";
export const getLoggedInUserRequestName = "get-logged-in-user";