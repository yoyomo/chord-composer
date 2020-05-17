import { ChordElement } from "../../components/chord";
import React from "react";
import { State } from "../../state";
import { chordIdentifier, ChordType } from "../../reducers/recompute-chord-grid";
import { Action } from "../../core/root-reducer";
import { selectChordAction } from "../../reducers/keyboard-reducer";
import { toggleDraftChord } from "../../reducers/footer-reducer";


export function ChordGrid(dispatch: (action: Action) => void) {

  let dispatcher = {
    toggleDraftChord: (chord: ChordType) => dispatch(toggleDraftChord(chord)),
    selectChord: (chord: ChordType) => dispatch(selectChordAction(chord)),
  };

  return (state: State) => {
    return (
      <div className={"overflow-hidden h-100"}>
        <div className={"overflow-auto h-100"}>
          <div className={`absolute left-25 top-25 z-1 flex flex-row o-70 ${state.suggestedGridChords.length > 0 ? 'fadein' : 'fadeout'}`}>
            {state.suggestedGridChords.map(suggestedChord => (
              suggestedChord.octave === state.synth.base_octave &&
              <ChordElement
                key={"chord-variation-" + chordIdentifier(suggestedChord)}
                isFlashing
                chord={suggestedChord}
                notes={state.notes}
                audioContext={state.audioContext}
                isSelected={!!state.selectedGridChord && chordIdentifier(state.selectedGridChord) === chordIdentifier(suggestedChord)}
                isSuggested={state.suggestedGridChords.filter(c => chordIdentifier(c) === chordIdentifier(suggestedChord)).length > 0}
                onSelect={() => dispatcher.selectChord(suggestedChord)}
                onStar={() => dispatcher.toggleDraftChord(suggestedChord)}
                showStar={!!state.toggles.showStars}
                isStarred={state.draftChords.filter(c => chordIdentifier(c) === chordIdentifier(suggestedChord)).length > 0}
              />
            ))}
          </div>

          {state.selectedKeyIndex != null &&
            state.chordGrid.map((chord, chordIndex) => {
              if (chord.variation !== 0) return null;
              let variations = state.chordGrid.slice(chordIndex, chordIndex + chord.pitchClass.length);
              return (
                <div key={"chord-" + chordIndex}>
                  {variations.map(variation => (
                    <ChordElement
                      key={"chord-variation-" + chordIdentifier(variation)}
                      chord={variation}
                      notes={state.notes}
                      audioContext={state.audioContext}
                      isSelected={!!state.selectedGridChord && chordIdentifier(state.selectedGridChord) === chordIdentifier(variation)}
                      isSuggested={state.suggestedGridChords.filter(c => chordIdentifier(c) === chordIdentifier(variation)).length > 0}
                      onSelect={() => dispatcher.selectChord(variation)}
                      onStar={() => dispatcher.toggleDraftChord(variation)}
                      showStar={!!state.toggles.showStars}
                      isStarred={state.draftChords.filter(c => chordIdentifier(c) === chordIdentifier(variation)).length > 0}
                    />
                  ))}
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
}