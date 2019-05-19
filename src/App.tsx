import React, {SyntheticEvent} from 'react';
import {initialState, State} from "./state";

export interface ClassAndChildren {
  className?: string,
  children?: React.ReactNode
}

interface ChordElementProps extends ClassAndChildren {
  chord: ChordType
  notes: number[]
  audioContext: AudioContext
  selectChordType: () => void
}

class ChordElement extends React.Component<ChordElementProps> {
  touchHandled = false;

  render() {
    return (
        <div
            className={`${this.props.chord.variation === 0 ? "bg-light-red" : "bg-light-blue"} w3 h3 white dib tc v-mid pointer ma2 br3`}
            onMouseDown={this.handleClick}
            onTouchStart={this.handleClick}>
          <div className="">
            {this.props.chord.baseKey + this.props.chord.symbol}
          </div>
          <div>
            {this.props.chord.variation}
          </div>
        </div>
    );
  }

  handleClick = (e: SyntheticEvent<any>) => {
    e.preventDefault();

    if (e.type === "touchstart") {
      this.touchHandled = true;
    } else if (e.type === "mousedown" && this.touchHandled) {
      return;
    }

    this.playChord();
    this.props.selectChordType();
  };

  playChord = () => {

    this.props.chord.pitchClass.map(noteIndex => {
      if (noteIndex < 0 || noteIndex >= this.props.notes.length) {
        return null;
      }
      let noteValue = this.props.notes[noteIndex];

      let osc1 = this.props.audioContext.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.value = noteValue;

      let gain = this.props.audioContext.createGain();
      osc1.connect(gain);
      gain.connect(this.props.audioContext.destination);

      let now = this.props.audioContext.currentTime;
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc1.start(now);
      osc1.stop(now + 0.5);
      return osc1;
    });
  }
}

export interface ChordType extends ChordRuleType {
  baseKey: string,
  variation: number,
}

export interface ChordRuleType {
  name: string,
  symbol: string,
  pitchClass: number[],
  quality: string,
}

export const KEYS = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

interface NoteKeyProps extends ClassAndChildren {
  keyIndex: number
  baseKey: string
  selectKey: (keyIndex: number) => void
}

const NoteKey = (props: NoteKeyProps) => {
  return <div className={"bg-light-red w3 h3 white dib tc v-mid pointer ma2 br3"}
              onClick={() => props.selectKey(props.keyIndex)}>
    {props.baseKey}
  </div>
};

interface BottomButtonProps extends ClassAndChildren {
  text: string
  onClick: () => void
}

const BottomButton = (props: BottomButtonProps) => {
  return <div className={"absolute w-100 white bg-light-blue bottom-0 pointer h3"}
              onClick={props.onClick}>
    {props.text}
  </div>
};


export class ReactRoot extends React.Component<{}, typeof initialState> {

  constructor(props: ClassAndChildren) {
    super(props);
    this.state = {...initialState};
  }

  removeVariations = () => {
    let baseChord = this.state.chordGrid[this.state.selectedChordTypeIndex];

    let chordGrid = this.state.chordGrid.slice();

    chordGrid = chordGrid.slice(0,this.state.selectedChordTypeIndex+1).
        concat(chordGrid.slice(this.state.selectedChordTypeIndex + baseChord.pitchClass.length));

    this.setState({
      chordGrid: chordGrid,
      showingVariations: false
    });

  };

  recomputeVariations = () => {
    let baseChord = this.state.chordGrid[this.state.selectedChordTypeIndex];

    let pitchClass = baseChord.pitchClass.slice();
    let chordGrid = this.state.chordGrid.slice();

    for (let v = 1; v < pitchClass.length; v++) {
      let firstPitch = pitchClass.shift();

      if (firstPitch) {
        while (firstPitch < pitchClass[pitchClass.length - 1]) {
          firstPitch += 12;
        }
        pitchClass.push(firstPitch);
      }

      let chordVariation: ChordType = {
        ...baseChord,
        pitchClass: pitchClass.slice(),
        variation: v,
      };

      chordGrid.splice(this.state.selectedChordTypeIndex + v, 0, chordVariation);
    }

    this.setState({
      chordGrid: chordGrid,
      showingVariations: true
    });

  };

  selectChordType = (chordGridIndex: number) => {
    let selectedChord = this.state.chordGrid[chordGridIndex];

    while (selectedChord.variation > 0){
      selectedChord = this.state.chordGrid[--chordGridIndex];
    }

    let nextChord = this.state.chordGrid[chordGridIndex + 1];

    this.setState({
      selectedChordTypeIndex: chordGridIndex,
      showingVariations: nextChord && nextChord.variation > 0
    });
  };

  recomputeChords = (keyIndex: number) => {
    let chordGrid: ChordType[] = [];
    this.state.chordRules.map(chordRule => {
      let pitchClass = chordRule.pitchClass.slice();

      // add key and octave
      for (let p = 0; p < pitchClass.length; p++) {
        pitchClass[p] += this.state.selectedKeyIndex + this.state.octave * 12;
      }

      // make sure pitchClass is incrementing array
      for (let p = 0; p < pitchClass.length; p++) {
        while (p > 0 && pitchClass[p] < pitchClass[p - 1]) {
          pitchClass[p] += 12;
        }
      }

      let chord: ChordType = {
        ...chordRule,
        pitchClass: pitchClass.slice(),
        variation: 0,
        baseKey: KEYS[keyIndex]
      };

      chordGrid.push(chord);
    });

    this.setState({
      chordGrid: chordGrid,
      selectedKeyIndex: keyIndex
    })
  };

  selectKey = (keyIndex: number) => {
    this.recomputeChords(keyIndex);
  };

  showVariations = () => {
    this.recomputeVariations();
  };

  hideVariations = () => {
    this.removeVariations();
  };

  render() {
    return (
        <div>
          {this.state.selectedKeyIndex == null ?
              KEYS.map((key, i) => {
                return <NoteKey baseKey={key} keyIndex={i} selectKey={this.selectKey}/>
              })
              :
              this.state.chordGrid.map((chord, i) => {
                return <ChordElement chord={chord}
                                     notes={this.state.notes}
                                     audioContext={this.state.audioContext}
                                     selectChordType={() => this.selectChordType(i)}
                />
              })
          }


          {this.state.selectedChordTypeIndex !== null ?
              this.state.showingVariations ?
                  <BottomButton text={"Hide Variations"} onClick={this.hideVariations}/>
                  :
                  <BottomButton text={"Show Variations"} onClick={this.showVariations}/>

              :
              null
          }

        </div>
    );
  }
}

