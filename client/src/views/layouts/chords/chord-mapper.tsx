import React from "react";
import {State} from "../../../state";
import {Action} from "../../../react-root";
import {KEYS} from "../../../reducers/recompute-chord-grid";

export const SelectedKey = () => {
  return <div className={"bg-light-red w2 h2 pa2 br-100"}/>
};

export function ChordMapper(dispatch: (action: Action) => void) {

  let dispatcher = {};

  //c,#,d,#,e,f,#,g,#, +  a,#,b,c,#,d,#,e,f,#,g,#,  +  a,#,b,c,#,d,#,e,f,#,g,#, + a,#,b
  let displayKeys = KEYS.slice(3).concat(KEYS).concat(KEYS).concat(KEYS.slice(0, 3));

  return (state: State) => {
    let selectedKeys: boolean[] = [];

    if (state.selectedGridChord) {
      let tmpPitchClass = state.selectedGridChord.pitchClass.slice();
      let pitchClass = tmpPitchClass.slice();
      for(let i =0; i < pitchClass.length; i++){
        let pitch = pitchClass[i];
        let newPitch = (pitch - state.octave * 12 - 3) % (displayKeys.length);

        tmpPitchClass[i] = newPitch;
        if (tmpPitchClass[0] < 0){
          newPitch += 12;
        }
        pitchClass[i] = newPitch;
      }
      selectedKeys = displayKeys.map((key, i) => {
        return pitchClass.includes(i);
      });
    }

    return (
      <div className={"w-100 bg-light-gray dark-gray h5 overflow-x-hide-show overflow-y-hidden gpu"}>

        <div className={"db nowrap"}>
          {displayKeys.map((blackKey, i) => {
            return blackKey.includes('#') &&
              <div key={"black-key-" + i}
                   className={`bg-gray light-gray tc ${blackKey === "G#" ? 'w3' : 'w3-5'} h3 dib v-mid pointer pa3 br b--white`}>
                {blackKey}
                {selectedKeys[i] && <SelectedKey/>}
              </div>
          })}
        </div>

        <div className={"db nowrap"}>
          {displayKeys.map((whiteKey, i) => {
            return !whiteKey.includes('#') &&
              <div key={"white-key-" + i}
                   className={"bg-white dark-gray w3 h3 dib tc v-mid pointer pa3 br b--black"}>
                {whiteKey}
                {selectedKeys[i] && <SelectedKey/>}
              </div>
          })}
        </div>

      </div>
    );
  }
}