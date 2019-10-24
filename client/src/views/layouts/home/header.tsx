import React from "react";
import {State} from "../../../state";
import {
  changeBaseFrequency, goToHomePage,
  selectWaveType,
  toggleSound
} from "../../../reducers/header-reducer";
import {ClassAndChildren} from "../../../core/reducers";
import {Action} from "../../../core/root-reducer";
import {LogIn} from "../sign_up/log-in";
import {toggleDispatcher} from "../../../reducers/toggle-reducer";
import {UserInfoModal} from "./user-info";
import {PathPart} from "../../../reducers/router-reducer";
import {
  SVGChords,
  SVGSawtooth,
  SVGSine, SVGSong,
  SVGSoundOff,
  SVGSoundOn,
  SVGSquare,
  SVGTriangle,
  SVGUser
} from "../../../components/svgs";

export function Header(dispatch: (action: Action) => void) {

  let dispatcher = {
    changeBaseFrequency: (freq: number) => dispatch(changeBaseFrequency(freq)),
    selectWaveType: (waveType: OscillatorType) => dispatch(selectWaveType(waveType)),
    toggleSound: () => dispatch(toggleSound()),
    goToHomePage: (page: PathPart) => dispatch(goToHomePage(page)),
  };

  interface WaveTypeProps extends ClassAndChildren{
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

  const LogInContent = LogIn(dispatch);
  const UserInfoModalContent = UserInfoModal(dispatch);


  return (state: State) => {

    const showUserModal = state.toggles.showLogInModal || state.toggles.showSuccessfulLogInModal;

    return (
        <div className={"h3 w-100 bg-light-gray flex flex-row items-stretch  svg-dim-gray"}>
          <div className={"ma2 pa2 dark-gray"}>
            <WaveType waveType={"sine"} currentWaveType={state.waveType}>
              <SVGSine/>
            </WaveType>
            <WaveType waveType={"triangle"} currentWaveType={state.waveType}>
              <SVGTriangle/>
            </WaveType>
            <WaveType waveType={"sawtooth"} currentWaveType={state.waveType}>
              <SVGSawtooth/>
            </WaveType>
            <WaveType waveType={"square"} currentWaveType={state.waveType}>
              <SVGSquare/>
            </WaveType>
          </div>

          <div className={"ma2 pa2 dark-gray"}>
            <input type={"number"} className={"bg-transparent border-less w3 color-inherit tc pointer"}
                   value={state.baseFrequency}
                   onChange={(e) => dispatcher.changeBaseFrequency(parseInt(e.target.value))}/>
            Hz
          </div>

          <div className={"ma2 pa2 dark-gray"}>
            <div className={`dib ma1 pointer`}
                 onClick={dispatcher.toggleSound}>
              {state.soundOn ? <SVGSoundOn/> : <SVGSoundOff/>}
            </div>
          </div>

          <div className={"ma2 pa2 dark-gray"}>
            <div className={`db pointer ${showUserModal ? "svg-light-blue" : "svg-dim-gray"}`} onClick={toggleDispatcher(dispatch,"showLogInModal")}>
              <SVGUser/>
            </div>
            {showUserModal &&
            <div className={"ma3 pa3 ba br3 w5 b--light-gray shadow-1 absolute bg-white nl6"}>
              {state.loggedInUser ?
                  UserInfoModalContent(state)
                :
                  LogInContent(state)
              }
            </div>
            }
          </div>

          <div className={"ma2 pa2 dark-gray"}>
            <div className={`pointer ${state.pathParts[1] === 'chords' ? "svg-light-blue" : ""}`} onClick={() => dispatcher.goToHomePage("chords")}>
              <SVGChords/>
            </div>
          </div>

          <div className={"ma2 pa2 dark-gray"}>
            <div className={`pointer ${state.pathParts[1] === 'song' ? "svg-light-blue" : ""}`} onClick={() => dispatcher.goToHomePage("song")}>
              <SVGSong/>
            </div>
          </div>

        </div>
    );
  }
}