import React from "react";
import {State} from "../../../state";
import {
  removeSavedChord,
  saveChord,
  selectSavedChord,
} from "../../../reducers/footer-reducer";
import {ParameterButton} from "../../../components/parameter-button";
import {ChordElement} from "../../../components/chord";
import {chordIdentifier} from "../../../reducers/recompute-chord-grid";
import {Action} from "../../../core/root-reducer";


export function Footer(dispatch: (action: Action) => void) {

  let dispatcher = {
    saveChord: () => dispatch(saveChord()),
    removeSavedChord: () => dispatch(removeSavedChord()),
    onSelectSavedChord: (savedChordIndex: number) => dispatch(selectSavedChord(savedChordIndex)),
  };

  return (state: State) => {
    let disabledButtons = !state.selectedGridChord;
    return (
      <div className={"w-100 bg-light-gray dark-gray h9rem overflow-hidden flex flex-row items-stretch"}>
        <div className={"dib overflow-y-hide-show"}>
          {state.savedChords.map((savedChord, s) => {
            return <ChordElement key={"saved-chord-" + s}
                                 chord={savedChord}
                                 notes={state.notes}
                                 audioContext={state.audioContext}
                                 waveType={state.waveType}
                                 soundOn={state.soundOn}
                                 onSelect={() => dispatcher.onSelectSavedChord(s)}
                                 isSelected={!!state.selectedGridChord && chordIdentifier(state.selectedGridChord) === chordIdentifier(savedChord)}/>
          })}
        </div>
        <div className={"dib fr"}>
          <ParameterButton className={"db w2 h2 pa2 ma1"} disabled={disabledButtons} onClick={dispatcher.saveChord}>
            +
          </ParameterButton>
          <ParameterButton className={"db w2 h2 pa2 ma1"} disabled={disabledButtons} onClick={dispatcher.removeSavedChord}>
            -
          </ParameterButton>
        </div>
      </div>
    );
  }
}