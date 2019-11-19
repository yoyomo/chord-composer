
import { Effect, Services } from "./services";
import { Action } from "../root-reducer";
import { playSound } from "../../utils/sound-utils";
import {SynthResource} from "../../resources/synth-resource";

export interface PlaySoundEffect {
  effectType: "play-sound",
  noteIndex: number,
  notes: number[],
  audioContext: AudioContext,
  synth: SynthResource
}

export const playSoundEffect = (noteIndex: number,notes: number[], audioContext: AudioContext, synth: SynthResource): PlaySoundEffect => {
  return {
    effectType: "play-sound",
    noteIndex,
    notes,
    audioContext,
    synth
  }
};

export function withSound(dispatch: (action: Action) => void): Services {
  return (effect: Effect) => {
    switch (effect.effectType) {
      case "play-sound":

        playSound(effect.noteIndex, effect.notes, effect.audioContext, effect.synth);

      break;
    }
  }
}
