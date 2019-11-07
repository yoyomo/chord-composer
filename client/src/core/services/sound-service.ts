
import { Effect, Services } from "./services";
import { Action } from "../root-reducer";
import { playSound } from "../../utils/sound-utils";

export interface PlaySoundEffect {
  effectType: "play-sound",
  noteIndex: number,
  notes: number[],
  audioContext: AudioContext,
  waveType: OscillatorType,
  soundOn: boolean
}

export const playSoundEffect = (noteIndex: number,notes: number[],audioContext: AudioContext,waveType: OscillatorType,soundOn: boolean): PlaySoundEffect => {
  return {
    effectType: "play-sound",
    noteIndex,
    notes,
    audioContext,
    waveType,
    soundOn
  }
}

export function withSound(dispatch: (action: Action) => void): Services {
  return (effect: Effect) => {
    switch (effect.effectType) {
      case "play-sound":

        playSound(effect.noteIndex, effect.notes, effect.audioContext, effect.waveType, effect.soundOn)

      break;
    }
  }
}
