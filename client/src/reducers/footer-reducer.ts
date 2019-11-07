import { State } from "../state";
import { ReductionWithEffect } from "../core/reducers";
import { requestAjax } from "../core/services/ajax-service";
import { ApiV1UsersPath } from "../resources/routes";
import { calculateMML } from "../utils/mml-utils";
import { Action } from "../core/root-reducer";
import { Effect } from "../core/services/services";

export type SaveChordAction = {
  type: "save-chord"
}

export const saveChord = (): SaveChordAction => {
  return {
    type: "save-chord",
  };
};

export type RemoveSavedChordAction = {
  type: "remove-saved-chord"
}

export const removeSavedChord = (): RemoveSavedChordAction => {
  return {
    type: "remove-saved-chord",
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
  | SaveChordAction
  | RemoveSavedChordAction
  | SelectSavedChordAction;

export const reduceFooter = (state: State, action: Action): ReductionWithEffect<State> => {
  let effects: Effect[] = [];

  switch (action.type) {
    case "save-chord": {
      state = { ...state };
      state.savedChords = state.savedChords.slice();
      if (!state.selectedGridChord) break;
      state.savedChords.push(state.selectedGridChord);

      effects = effects.concat(updateFavoriteChords(state));
      break;
    }

    case "remove-saved-chord": {
      state = { ...state };
      state.savedChords = state.savedChords.slice();
      state.savedChords.splice(state.selectedSavedChord || state.savedChords.length - 1, 1);
      state.selectedSavedChord = null as unknown as number;

      effects = effects.concat(updateFavoriteChords(state));
      break;
    }

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

  let mmlFavoriteChords = state.savedChords.map(favoriteChord => calculateMML(favoriteChord));

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