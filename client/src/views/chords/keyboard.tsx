import * as React from 'react';
import {State} from "../../state";
import {Action} from "../../core/root-reducer";
import {
  changeKeyboardMap,
  ChordMapperKeys,
  KeyBoardMapType,
  toggleKeyboardKey
} from "../../reducers/keyboard-reducer";
import {USKeyboardMapperFirstRow, USKeyboardMapperSecondRow} from "../../core/services/external-input-service";
import {OutputSource} from "../../core/services/midi-service";
import {inputChangeDispatcher} from "../../reducers/input-reducer";

export const SelectedKeyIndicator = () => {
  return <div className={"bg-light-red w2 h2 pa2 br-100"}/>
};

interface ComputerKeyboardKeyProps {
  index: number
}

export const ComputerKeyboardKey = (props: ComputerKeyboardKeyProps) => {
  const firstRowKey = USKeyboardMapperFirstRow[props.index] || "";
  const secondRowKey = USKeyboardMapperSecondRow[props.index] || "";
  const letter = secondRowKey + ' ' + firstRowKey;
  return letter.trim() &&
    <div>
      <div className="absolute bg-light-blue h0_125rem top-0 left-0 w-100"/>
      <div className="absolute bg-light-blue pa1 black top-0 right-0 br2 br--bottom br--left">
        {letter.toUpperCase()}
      </div>
    </div>
};

export function Keyboard(dispatch: (action: Action) => void) {

  let dispatcher = {
    toggleChordMapperKey: (keyIndex: number) => dispatch(toggleKeyboardKey(keyIndex)),
    changeKeyBoardMap: (keyboardMap: KeyBoardMapType) => dispatch(changeKeyboardMap(keyboardMap))
  };

  const keyboardMappers: KeyBoardMapType[] = ['none', 'keys', 'chords'];
  const outputSources: OutputSource[] = ['computer', 'midi'];

  return (state: State) => {

    return (
      <div className={"w-100 bg-light-gray dark-gray"}>
        <div>
          {keyboardMappers.map(keyboardMap => {
            const color = state.inputs.mapKeyboardTo === keyboardMap ? 'light-blue' : 'black';
            return (
              <div className={`pointer dib pa1 ${color}`}
                   onClick={() => dispatcher.changeKeyBoardMap(keyboardMap)}>
                {keyboardMap}
              </div>
            );
          })}
        </div>

        <div>
          {outputSources.map(outputSource => {
            const color = state.inputs.outputSource === outputSource ? 'light-blue' : 'black';
            return (
              <div className={`pointer dib pa1 ${color}`}
                   onClick={inputChangeDispatcher(dispatch,"outputSource", outputSource)}>
                {outputSource}
              </div>
            );
          })}
        </div>
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
                  {state.inputs.mapKeyboardTo === 'keys' && <ComputerKeyboardKey index={i}/>}
                  {state.chordMapperKeys[i] && <SelectedKeyIndicator/>}
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
                  {state.inputs.mapKeyboardTo === 'keys' && <ComputerKeyboardKey index={i}/>}
                  {state.chordMapperKeys[i] && <SelectedKeyIndicator/>}
                </div>
            })}


          </div>
        </div>

      </div>
    );
  }
}