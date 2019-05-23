import {KEYS, NoteKey} from "../components/note-key";
import {
  changeBaseFrequency,
  decreaseOctave,
  hideVariations, increaseOctave,
  selectChordType,
  selectKey,
  showVariations
} from "../reducers/root-page-reducer";
import {ChordElement} from "../components/chord";
import {VariationsButton} from "../components/variations-button";
import React from "react";
import {State} from "../state";
import {Action} from "../react-root";


export function RootPage(dispatch: (action: Action) => void) {

  let dispatcher = {
    selectKey: (keyIndex: number) => dispatch(selectKey(keyIndex)),
    selectChordType: (chordTypeIndex: number) => dispatch(selectChordType(chordTypeIndex)),
    showVariations: () => dispatch(showVariations()),
    hideVariations: () => dispatch(hideVariations()),
    decreaseOctave: () => dispatch(decreaseOctave()),
    increaseOctave: () => dispatch(increaseOctave()),
    changeBaseFrequency: (freq: number) => dispatch(changeBaseFrequency(freq)),
  };

  return (state: State) => {
    return (
        <div className={"vw-100 vh-100 flex flex-column overflow-hidden"}>
          <div className={"h3 w-100 bg-light-gray flex flex-row items-stretch"}>
            <div className={"w2 h2 bg-gray ma2 pa2 light-gray"} onClick={dispatcher.decreaseOctave}>
              -
            </div>
            <div className={"ma2 pa2 dark-gray tc"}>
              <div className={"db"}>Octave</div>
              <div className={"db"}>{state.octave}</div>
            </div>
            <div className={"w2 h2 bg-gray ma2 pa2 light-gray"} onClick={dispatcher.increaseOctave}>
              +
            </div>

            <div>
              <div className={"ma2 pa2 dark-gray tc"}>
                <div className={"db"}>Base Frequency</div>
                <input type={"number"} className={"db"}
                       value={state.baseFrequency}
                       onChange={(e) => dispatcher.changeBaseFrequency(parseInt(e.target.value))}/>
              </div>
            </div>
          </div>
          <div className={"overflow-auto"}>
            <div className={"w-100"}>
              {KEYS.map((key, i) => {
                return <NoteKey key={"note-key-"+i}
                                baseKey={key} keyIndex={i}
                                selectKey={dispatcher.selectKey}/>
              })}
            </div>
            <div>
              {state.selectedKeyIndex != null &&
              state.chordGrid.map((chord, i) => {
                return <ChordElement key={"chord-"+i}
                                     chord={chord}
                                     notes={state.notes}
                                     audioContext={state.audioContext}
                                     selectChordType={() => dispatcher.selectChordType(i)}
                />
              })
              }
            </div>
          </div>

          <div>
            {state.selectedChordTypeIndex !== null && <VariationsButton
                showingVariations={state.showingVariations}
                onShow={dispatcher.showVariations}
                onHide={dispatcher.hideVariations}/>}
          </div>

        </div>
    );
  }
}