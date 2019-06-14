import {NoteKey} from "../components/note-key";
import {ChordElement} from "../components/chord";
import React from "react";
import {State} from "../state";
import {Action} from "../react-root";
import {selectChord, selectKey} from "../reducers/chord-canvas-reducer";
import {chordIdentifier, ChordType, KEYS} from "../reducers/recompute-chord-grid";


export function ChordCanvas(dispatch: (action: Action) => void) {

  let dispatcher = {
    selectKey: (keyIndex: number) => dispatch(selectKey(keyIndex)),
    selectChord: (chord: ChordType) => dispatch(selectChord(chord)),
  };

  return (state: State) => {
    return (
        <div className={"overflow-auto h-100"}>
          <div className={"w-100"}>
            {KEYS.map((key, i) => {
              return <NoteKey key={"note-key-" + i}
                              baseKey={key} keyIndex={i}
                              selectKey={dispatcher.selectKey}/>
            })}
          </div>
          <div>
            {state.selectedKeyIndex != null &&
            state.chordGrid.map(chord => {
              return <ChordElement key={"chord-" + chordIdentifier(chord)}
                                   chord={chord}
                                   notes={state.notes}
                                   audioContext={state.audioContext}
                                   isSelected={!!state.selectedGridChord && chordIdentifier(state.selectedGridChord) === chordIdentifier(chord)}
                                   onSelect={() => dispatcher.selectChord(chord)}
                                   waveType={state.waveType}
                                   soundOn={state.soundOn}
              />
            })
            }
          </div>
        </div>
    );
  }
}