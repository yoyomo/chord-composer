import React from "react";
import {State} from "../state";
import {Action} from "../react-root";
import {
  changeBaseFrequency,
  selectWaveType,
  toggleSound
} from "../reducers/header-reducer";
import {ClassAndChildren} from "../core/reducers";
import {Parameter} from "../components/parameter";

export function Header(dispatch: (action: Action) => void) {

  let dispatcher = {
    changeBaseFrequency: (freq: number) => dispatch(changeBaseFrequency(freq)),
    selectWaveType: (waveType: OscillatorType) => dispatch(selectWaveType(waveType)),
    toggleSound: () => dispatch(toggleSound()),
  };

  interface WaveTypeProps extends ClassAndChildren{
    waveType: OscillatorType
    currentWaveType: OscillatorType
  }


  const WaveType = (props: WaveTypeProps) => {
    let isSelected = props.waveType === props.currentWaveType;
    return (
        <div className={`dib ma1 pointer ${isSelected ? "light-blue" : ""}`}
             onClick={() => dispatcher.selectWaveType(props.waveType)}>
          {props.children}
        </div>
    )
  };

  return (state: State) => {
    return (
        <div className={"h3 w-100 bg-light-gray flex flex-row items-stretch"}>
          <Parameter title={"Wave"}>
            <WaveType waveType={"sine"} currentWaveType={state.waveType}>
              S
            </WaveType>
            <WaveType waveType={"triangle"} currentWaveType={state.waveType}>
              >
            </WaveType>
            <WaveType waveType={"sawtooth"} currentWaveType={state.waveType}>
              M
            </WaveType>
            <WaveType waveType={"square"} currentWaveType={state.waveType}>
              コ
            </WaveType>
          </Parameter>

          <Parameter title={"Base Frequency"}>
            <input type={"number"} className={"bg-transparent border-less color-inherit tc pointer"}
                   value={state.baseFrequency}
                   onChange={(e) => dispatcher.changeBaseFrequency(parseInt(e.target.value))}/>
          </Parameter>

          <Parameter title={"Sound"}>
            <div className={`dib ma1 pointer ${state.soundOn ? "light-blue" : ""}`}
                 onClick={dispatcher.toggleSound}>
              {"<(("}
            </div>
          </Parameter>

        </div>
    );
  }
}