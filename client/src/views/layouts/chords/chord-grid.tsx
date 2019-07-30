import {ChordElement} from "../../../components/chord";
import React from "react";
import {State} from "../../../state";
import {chordIdentifier, ChordType} from "../../../reducers/recompute-chord-grid";
import {Action} from "../../../core/root-reducer";
import {selectChord} from "../../../reducers/chord-mapper-reducer";


export function ChordGrid(dispatch: (action: Action) => void) {

  let dispatcher = {
    selectChord: (chord: ChordType) => dispatch(selectChord(chord)),
  };

  return (state: State) => {
    return (
        <div className={"overflow-hidden h-100"}>
          <div className={"overflow-auto h-100"}>
            {state.selectedKeyIndex != null &&
            state.chordGrid.map(chord => {
              return <ChordElement key={"chord-" + chordIdentifier(chord)}
                                   chord={chord}
                                   notes={state.notes}
                                   audioContext={state.audioContext}
                                   isSelected={!!state.selectedGridChord && chordIdentifier(state.selectedGridChord) === chordIdentifier(chord)}
                                   isSuggested={state.suggestedGridChords.filter(c => chordIdentifier(c) === chordIdentifier(chord)).length > 0}
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