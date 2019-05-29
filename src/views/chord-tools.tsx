import React from "react";
import {State} from "../state";
import {Action} from "../react-root";
import {ParameterButton} from "../components/parameter-button";
import {Parameter} from "../components/parameter";
import {hideVariations, showVariations} from "../reducers/footer-reducer";
import {decreaseOctave, increaseOctave, MAXIMUM_OCTAVE, MINIMUM_OCTAVE} from "../reducers/chord-tools-reducer";

export function ChordTools(dispatch: (action: Action) => void) {

  let dispatcher = {
    decreaseOctave: () => dispatch(decreaseOctave()),
    increaseOctave: () => dispatch(increaseOctave()),
    showVariations: () => dispatch(showVariations()),
    hideVariations: () => dispatch(hideVariations()),
  };

  return (state: State) => {
    return (
      <div className={"h3 w-100 bg-light-gray flex flex-row items-stretch"}>
        <ParameterButton className={"w2 h2 pa2 ma2"} disabled={state.octave === MINIMUM_OCTAVE} onClick={dispatcher.decreaseOctave}>
          -
        </ParameterButton>
        <Parameter title={"Octave"}>
          {state.octave}
        </Parameter>
        <ParameterButton className={"w2 h2 pa2 ma2"} disabled={state.octave === MAXIMUM_OCTAVE} onClick={dispatcher.increaseOctave}>
          +
        </ParameterButton>

        <Parameter title={"Variations"} className={"dib"}>
          {Object.keys(state.selectedGridChord).length > 0 ?
            <div className={"pointer"}>
              {state.showingVariations[state.selectedGridChord.chordRuleIndex] ?
                <ParameterButton className={"ma1"} onClick={dispatcher.hideVariations}>
                  hide
                </ParameterButton>
                :
                <ParameterButton className={"ma1"} onClick={dispatcher.showVariations}>
                  show
                </ParameterButton>
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