import { Effect, Services } from "./services";
import { Action } from "../root-reducer";
import { playSound } from "../../utils/sound-utils";
import { SynthResource } from "../../resources/synth-resource";
import { OutputSource } from "./midi-service";

export interface PlaySoundEffect {
  effectType: "play-sound",
  noteIndex: number,
  notes: number[],
  audioContext: AudioContext,
  synth: SynthResource
  outputSource: OutputSource
}

export const playSoundEffect = (noteIndex: number, notes: number[], audioContext: AudioContext, synth: SynthResource, outputSource: OutputSource): PlaySoundEffect => {
  return {
    effectType: "play-sound",
    noteIndex,
    notes,
    audioContext,
    synth,
    outputSource
  }
};

export function withSound(dispatch: (action: Action) => void): Services {
  return (effect: Effect) => {
    switch (effect.effectType) {
      case "play-sound":

        playSound(effect.noteIndex, effect.notes, effect.audioContext, effect.synth);
        if (effect.outputSource === "computer") {
          playSound(effect.noteIndex, effect.notes, effect.audioContext, effect.synth);
        }

        break;
    }
  }
}
