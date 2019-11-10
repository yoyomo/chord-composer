import {ChordElement} from "../../components/chord";
import React from "react";
import {State} from "../../state";
import {chordIdentifier, ChordType} from "../../reducers/recompute-chord-grid";
import {Action} from "../../core/root-reducer";
import {selectChord} from "../../reducers/keyboard-reducer";
import {showStar, toggleDraftChord} from "../../reducers/footer-reducer";


export function ChordGrid(dispatch: (action: Action) => void) {

  let dispatcher = {
    toggleDraftChord: (chord: ChordType) => dispatch(toggleDraftChord(chord)),
    showStar: (chord: ChordType,show: boolean) => dispatch(showStar(chord, show)),
    selectChord: (chord: ChordType) => dispatch(selectChord(chord)),
  };

  return (state: State) => {
    return (
      <div className={"overflow-hidden h-100"}>
        <div className={"overflow-auto h-100"}>
          {state.selectedKeyIndex != null &&
          state.chordGrid.map((chord, chordIndex) => {
            if (chord.variation !== 0) return null;
            let variations = state.chordGrid.slice(chordIndex+1, chordIndex + chord.pitchClass.length);
            return <div key={"chord-" + chordIndex}>
              <ChordElement
                            chord={chord}
                            notes={state.notes}
                            audioContext={state.audioContext}
                            isSelected={!!state.selectedGridChord && chordIdentifier(state.selectedGridChord) === chordIdentifier(chord)}
                            isSuggested={state.suggestedGridChords.filter(c => chordIdentifier(c) === chordIdentifier(chord)).length > 0}
                            onSelect={() => dispatcher.selectChord(chord)}
                            waveType={state.waveType}
                            soundOn={state.soundOn}
                            onStar={()=>dispatcher.toggleDraftChord(chord)}
                            onHover={(show) => dispatcher.showStar(chord,show)}
                            showStar={state.showStarChord === chord}
              />
              {variations.map(variation => {
                return <ChordElement key={"chord-" + chordIdentifier(variation)}
                              chord={variation}
                              notes={state.notes}
                              audioContext={state.audioContext}
                              isSelected={!!state.selectedGridChord && chordIdentifier(state.selectedGridChord) === chordIdentifier(variation)}
                              isSuggested={state.suggestedGridChords.filter(c => chordIdentifier(c) === chordIdentifier(variation)).length > 0}
                              onSelect={() => dispatcher.selectChord(variation)}
                              waveType={state.waveType}
                              soundOn={state.soundOn}
                                     onStar={()=>dispatcher.toggleDraftChord(variation)}
                                     onHover={(show) => dispatcher.showStar(variation, show)}
                                     showStar={state.showStarChord === variation}
                />
              })
              }
            </div>
          })
          }
        </div>
      </div>
    );
  }
}