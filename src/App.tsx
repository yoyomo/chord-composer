import React from 'react';
import {CHORDS} from "./constants/chords";

export interface ClassAndChildren {
  className?: string,
  children?: React.ReactNode
}

interface ChordElementProps extends ClassAndChildren {
  chord: ChordType
}

class ChordElement extends React.Component<ChordElementProps & ClassAndChildren> {


  render() {
    return (
        <div className={"bg-light-red w-100px h-100px white dib tc v-mid pointer ma2 br3"}
             onClick={this.playChord}>
          <div className="">
            {this.props.chord.baseKey + this.props.chord.symbol}
            {this.props.chord.variation}
          </div>
        </div>
    );
  }

  constructor(props: ChordElementProps) {
    super(props);
    audioContext = new AudioContext();
  }

  playChord = () => {

    this.props.chord.pitchClass.map(noteIndex => {
      if (noteIndex < 0 || noteIndex >= notes.length) {
        return null;
      }
      let noteValue = notes[noteIndex];

      let osc1 = audioContext.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = noteValue;

      let gain = audioContext.createGain();
      osc1.connect(gain);
      gain.connect(audioContext.destination);

      let now = audioContext.currentTime;
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc1.start(now);
      osc1.stop(now + 0.5);
      return osc1;
    });
  }
}

export interface ChordType extends ChordRuleVariationType {
  baseKey: string,
}

export interface ChordRuleVariationType extends ChordRuleType {
  variation: number,
}

export interface ChordRuleType {
  name: string,
  symbol: string,
  pitchClass: number[],
  quality: string,
}

export const NUMBER_OF_NOTES = 88;

const recalculateAllNotes = (baseFrequency = 440): number[] => {
  let notes = [];

  for (let n = 0; n < NUMBER_OF_NOTES; n++) {
    notes[n] = Math.pow(2, ((n + 1) - 49) / 12) * baseFrequency;
  }

  return notes;
};

//state
let audioContext: AudioContext;
let notes = recalculateAllNotes();
const chords: ChordType[] = CHORDS;

const App: React.FC = () => {

  return (
      <div className={""}>
        {chords.map((chord, c) => {
          return <ChordElement chord={chord} key={"chord-" + c}/>
        })}
      </div>
  );
};

export default App;
