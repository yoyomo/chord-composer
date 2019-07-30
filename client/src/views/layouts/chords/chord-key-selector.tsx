import {Action} from "../../../core/root-reducer";
import {selectChord, selectKey} from "../../../reducers/chord-grid-reducer";
import {ChordType, KEYS} from "../../../reducers/recompute-chord-grid";
import {State} from "../../../state";
import {NoteKey} from "../../../components/note-key";
import React from "react";

export function ChordKeySelector(dispatch: (action: Action) => void) {

  let dispatcher = {
    selectKey: (keyIndex: number) => dispatch(selectKey(keyIndex)),
    selectChord: (chord: ChordType) => dispatch(selectChord(chord)),
  };

  return (state: State) => {
    return (
      <div className={"w-100"}>
        {KEYS.map((key, keyIndex) => {
          return <NoteKey key={"note-key-" + keyIndex}
                          baseKey={key} keyIndex={keyIndex}
                          isSuggested={state.suggestedKeyIndexes.indexOf(keyIndex) !== -1}
                          isSelected={state.selectedKeyIndex === keyIndex}
                          selectKey={dispatcher.selectKey}/>
        })}
      </div>
    )
  }
}