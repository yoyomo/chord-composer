import {SynthResource} from "../resources/synth-resource";

export const playSound = (noteIndex: number,notes: number[], audioContext: AudioContext, synth: SynthResource) => {
  if (!synth.sound_on) return null;
  if (noteIndex < 0 || noteIndex >= notes.length) {
    return null;
  }

  let noteFrequency = notes[noteIndex];

  let osc1 = audioContext.createOscillator();
  let biquadFilter = audioContext.createBiquadFilter();
  let gain = audioContext.createGain();

  osc1.connect(biquadFilter);
  biquadFilter.connect(gain);
  gain.connect(audioContext.destination);

  osc1.type = synth.vco_signal;
  osc1.frequency.value = noteFrequency;
  biquadFilter.type = "lowpass";
  biquadFilter.frequency.value = synth.cut_off_frequency;

  const now = audioContext.currentTime;
  const endTime = now + parseFloat(synth.release + "");
  const attackTime = now + parseFloat(synth.attack + "");
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.2, attackTime);
  gain.gain.exponentialRampToValueAtTime(0.000001, endTime);
  osc1.start(now);
  osc1.stop(endTime);
  return osc1;
};