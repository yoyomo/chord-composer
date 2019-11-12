import React from "react";
import {State} from "../../state";
import {ParameterButton} from "../../components/parameter-button";
import {
  changeBaseFrequency, changeOctave,
  MAXIMUM_OCTAVE,
  MINIMUM_OCTAVE, selectWaveType, toggleSound
} from "../../reducers/synth-tools-reducer";
import {Action} from "../../core/root-reducer";
import {
  SVGMinus,
  SVGOctave,
  SVGPlus,
  SVGSawtooth,
  SVGSine, SVGSoundOff,
  SVGSoundOn,
  SVGSquare,
  SVGTriangle
} from "../../components/svgs";
import {ClassAndChildren} from "../../core/reducers";

export function SynthTools(dispatch: (action: Action) => void) {

  let dispatcher = {
    decreaseOctave: () => dispatch(changeOctave("decrease")),
    increaseOctave: () => dispatch(changeOctave("increase")),
    changeBaseFrequency: (freq: number) => dispatch(changeBaseFrequency(freq)),
    selectWaveType: (waveType: OscillatorType) => dispatch(selectWaveType(waveType)),
    toggleSound: () => dispatch(toggleSound()),
  };

  interface WaveTypeProps extends ClassAndChildren {
    waveType: OscillatorType
    currentWaveType: OscillatorType
  }

  const WaveType = (props: WaveTypeProps) => {
    let isSelected = props.waveType === props.currentWaveType;
    return (
      <div className={`dib ma1 pointer ${isSelected ? " svg-light-blue" : ""}`}
           onClick={() => dispatcher.selectWaveType(props.waveType)}>
        {props.children}
      </div>
    )
  };

  let octaves: number[] = [];
  for (let i = MINIMUM_OCTAVE; i <= MAXIMUM_OCTAVE; i++) {
    octaves.push(i);
  }

  return (state: State) => {
    return (
      <div className={"h3 w-100 bg-light-gray flex flex-row items-stretch svg-dim-gray"}>
        <ParameterButton className={"w2 h2 pa2 ma2"} disabled={state.synth.base_octave === MINIMUM_OCTAVE}
                         onClick={dispatcher.decreaseOctave}>
          <SVGMinus/>
        </ParameterButton>
        <div className={"pv2 dark-gray"}>
          {octaves.map(octave => {
            return <SVGOctave key={`octave-${octave}`} className={`ma1 ${octave === state.synth.base_octave ? "svg-green-yellow" : "svg-gray fill-none"}`}/>
          })}
        </div>
        <ParameterButton className={"w2 h2 pa2 ma2"} disabled={state.synth.base_octave === MAXIMUM_OCTAVE}
                         onClick={dispatcher.increaseOctave}>
          <SVGPlus/>
        </ParameterButton>

        <div className={"ma2 pa2 dark-gray"}>
          <WaveType waveType={"sine"} currentWaveType={state.synth.vco_signal}>
            <SVGSine/>
          </WaveType>
          <WaveType waveType={"triangle"} currentWaveType={state.synth.vco_signal}>
            <SVGTriangle/>
          </WaveType>
          <WaveType waveType={"sawtooth"} currentWaveType={state.synth.vco_signal}>
            <SVGSawtooth/>
          </WaveType>
          <WaveType waveType={"square"} currentWaveType={state.synth.vco_signal}>
            <SVGSquare/>
          </WaveType>
        </div>

        <div className={"ma2 pa2 dark-gray"}>
          <input type={"number"} className={"bg-transparent border-less w3 color-inherit tc pointer"}
                 value={state.synth.base_frequency}
                 onChange={(e) => dispatcher.changeBaseFrequency(parseInt(e.target.value))}/>
          Hz
        </div>

        <div className={"ma2 pa2 dark-gray"}>
          <div className={`dib ma1 pointer`}
               onClick={dispatcher.toggleSound}>
            {state.synth.sound_on ? <SVGSoundOn/> : <SVGSoundOff/>}
          </div>
        </div>

      </div>
    );
  }
}