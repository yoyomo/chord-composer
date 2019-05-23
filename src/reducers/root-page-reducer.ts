import {initialState, State} from "../state";
import {ChordType} from "../components/chord";
import {KEYS} from "../components/note-key";
import {Action} from "../react-root";
import {memoizeBySomeProperties} from "../utils/memoizers";

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

export interface SelectChordRuleAction {
  type: "select-chord-type"
  chordRuleIndex: number
}

export const selectChordRule = (chordRuleIndex: number): SelectChordRuleAction => {
  return {
    type: "select-chord-type",
    chordRuleIndex: chordRuleIndex
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

export interface ChangeBaseFrequencyAction {
  type: "change-base-frequency"
  frequency: number
}

export const changeBaseFrequency = (frequency: number): ChangeBaseFrequencyAction => {
  return {
    type: "change-base-frequency",
    frequency
  };
};

export type RootPageAction =
    SelectKeyAction
    | ShowVariationsAction
    | HideVariationsAction
    | SelectChordRuleAction
    | DecreaseOctaveAction
    | IncreaseOctaveAction
    | ChangeBaseFrequencyAction;

export const NUMBER_OF_NOTES = 88;

export const recomputeAllNotes = memoizeBySomeProperties({
  baseFrequency: initialState.baseFrequency,
}, (state) => {
  let notes = [];

  for (let n = 0; n < NUMBER_OF_NOTES; n++) {
    notes[n] = Math.pow(2, ((n + 1) - 49) / 12) * state.baseFrequency;
  }

  return notes;
});

export const recomputeChordGrid = memoizeBySomeProperties({
  chordRules: initialState.chordRules,
  selectedKeyIndex: initialState.selectedKeyIndex,
  octave: initialState.octave,
  selectedChordRuleIndex: initialState.selectedChordRuleIndex,
  chordGrid: initialState.chordGrid,
  showingVariations: initialState.showingVariations,
}, (state) => {

  let chordGrid: ChordType[] = [];
  state.chordRules.map((chordRule, i) => {
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

    let baseChord: ChordType = {
      ...chordRule,
      pitchClass: pitchClass.slice(),
      variation: 0,
      baseKey: KEYS[state.selectedKeyIndex],
      chordRuleIndex: i,
    };

    chordGrid.push(baseChord);

    if (state.showingVariations[i]) {

      let pitchClass = baseChord.pitchClass.slice();

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

        chordGrid.push(chordVariation);
      }
    }

    return baseChord;
  });


  return chordGrid
});

export const reduceRootPage = (state: State, action: Action): State => {
  switch (action.type) {
    case "select-key": {
      let keyIndex = action.keyIndex;

      state = {...state};
      state.selectedKeyIndex = keyIndex;
      break;
    }

    case "select-chord-type": {
      state = {...state};
      state.selectedChordRuleIndex = action.chordRuleIndex;
      break;
    }

    case "show-variations": {
      state = {...state};
      state.showingVariations = {...state.showingVariations};
      state.showingVariations[state.selectedChordRuleIndex] = true;
      break;
    }

    case "hide-variations": {
      state = {...state};
      state.showingVariations = {...state.showingVariations};
      state.showingVariations[state.selectedChordRuleIndex] = false;
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

    case "change-base-frequency": {
      state = {...state};
      state.baseFrequency = action.frequency;
      break;
    }


  }

  return state;
};
