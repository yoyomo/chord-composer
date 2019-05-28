import React from "react";
import {State} from "../state";
import {Action} from "../react-root";
import {
  hideVariations,
  removeSavedChord,
  saveChord,
  selectSavedChord,
  showVariations
} from "../reducers/footer-reducer";
import {Parameter} from "../components/parameter";
import {ParameterButton} from "../components/parameter-button";
import {ChordElement} from "../components/chord";
import {chordIdentifier} from "../reducers/recompute-chord-grid";


export function Footer(dispatch: (action: Action) => void) {

  let dispatcher = {
    showVariations: () => dispatch(showVariations()),
    hideVariations: () => dispatch(hideVariations()),
    saveChord: () => dispatch(saveChord()),
    removeSavedChord: () => dispatch(removeSavedChord()),
    onSelectSavedChord: (savedChordIndex: number) => dispatch(selectSavedChord(savedChordIndex)),
  };

  return (state: State) => {
    return (
        <div className={"w-100 bg-light-gray dark-gray h3 flex flex-row items-stretch"}>
          <div className={"overflow-x-auto"}>
            {state.savedChords.map((savedChord, s) => {
              return <ChordElement key={"saved-chord-" + s}
                                   chord={savedChord}
                                   notes={state.notes}
                                   audioContext={state.audioContext}
                                   waveType={state.waveType}
                                   soundOn={state.soundOn}
                                   onSelect={() => dispatcher.onSelectSavedChord(s)}
                                   isSelected={chordIdentifier(state.selectedGridChord) === chordIdentifier(savedChord)}/>
            })}
          </div>
          <div className={"dib"}>
            <ParameterButton className={"db"} onClick={dispatcher.saveChord}>
              +
            </ParameterButton>
            <ParameterButton className={"db"} onClick={dispatcher.removeSavedChord}>
              -
            </ParameterButton>
          </div>
          <Parameter title={"Variations"} className={"dib"}>
            {Object.keys(state.selectedGridChord).length > 0 ?
                <div className={"pointer"}>
                  {state.showingVariations[state.selectedGridChord.chordRuleIndex] ?
                      <div onClick={dispatcher.hideVariations}>
                        hide
                      </div>
                      :
                      <div onClick={dispatcher.showVariations}>
                        show
                      </div>
                  }
                </div>
                :
                <div>(select chord)</div>
            }
          </Parameter>
        </div>
    );
  }
}