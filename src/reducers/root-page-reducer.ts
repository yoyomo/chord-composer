import {State} from "../state";
import {ChordType} from "../components/chord";
import {KEYS} from "../components/note-key";
import {Action} from "../react-root";

export interface SelectKeyAction {
  type: "select-key"
  keyIndex: number
}

export const selectKey = (keyIndex: number): SelectKeyAction => {
  return {
    type: "select-key",
    keyIndex
  };
};

export interface ShowVariationsAction {
  type: "show-variations"
}

export const showVariations = (): ShowVariationsAction => {
  return {
    type: "show-variations",
  };
};

export interface HideVariationsAction {
  type: "hide-variations"
}

export const hideVariations = (): HideVariationsAction => {
  return {
    type: "hide-variations",
  };
};

export interface SelectChordTypeAction {
  type: "select-chord-type"
  chordTypeIndex: number
}

export const selectChordType = (chordTypeIndex: number): SelectChordTypeAction => {
  return {
    type: "select-chord-type",
    chordTypeIndex
  };
};

export interface DecreaseOctaveAction {
  type: "decrease-octave"
}

export const decreaseOctave = (): DecreaseOctaveAction => {
  return {
    type: "decrease-octave",
  };
};

export interface IncreaseOctaveAction {
  type: "increase-octave"
}

export const increaseOctave = (): IncreaseOctaveAction => {
  return {
    type: "increase-octave",
  };
};

export type RootPageAction =
    SelectKeyAction
    | ShowVariationsAction
    | HideVariationsAction
    | SelectChordTypeAction
    | DecreaseOctaveAction
    | IncreaseOctaveAction;

export const recomputeChordGrid = (state: State) => {

  let chordGrid: ChordType[] = [];
  state.chordRules.map(chordRule => {
    let pitchClass = chordRule.pitchClass.slice();

    // add key and octave
    for (let p = 0; p < pitchClass.length; p++) {
      pitchClass[p] += state.selectedKeyIndex + state.octave * 12;
    }

    // make sure pitchClass is incrementing array
    for (let p = 0; p < pitchClass.length; p++) {
      while (p > 0 && pitchClass[p] < pitchClass[p - 1]) {
        pitchClass[p] += 12;
      }
    }

    let chord: ChordType = {
      ...chordRule,
      pitchClass: pitchClass.slice(),
      variation: 0,
      baseKey: KEYS[state.selectedKeyIndex]
    };

    chordGrid.push(chord);
    return chord;
  });

  return chordGrid
};

export const reduceRootPage = (state: State, action: Action): State => {
  switch (action.type) {
    case "select-key": {
      let keyIndex = action.keyIndex;

      state = {...state};
      state.selectedKeyIndex = keyIndex;
      break;
    }

    case "select-chord-type":
      let chordGridIndex = action.chordTypeIndex;
      let selectedChord = state.chordGrid[chordGridIndex];

      while (selectedChord.variation > 0) {
        selectedChord = state.chordGrid[--chordGridIndex];
      }

      let nextChord = state.chordGrid[chordGridIndex + 1];

      state = {...state};
      state.selectedChordTypeIndex = chordGridIndex;
      state.showingVariations = nextChord && nextChord.variation > 0;

      break;

    case "show-variations": {
      let baseChord = state.chordGrid[state.selectedChordTypeIndex];

      let pitchClass = baseChord.pitchClass.slice();
      let chordGrid = state.chordGrid.slice();

      for (let v = 1; v < pitchClass.length; v++) {
        let firstPitch = pitchClass.shift();

        if (firstPitch) {
          while (firstPitch < pitchClass[pitchClass.length - 1]) {
            firstPitch += 12;
          }
          pitchClass.push(firstPitch);
        }

        let chordVariation: ChordType = {
          ...baseChord,
          pitchClass: pitchClass.slice(),
          variation: v,
        };

        chordGrid.splice(state.selectedChordTypeIndex + v, 0, chordVariation);
      }

      state = {...state};
      state.chordGrid = chordGrid;
      state.showingVariations = true;
      break;
    }

    case "hide-variations": {
      let baseChord = state.chordGrid[state.selectedChordTypeIndex];

      let chordGrid = state.chordGrid.slice();

      chordGrid = chordGrid.slice(0, state.selectedChordTypeIndex + 1).concat(chordGrid.slice(state.selectedChordTypeIndex + baseChord.pitchClass.length));

      state = {...state};
      state.chordGrid = chordGrid;
      state.showingVariations = false;

      break;
    }

    case "decrease-octave": {
      state = {...state};
      state.octave--;
      if (state.octave < 0) {
        state.octave = 0;
      }
      break;
    }

    case "increase-octave": {
      state = {...state};
      state.octave++;
      if (state.octave > 6) {
        state.octave = 6;
      }
      break;
    }


  }
  return state;
};
