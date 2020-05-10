import { Effect, Services } from "./services";
import { Action } from "../root-reducer";
import { KeyBoardMapType, toggleKeyboardKey, KeyBoardPressType } from "../../reducers/keyboard-reducer";
import { selectSavedChord } from "../../reducers/footer-reducer";

export const USKeyboardMapperFirstRow =
  ['q', '2', 'w', 'e', '4', 'r', '5', 't', 'y', '7', 'u', '8', 'i', '9', 'o', 'p', '-', '[', '=', ']', '\\'];
export const USKeyboardMapperSecondRow = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
  'z', 's', 'x', 'd', 'c', 'f', 'v', 'b', 'h', 'n', 'j', 'm', ',', 'l', '.', ';', '/'];

const KeyboardMapperFirstRow =
  ['KeyQ', 'Digit2', 'KeyW', 'KeyE', 'Digit4', 'KeyR', 'Digit5', 'KeyT', 'KeyY', 'Digit7', 'KeyU', 'Digit8', 'KeyI', 'Digit9', 'KeyO', 'KeyP', 'Minus', 'BracketLeft', 'Equal', 'BracketRight', 'Backslash'];
const KeyboardMapperSecondRow = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
  'KeyZ', 'KeyS', 'KeyX', 'KeyD', 'KeyC', 'KeyF', 'KeyV', 'KeyB', 'KeyH', 'KeyN', 'KeyJ', 'KeyM', 'Comma', 'KeyL', 'Period', 'Semicolon', 'Slash'];

export type CancelExternalInputEffect = {
  effectType: 'cancel-external-input'
}
export const cancelExternalInput = (): CancelExternalInputEffect => {
  return {
    effectType: 'cancel-external-input'
  }
};

export type AcceptExternalInputEffect = {
  effectType: 'accept-external-input'
  keyboardMap: KeyBoardMapType,
  keyboardPresser: KeyBoardPressType
}
export const acceptExternalInput = (keyboardMap: KeyBoardMapType, keyboardPresser: KeyBoardPressType): AcceptExternalInputEffect => {
  return {
    effectType: 'accept-external-input',
    keyboardMap,
    keyboardPresser
  }
};

export type ExternalInputEffects =
  | CancelExternalInputEffect
  | AcceptExternalInputEffect;

export function withExternalInput(dispatch: (action: Action) => void): Services {

  let pressedKeyCodes: { [k: string]: boolean } = {};

  let keydownEventListener: (e: KeyboardEvent) => void;
  let keyupEventListener: (e: KeyboardEvent) => void;

  const getKeyIndex = (e: KeyboardEvent) => {
    let keyIndex = KeyboardMapperFirstRow.indexOf(e.code);

    if (keyIndex === -1) {
      keyIndex = KeyboardMapperSecondRow.indexOf(e.code);
    }

    return keyIndex;
  }

  const isKeyIndexValid = (keyIndex: number, e: KeyboardEvent) => {
    return keyIndex !== -1 && !e.metaKey
  }

  const handleKeyDown = (e: KeyboardEvent, keyboardMap: KeyBoardMapType) => {

    if (pressedKeyCodes[e.code]) return;

    pressedKeyCodes[e.code] = true;

    const keyIndex = getKeyIndex(e);

    if (isKeyIndexValid(keyIndex,e)) {
      if (keyboardMap === "keys") {
        dispatch(toggleKeyboardKey(keyIndex));
      }
      else if (keyboardMap === "chords") {
        dispatch(selectSavedChord(keyIndex))
      }
    }
  };

  const handleKeyUp = (e: KeyboardEvent, keyboardMap: KeyBoardMapType, keyboardPresser: KeyBoardPressType) => {
    pressedKeyCodes[e.code] = false;

    const keyIndex = getKeyIndex(e);

    if (isKeyIndexValid(keyIndex,e)) {
      if (keyboardPresser === 'live') {
        dispatch(toggleKeyboardKey(keyIndex, false))
      }
    }
  };


  return (effect: Effect) => {
    switch (effect.effectType) {
      case "cancel-external-input":
        document.body.removeEventListener('keydown', keydownEventListener);
        document.body.removeEventListener('keyup', keyupEventListener);
        break;

      case "accept-external-input":
        document.body.removeEventListener('keydown', keydownEventListener);
        document.body.removeEventListener('keyup', keyupEventListener);
        keydownEventListener = (e: KeyboardEvent) => handleKeyDown(e, effect.keyboardMap);
        keyupEventListener = (e: KeyboardEvent) => handleKeyUp(e, effect.keyboardMap, effect.keyboardPresser);
        document.body.addEventListener('keydown', keydownEventListener);
        document.body.addEventListener('keyup', keyupEventListener);
        break;
    }
  }
}
