import {KEYS, NoteKey} from "../components/note-key";
import {hideVariations, selectChordType, selectKey, showVariations} from "../reducers/root-page-reducer";
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
  };

  return (state: State) => {
    return (
      <div className={"w-100 h-100"}>
        <div className={"absolute top-0"}>
          {KEYS.map((key, i) => {
            return <NoteKey baseKey={key} keyIndex={i}
                            selectKey={dispatcher.selectKey}/>
          })}
        </div>
        <div className={"overflow-auto"}>
          {state.selectedKeyIndex != null &&
          state.chordGrid.map((chord, i) => {
            return <ChordElement chord={chord}
                                 notes={state.notes}
                                 audioContext={state.audioContext}
                                 selectChordType={() => dispatcher.selectChordType(i)}
            />
          })
          }
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