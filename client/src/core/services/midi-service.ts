import {Effect, Services} from "./services";
import {Action} from "../root-reducer";
import {ChordMapperKeys, KeyBoardMapType, toggleKeyboardKey} from "../../reducers/keyboard-reducer";
import {selectSavedChord} from "../../reducers/footer-reducer";

const MIDI_NOTE_DELTA = 21;

export function withMidiInput(dispatch: (action: Action) => void): Services {
  let midi: WebMidi.MIDIAccess | null = null;
  let midiInputs: WebMidi.MIDIInput[] = [];
  let midiOutputs: WebMidi.MIDIOutput[] = [];

  const onMIDISuccess = (keyboardMap: KeyBoardMapType) => (m: WebMidi.MIDIAccess) => {
    midi = m;
    midiInputs = [];
    midiOutputs = [];

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
    if (e.data[2] != 0) {
      let keyIndex = (e.data[1] - MIDI_NOTE_DELTA) % (ChordMapperKeys.length - 1);

      if (keyboardMap === "keys") {
        dispatch(toggleKeyboardKey(keyIndex));
      } else if (keyboardMap === "chords") {
        dispatch(selectSavedChord(keyIndex))
      }
    }
  };

  return (effect: Effect) => {
    switch (effect.effectType) {
      case "cancel-external-input":
        midi = null;
        midiInputs = [];
        midiOutputs = [];
        break;

      case "accept-external-input":
        navigator.requestMIDIAccess().then(onMIDISuccess(effect.keyboardMap), onMIDIFailure);
        break;

      case "play-sound":
        if (midiOutputs.length > 0) {
          const note = effect.noteIndex + MIDI_NOTE_DELTA;

          const on = 0x90;
          const off = 0x80;
          const velocity = 0x7f;

          midiOutputs[0].send([on, note, velocity]);

          const now = effect.audioContext.currentTime;
          const endTime = now + parseFloat(effect.synth.release + "");

          setTimeout(() => midiOutputs[0].send([off, note, velocity]), endTime)
        }
        break;
    }
  }
}
