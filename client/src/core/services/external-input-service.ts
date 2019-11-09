import { Effect, Services } from "./services";
import { Action } from "../root-reducer";
import {KeyBoardMapType, toggleKeyboardKey} from "../../reducers/keyboard-reducer";
import {KeyboardEventHandler} from "react";

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
  keyboardMap: KeyBoardMapType
}
export const acceptExternalInput = (keyboardMap: KeyBoardMapType): AcceptExternalInputEffect => {
  return {
    effectType: 'accept-external-input',
    keyboardMap
  }
};

export type ExternalInputEffects =
  | CancelExternalInputEffect
  | AcceptExternalInputEffect;

export function withExternalInput(dispatch: (action: Action) => void): Services {

  const handleKeyDown = (e: KeyboardEvent, keyboardMap: KeyBoardMapType) => {
    let keyIndex = KeyboardMapperFirstRow.indexOf(e.code);

    if (keyIndex === -1) {
      keyIndex = KeyboardMapperSecondRow.indexOf(e.code);
    }

    if (keyIndex !== -1) {
      if(keyboardMap === "keys"){
        dispatch(toggleKeyboardKey(keyIndex));
      }
    }
  };

  let eventHandler: (e: KeyboardEvent) => void;

  return (effect: Effect) => {
    switch(effect.effectType){
      case "cancel-external-input":
        document.body.removeEventListener('keydown', eventHandler);
        break;

      case "accept-external-input":
        document.body.removeEventListener('keydown', eventHandler);
        eventHandler = (e: KeyboardEvent) => handleKeyDown(e, effect.keyboardMap);
        document.body.addEventListener('keydown', eventHandler);
        break;
    }
  }
}
