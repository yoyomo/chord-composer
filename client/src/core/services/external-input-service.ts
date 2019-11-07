import {Effect, Services} from "./services";
import {Action} from "../root-reducer";
import {toggleChordMapperKey} from "../../reducers/chord-mapper-reducer";

export const KeyboardMapperFirstRow =
  ['q','2','w','e','4','r','5','t','y','7','u','8','i','9','o','p','-','[','=',']','\\'];
export const KeyboardMapperSecondRow = ['','','','','','','','','','','','','','','','','','','','',
  'z','s','x','d','c','f','v','b','h','n','j','m',',','l','.',';','/'];

export function withExternalInput(dispatch: (action: Action) => void): Services {

  document.body.addEventListener('keydown', e => {
    let keyIndex = KeyboardMapperFirstRow.indexOf(e.key);

    if(keyIndex === -1){
      keyIndex = KeyboardMapperSecondRow.indexOf(e.key);
    }

    if(keyIndex !== -1) {
      dispatch(toggleChordMapperKey(keyIndex));
    }
  });

  return (effect: Effect) => {

  }
}
