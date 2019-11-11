import React from "react";
import {State} from "../../state";
import {
  toggleDraftChord,
  selectSavedChord, showStar,
} from "../../reducers/footer-reducer";
import {ChordElement} from "../../components/chord";
import {chordIdentifier, ChordType} from "../../reducers/recompute-chord-grid";
import {Action} from "../../core/root-reducer";

export function Footer(dispatch: (action: Action) => void) {

  let dispatcher = {
    onSelectSavedChord: (savedChordIndex: number) => dispatch(selectSavedChord(savedChordIndex)),
    toggleDraftChord: (chord: ChordType) => dispatch(toggleDraftChord(chord)),
    showStar: (chord: ChordType, show: boolean) => dispatch(showStar(chord, show)),
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
                                 isSuggested={state.suggestedGridChords.filter(c => chordIdentifier(c) === chordIdentifier(savedChord)).length > 0}
                                 onStar={() => dispatcher.toggleDraftChord(savedChord)}
                                 onHover={(show) => dispatcher.showStar(savedChord, show)}
                                 showStar={!!state.showStarChord && chordIdentifier(state.showStarChord) === chordIdentifier(savedChord)}
                                 isStarred={state.draftChords.filter(c => chordIdentifier(c) === chordIdentifier(savedChord)).length > 0}
            />
          })}
        </div>

      </div>
    );
  }
}