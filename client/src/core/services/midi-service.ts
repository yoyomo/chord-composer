import {Effect, Services} from "./services";
import {Action} from "../root-reducer";
import {ChordMapperKeys, KeyBoardMapType, toggleKeyboardKey} from "../../reducers/keyboard-reducer";
import {selectSavedChord} from "../../reducers/footer-reducer";

export const MIDI_NOTE_DELTA = 21;

export type OutputSource = "computer" | "midi";

export type StopMidiNoteAction = {
  type: "stop-midi-note"
  midiNote: number;
}
export const stopMidiNoteAction = (midiNote: number): StopMidiNoteAction => {
  return {
    type: "stop-midi-note",
    midiNote,
  }
};

export const parseMidiNote = (midiNote: number) => {
  const pianoNote = midiNote - MIDI_NOTE_DELTA;
  const keyIndex = pianoNote % (ChordMapperKeys.length - 1);

  return {pianoNote, keyIndex}
};

export type MidiActions = StopMidiNoteAction;

export type StopMidiNoteEffect = {
  effectType: "stop-midi-note"
  midiNote: number
}

export const stopMidiNoteEffect = (midiNote: number): StopMidiNoteEffect => {
  return {
    effectType: "stop-midi-note",
    midiNote
  }
};

export type MidiEffects = StopMidiNoteEffect;


export function withMidiInput(dispatch: (action: Action) => void): Services {
  let midi: WebMidi.MIDIAccess | null = null;
  let midiInputs: WebMidi.MIDIInput[] = [];
  let midiOutputs: WebMidi.MIDIOutput[] = [];

  const on = 0x90;
  const off = 0x80;
  const velocity = 0x7f;

  const clearMidiEvents = () => {
    midiInputs.map(input => {
      return input.onmidimessage = () => null;
    });
    midi = null;
    midiInputs = [];
    midiOutputs = [];
  };

  const onMIDISuccess = (keyboardMap: KeyBoardMapType) => (m: WebMidi.MIDIAccess) => {
    clearMidiEvents();

    midi = m;

    let it = midi.inputs.values();
    for (let i = it.next(); !i.done; i = it.next()) {
      midiInputs.push(i.value);
    }

    let ot = midi.outputs.values();
    for (let o = ot.next(); !o.done; o = ot.next()) {
      midiOutputs.push(o.value);
    }

    for (let i = 0; i < midiInputs.length; i++) {
      midiInputs[i].onmidimessage = onMIDIEvent(keyboardMap);
    }
  };

  function onMIDIFailure(msg: string) {
    console.log("onMIDIFailure()呼ばれただと？:" + msg);
  }

  const onMIDIEvent = (keyboardMap: KeyBoardMapType) => (e: WebMidi.MIDIMessageEvent) => {
    const command = e.data[0];
    const midiNote = e.data[1];
    const vel = e.data[2];

    if (vel !== 0 && command === on) {
      const {keyIndex} = parseMidiNote(midiNote);
      if (keyboardMap === "keys") {
        dispatch(toggleKeyboardKey(keyIndex));
      } else if (keyboardMap === "chords") {
        dispatch(selectSavedChord(keyIndex));
        dispatch(stopMidiNoteAction(midiNote));
      }
    }
  };

  return (effect: Effect) => {
    switch (effect.effectType) {
      case "cancel-external-input":
        clearMidiEvents();
        break;

      case "accept-external-input":
        if(navigator.requestMIDIAccess){
          navigator.requestMIDIAccess().then(onMIDISuccess(effect.keyboardMap), onMIDIFailure);
        } else {
          console.error('No Midi Access is supported on this device');
        }
        break;

      case "play-sound":
        if (effect.outputSource === "midi") {
          if (midiOutputs.length > 0) {
            const note = effect.noteIndex + MIDI_NOTE_DELTA;

            midiOutputs[0].send([on, note, velocity]);

            const now = effect.audioContext.currentTime;
            const endTime = now + parseFloat(effect.synth.release + "");

            setTimeout(() => midiOutputs[0].send([off, note, velocity]), endTime)
          }
        }
        break;

      case "stop-midi-note":
        midiOutputs[0].send([off, effect.midiNote, velocity]);
        break;
    }
  }
}
