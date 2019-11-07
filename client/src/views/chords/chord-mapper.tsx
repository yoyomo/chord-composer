import React from "react";
import {State} from "../../state";
import {Action} from "../../core/root-reducer";
import {ChordMapperKeys, toggleChordMapperKey} from "../../reducers/chord-mapper-reducer";

export const SelectedKey = () => {
  return <div className={"bg-light-red w2 h2 pa2 br-100"}/>
};

export function ChordMapper(dispatch: (action: Action) => void) {

  let dispatcher = {
    toggleChordMapperKey: (keyIndex: number) => dispatch(toggleChordMapperKey(keyIndex))
  };

  return (state: State) => {

    return (
      <div className={"w-100 bg-light-gray dark-gray"}>
        <div className={"overflow-x-auto overflow-y-hidden gpu pb1"}>
          <div className={"db nowrap"}>
            <div className="bg-gray w2 h3 dib v-mid pointer" onClick={() => dispatcher.toggleChordMapperKey(1)}/>
            {ChordMapperKeys.map((blackKey, i) => {
              const width = blackKey === "G#" ? 'w3' : 'w3-5';
              return blackKey.includes('#') &&
                  <div key={"black-key-" + i}
                       className={`bg-gray light-gray tc ${width} h3 dib v-mid pointer pa3 br b--white`}
                       onClick={() => dispatcher.toggleChordMapperKey(i)}>
                    {blackKey}
                    {state.chordMapperKeys[i] && <SelectedKey/>}
                  </div>
            })}
          </div>

          <div className={"db nowrap"}>
            {ChordMapperKeys.map((whiteKey, i) => {
              return !whiteKey.includes('#') &&
                  <div key={"white-key-" + i}
                       className={"bg-white dark-gray w3 h3 dib tc v-mid pointer pa3 bl b--black"}
                       onClick={() => dispatcher.toggleChordMapperKey(i)}>
                    {whiteKey}
                    {state.chordMapperKeys[i] && <SelectedKey/>}
                  </div>
            })}
            <div className="bg-white w2 h3 dib v-mid pointer" onClick={() => dispatcher.toggleChordMapperKey(ChordMapperKeys.length - 2)}/>

          </div>
        </div>

      </div>
    );
  }
}