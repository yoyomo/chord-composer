import React from "react";
import {State} from "../../state";
import {ParameterButton} from "../../components/parameter-button";
import {decreaseOctave, increaseOctave, MAXIMUM_OCTAVE, MINIMUM_OCTAVE} from "../../reducers/chord-tools-reducer";
import {Action} from "../../core/root-reducer";
import {SVGMinus, SVGOctave, SVGPlus} from "../../components/svgs";

export function ChordTools(dispatch: (action: Action) => void) {

  let dispatcher = {
    decreaseOctave: () => dispatch(decreaseOctave()),
    increaseOctave: () => dispatch(increaseOctave()),
  };

  let octaves: number[] = [];
  for (let i = MINIMUM_OCTAVE; i <= MAXIMUM_OCTAVE; i++) {
    octaves.push(i);
  }

  return (state: State) => {
    return (
      <div className={"h3 w-100 bg-light-gray flex flex-row items-stretch"}>
        <ParameterButton className={"w2 h2 pa2 ma2"} disabled={state.octave === MINIMUM_OCTAVE}
                         onClick={dispatcher.decreaseOctave}>
          <SVGMinus/>
        </ParameterButton>
        <div className={"pv2 dark-gray"}>
          {octaves.map(octave => {
            return <SVGOctave key={`octave-${octave}`} className={`ma1 ${octave === state.octave ? "svg-green-yellow" : "svg-gray fill-none"}`}/>
          })}
        </div>
        <ParameterButton className={"w2 h2 pa2 ma2"} disabled={state.octave === MAXIMUM_OCTAVE}
                         onClick={dispatcher.increaseOctave}>
          <SVGPlus/>
        </ParameterButton>

      </div>
    );
  }
}