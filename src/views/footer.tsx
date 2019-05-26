import React from "react";
import {State} from "../state";
import {Action} from "../react-root";
import {hideVariations, saveChord, showVariations} from "../reducers/footer-reducer";
import {Parameter} from "../components/parameter";
import {ParameterButton} from "../components/parameter-button";


export function Footer(dispatch: (action: Action) => void) {

  let dispatcher = {
    showVariations: () => dispatch(showVariations()),
    hideVariations: () => dispatch(hideVariations()),
    saveChord: () => dispatch(saveChord()),
  };

  return (state: State) => {
    return (
        <div className={"w-100 bg-light-gray dark-gray h3"}>
          <Parameter title={"Variations"}>
            {state.selectedChord ?
                <div className={"pointer"}>
                  {state.showingVariations[state.selectedChord.chordRuleIndex] ?
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
          <ParameterButton onClick={dispatcher.saveChord}>
            Save Chord
          </ParameterButton>
        </div>
    );
  }
}