import {SynthResource} from "../resources/synth-resource";

export const playSound = (noteIndex: number,notes: number[], audioContext: AudioContext, synth: SynthResource) => {
  if (!synth.sound_on) return null;
  if (noteIndex < 0 || noteIndex >= notes.length) {
    return null;
  }

  let noteValue = notes[noteIndex];

  let osc1 = audioContext.createOscillator();
  let biquadFilter = audioContext.createBiquadFilter();
  let gain = audioContext.createGain();

  osc1.connect(biquadFilter);
  biquadFilter.connect(gain);
  gain.connect(audioContext.destination);

  osc1.type = synth.vco_signal;
  osc1.frequency.value = noteValue;
  biquadFilter.frequency.value = synth.cut_off_frequency;

  let now = audioContext.currentTime;
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
  osc1.start(now);
  osc1.stop(now + 1.5);
  return osc1;
};