import React from "react";
import { State } from "../../state";
import { Action } from "../../core/root-reducer";
import { ChordMapperKeys, toggleChordMapperKey } from "../../reducers/chord-mapper-reducer";
import { USKeyboardMapperFirstRow, USKeyboardMapperSecondRow } from "../../core/services/external-input-service";

export const SelectedKey = () => {
  return <div className={"bg-light-red w2 h2 pa2 br-100"} />
};

interface KeyboardKeyProps {
  i: number
}
export const KeyboardKey = (props: KeyboardKeyProps) => {
  const firstRowKey = USKeyboardMapperFirstRow[props.i] || "";
  const secondRowKey = USKeyboardMapperSecondRow[props.i] || "";
  const letter = secondRowKey + ' ' + firstRowKey;
  return <div>
    <div className="absolute bg-light-blue h0_125rem top-0 left-0 w-100" />
    <div className="absolute bg-light-blue pa1 black top-0 right-0 br2 br--bottom br--left">
      {letter.toUpperCase()}
    </div>
  </div>
}

export function ChordMapper(dispatch: (action: Action) => void) {

  let dispatcher = {
    toggleChordMapperKey: (keyIndex: number) => dispatch(toggleChordMapperKey(keyIndex))
  };

  return (state: State) => {

    return (
      <div className={"w-100 bg-light-gray dark-gray"}>
        <div className={"overflow-x-auto overflow-y-hidden gpu pb1"}>
          <div className={"db nowrap"}>
            {ChordMapperKeys.map((blackKey, i) => {
              
              let width = "";
              if (blackKey === "G#" && i < ChordMapperKeys.length - 2) {
                width = 'w3';
              } else if (i === 1) {
                width = 'w4';
              } else {
                width = 'w3-5'
              }

              return blackKey.includes('#') &&
                <div key={"black-key-" + i}
                  className={`bg-gray light-gray tc ${width} h3 dib v-mid pointer pa3 br b--white relative`}
                  onClick={() => dispatcher.toggleChordMapperKey(i)}>
                  {blackKey}
                  <KeyboardKey i={i} />
                  {state.chordMapperKeys[i] && <SelectedKey />}
                </div>
            })}
          </div>

          <div className={"db nowrap"}>
            {ChordMapperKeys.map((whiteKey, i) => {
              return !whiteKey.includes('#') &&
                <div key={"white-key-" + i}
                  className={"bg-white dark-gray w3 h3 dib tc v-mid pointer pa3 bl b--black relative"}
                  onClick={() => dispatcher.toggleChordMapperKey(i)}>
                  {whiteKey}
                  <KeyboardKey i={i} />
                  {state.chordMapperKeys[i] && <SelectedKey />}
                </div>
            })}


          </div>
        </div>

      </div>
    );
  }
}