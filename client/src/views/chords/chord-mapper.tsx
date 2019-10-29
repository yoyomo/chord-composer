import React from "react";
import {State} from "../../state";
import {KEYS} from "../../reducers/recompute-chord-grid";
import {Action} from "../../core/root-reducer";
import {ChordMapperKeys, toggleChordMapperKey} from "../../reducers/chord-mapper-reducer";
import {playSound} from "../../utils/sound-utils";

export const SelectedKey = () => {
  return <div className={"bg-light-red w2 h2 pa2 br-100"}/>
};

export function ChordMapper(dispatch: (action: Action) => void) {

  let dispatcher = {
    toggleChordMapperKey: (keyIndex: number) => dispatch(toggleChordMapperKey(keyIndex))
  };

  return (state: State) => {

    const onKeyClick = (keyIndex: number) => {
      dispatcher.toggleChordMapperKey(keyIndex);
      let noteIndex = keyIndex + (state.octave * KEYS.length);
      playSound(noteIndex, state.notes, state.audioContext, state.waveType, state.soundOn)
    };

    return (
      <div className={"w-100 bg-light-gray dark-gray"}>
        <div className={"overflow-x-auto overflow-y-hidden gpu pb1"}>
          <div className={"db nowrap"}>
            {ChordMapperKeys.map((blackKey, i) => {
              return blackKey.includes('#') &&
                <div key={"black-key-" + i}
                     className={`bg-gray light-gray tc ${blackKey === "G#" ? 'w3' : 'w3-5'} h3 dib v-mid pointer pa3 br b--white`} onClick={() => onKeyClick(i)}>
                  {blackKey}
                  {state.chordMapperKeys[i] && <SelectedKey/>}
                </div>
            })}
          </div>

          <div className={"db nowrap"}>
            {ChordMapperKeys.map((whiteKey, i) => {
              return !whiteKey.includes('#') &&
                <div key={"white-key-" + i}
                     className={"bg-white dark-gray w3 h3 dib tc v-mid pointer pa3 br b--black"}  onClick={() => onKeyClick(i)}>
                  {whiteKey}
                  {state.chordMapperKeys[i] && <SelectedKey/>}
                </div>
            })}
          </div>
        </div>

      </div>
    );
  }
}