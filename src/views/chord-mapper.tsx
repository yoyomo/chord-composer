import React from "react";
import {State} from "../state";
import {Action} from "../react-root";
import {KEYS} from "../components/note-key";


export function ChordMapper(dispatch: (action: Action) => void) {

  let dispatcher = {
  };

  let blackKeys = KEYS.filter(key => {
    return key.includes('#');
  });

  let whiteKeys = KEYS.filter(key => {
    return !key.includes('#');
  });

  return (state: State) => {
    return (
        <div className={"w-100 bg-light-gray dark-gray "}>

          <div className={"db"}>
            {blackKeys.map(blackKey => {
            return <div className={"bg-gray light-gray tc w3-5 h3 dib v-mid pointer pa3 br b--white"}>
                {blackKey}
            </div>
          })}
          </div>

          <div className={"db"}>
          {whiteKeys.map(whiteKey => {
            return <div className={"bg-white dark-gray w3 h3 dib tc v-mid pointer pa3 br b--black"}>{whiteKey}</div>
          })}
          </div>

        </div>
    );
  }
}