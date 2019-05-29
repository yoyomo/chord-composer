import React from "react";
import {State} from "../state";
import {Action} from "../react-root";
import {KEYS} from "../components/note-key";


export function ChordMapper(dispatch: (action: Action) => void) {

  let dispatcher = {
  };

  let displayKeys = KEYS.slice(3).concat(KEYS).concat(KEYS.slice(0,3));

  let blackKeys = displayKeys.filter(key => {
    return key.includes('#');
  });

  let whiteKeys = displayKeys.filter(key => {
    return !key.includes('#');
  });

  return (state: State) => {
    return (
        <div className={"w-100 bg-light-gray dark-gray h5 overflow-x-hide-show overflow-y-hidden gpu"}>

          <div className={"db nowrap"}>
            {blackKeys.map((blackKey,i) => {
            return <div key={"black-key-"+i}
              className={`bg-gray light-gray tc ${blackKey === "G#" ? 'w3' : 'w3-5'} h3 dib v-mid pointer pa3 br b--white`}>
                {blackKey}
            </div>
          })}
          </div>

          <div className={"db nowrap"}>
          {whiteKeys.map((whiteKey,i)=> {
            return <div key={"white-key-"+i}
              className={"bg-white dark-gray w3 h3 dib tc v-mid pointer pa3 br b--black"}>
              {whiteKey}
            </div>
          })}
          </div>

        </div>
    );
  }
}