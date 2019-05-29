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
        <div className={"w-100 bg-light-gray dark-gray h3 flex flex-row items-stretch"}>

          <div className={"bg-black white"}>
            {blackKeys.map(blackKey => {
            return <div>{blackKey}</div>
          })}
          </div>

          <div className={"bg-near white"}>
          {whiteKeys.map(whiteKey => {
            return <div>{whiteKey}</div>
          })}
          </div>

        </div>
    );
  }
}