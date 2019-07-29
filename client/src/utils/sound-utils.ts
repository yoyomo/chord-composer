
export const playSound = (noteIndex: number,notes: number[], audioContext: AudioContext, waveType: OscillatorType, soundOn = true) => {
  if (!soundOn) return null;
  if (noteIndex < 0 || noteIndex >= notes.length) {
    return null;
  }
  let noteValue = notes[noteIndex];

  let osc1 = audioContext.createOscillator();
  osc1.type = waveType;
  osc1.frequency.value = noteValue;

  let gain = audioContext.createGain();
  osc1.connect(gain);
  gain.connect(audioContext.destination);

  let now = audioContext.currentTime;
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
  osc1.start(now);
  osc1.stop(now + 1.5);
  return osc1;
};