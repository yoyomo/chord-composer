import React from "react";
import {State} from "../../state";
import {
  removeSavedChord,
  toggleDraftChord,
  selectSavedChord,
} from "../../reducers/footer-reducer";
import {ChordElement} from "../../components/chord";
import {chordIdentifier} from "../../reducers/recompute-chord-grid";
import {Action} from "../../core/root-reducer";

export function Footer(dispatch: (action: Action) => void) {

  let dispatcher = {
    onSelectSavedChord: (savedChordIndex: number) => dispatch(selectSavedChord(savedChordIndex)),
  };

  return (state: State) => {
    return (
      <div className={"w-100 bg-light-gray dark-gray h4 flex flex-row items-stretch"}>
        <div className={"dib overflow-y-hide-show h-100"}>
          {state.draftChords.map((savedChord, s) => {
            return <ChordElement key={"saved-chord-" + s}
                                 chord={savedChord}
                                 notes={state.notes}
                                 audioContext={state.audioContext}
                                 waveType={state.waveType}
                                 soundOn={state.soundOn}
                                 onSelect={() => dispatcher.onSelectSavedChord(s)}
                                 isSelected={!!state.selectedGridChord && chordIdentifier(state.selectedGridChord) === chordIdentifier(savedChord)}
                                 isSuggested={state.suggestedGridChords.filter(c => chordIdentifier(c) === chordIdentifier(savedChord)).length > 0}/>
          })}
        </div>

      </div>
    );
  }
}