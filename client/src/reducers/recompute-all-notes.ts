import {memoizeBySomeProperties} from "../utils/memoizers";
import {initialState} from "../state";

export const NUMBER_OF_NOTES = 88;

export const recomputeAllNotes = memoizeBySomeProperties({
  synth: initialState.synth,
}, (state) => {
  let notes = [];

  for (let n = 0; n < NUMBER_OF_NOTES; n++) {
    notes[n] = Math.pow(2, ((n + 1) - 49) / 12) * state.synth.base_frequency;
  }

  return notes;
});