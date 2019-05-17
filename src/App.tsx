import React from 'react';
import './css/tachyons.css';

export interface ClassAndChildren {
  className?: string, children?: React.ReactNode
}

interface ChordElementProps extends ClassAndChildren {
  chord: ChordType
}

class ChordElement extends React.Component<ChordElementProps & ClassAndChildren>{

  render() {
    return <div className={"bg-light-red w-100px h-100px white dib tc v-mid pointer ma2 br3"}
                onClick={this.playChord}
    >
      <div className="fixed ">
      {this.props.chord.name}
      </div>
    </div>
    ;
  }

  playChord = () => {
    this.props.chord.noteValues.map(noteValue => {
      let audioContext= new AudioContext();

      let osc1 = audioContext.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = noteValue;

      var gain = audioContext.createGain();
      osc1.connect(gain);
      gain.connect(audioContext.destination);

      var now = audioContext.currentTime;
      gain.gain.setValueAtTime(1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc1.start(now);
      osc1.stop(now + 0.5);
    });
}
}

interface ChordType {
  name: string,
  noteValues: number[],
}

const App: React.FC = () => {

  let chords: ChordType[] = [
    {name: "A", noteValues:[440,554.37,659.25]},
    {name: "Bm7", noteValues:[493.88]},
    {name: "C#maj7", noteValues:[554.37]},
    ];

  return (
    <div className={"flex flex-row"}>
      {chords.map(chord => {
        return <ChordElement chord={chord}/>
      })}
    </div>
  );
};

export default App;
