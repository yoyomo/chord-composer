import { Effect, Services } from "./services";
import { Action } from "../root-reducer";
import { toggleChordMapperKey } from "../../reducers/chord-mapper-reducer";

export const USKeyboardMapperFirstRow =
  ['q', '2', 'w', 'e', '4', 'r', '5', 't', 'y', '7', 'u', '8', 'i', '9', 'o', 'p', '-', '[', '=', ']', '\\'];
export const USKeyboardMapperSecondRow = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
  'z', 's', 'x', 'd', 'c', 'f', 'v', 'b', 'h', 'n', 'j', 'm', ',', 'l', '.', ';', '/'];

const KeyboardMapperFirstRow =
  ['KeyQ', 'Digit2', 'KeyW', 'KeyE', 'Digit4', 'KeyR', 'Digit5', 'KeyT', 'KeyY', 'Digit7', 'KeyU', 'Digit8', 'KeyI', 'Digit9', 'KeyO', 'KeyP', 'Minus', 'BracketLeft', 'Equal', 'BracketRight', 'Backslash'];
const KeyboardMapperSecondRow = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
  'KeyZ', 'KeyS', 'KeyX', 'KeyD', 'KeyC', 'KeyF', 'KeyV', 'KeyB', 'KeyH', 'KeyN', 'KeyJ', 'KeyM', 'Comma', 'KeyL', 'Period', 'Semicolon', 'Slash'];

export function withExternalInput(dispatch: (action: Action) => void): Services {

  document.body.addEventListener('keydown', e => {
    e.preventDefault();
    let keyIndex = KeyboardMapperFirstRow.indexOf(e.code);

    if (keyIndex === -1) {
      keyIndex = KeyboardMapperSecondRow.indexOf(e.code);
    }

    if (keyIndex !== -1) {
      dispatch(toggleChordMapperKey(keyIndex));
    }
  });

  return (effect: Effect) => {

  }
}
