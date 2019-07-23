import React from "react";
import {State} from "../../../state";
import {
  changeBaseFrequency,
  selectWaveType,
  toggleSound
} from "../../../reducers/header-reducer";
import {ClassAndChildren} from "../../../core/reducers";
import {Parameter} from "../../../components/parameter";
import {Action} from "../../../core/root-reducer";
import {LogIn} from "../sign_up/log-in";
import {toggleDispatcher} from "../../../reducers/toggle-reducer";

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

  let LogInContent = LogIn(dispatch);

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

          <div className={"ma2 pa2 dark-gray tc"}>
            <div className={"db pointer"} onClick={toggleDispatcher(dispatch,"showLogInModal")}>
              (8)
            </div>
            {state.toggles.showLogInModal &&
            <div>
              {state.loggedInUser ?
                null
                :
                <div className={"ma3 pa3 ba br3 w5 b--light-gray shadow-1 absolute bg-white"}>
                  {LogInContent(state)}
                </div>
              }
            </div>
            }
          </div>

        </div>
    );
  }
}