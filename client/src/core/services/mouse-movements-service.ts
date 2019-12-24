import { Effect, Services } from "./services";
import { Action } from "../root-reducer";
import {SynthResource} from "../../resources/synth-resource";
import {changeSynthAttribute} from "../../reducers/synth-tools-reducer";

export type FollowKnobMovementsEffect = {
  effectType: 'follow-knob-movements'
  knobKey: keyof SynthResource
}
export const followKnobMovementsEffect = (knobKey: keyof SynthResource): FollowKnobMovementsEffect => {
  return {
    effectType: 'follow-knob-movements',
    knobKey
  }
};


export type MouseEffects =
  | FollowKnobMovementsEffect;

export function withMouseMovements(dispatch: (action: Action) => void): Services {

  let mouseMoveEventListener: (e: MouseEvent) => void;
  let mouseUpEventListener: () => void;

  const removeEvents = () => {
    document.body.removeEventListener('mousemove', mouseMoveEventListener);
    document.body.removeEventListener('mouseup', mouseUpEventListener);
  };

  const addEvents = () => {
    document.body.addEventListener('mousemove', mouseMoveEventListener);
    document.body.addEventListener('mouseup', mouseUpEventListener);
  };

  const handleMouseMovement = (e: MouseEvent, knobKey: keyof SynthResource) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
     dispatch(changeSynthAttribute(knobKey, e.movementY))
  };

  const handleMouseUp = () => {
    removeEvents();
  };


  return (effect: Effect) => {
    switch(effect.effectType){
      case "follow-knob-movements":
        removeEvents();
        mouseMoveEventListener = (e: MouseEvent) => handleMouseMovement(e, effect.knobKey);
        mouseUpEventListener = handleMouseUp;
        addEvents();
        break;
    }
  }
}
