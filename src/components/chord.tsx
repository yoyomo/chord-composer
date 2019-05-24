import React, {SyntheticEvent} from "react";
import {ClassAndChildren} from "../core/reducers";

interface ChordElementProps extends ClassAndChildren {
  chord: ChordType
  notes: number[]
  audioContext: AudioContext
  selectChordRule: () => void
  waveType: OscillatorType
}

export interface ChordType extends ChordRuleType {
  baseKey: string,
  variation: number,
  chordRuleIndex: number,
}

export interface ChordRuleType {
  name: string,
  symbol: string,
  pitchClass: number[],
  quality: string,
}

export class ChordElement extends React.Component<ChordElementProps> {
  clickHandled = false;

  render() {
    return (
      <div
        className={`${this.props.chord.variation === 0 ? "bg-gray light-gray" : "bg-light-gray dark-gray"}
             w3 h3 white dib tc v-mid pointer ma2 pt3 br3`}
        onMouseDown={this.handleClick}
        onMouseUp={this.handleClickEnd}
        onTouchStart={this.handleClick}
      >
        <div className="">
          {this.props.chord.baseKey + this.props.chord.symbol}
        </div>
        {this.props.chord.variation > 0 &&
        <div>
          {this.props.chord.variation}
        </div>
        }
      </div>
    );
  }

  handleClickEnd = (e: SyntheticEvent<any>) => {
    this.clickHandled = false;
  };

  handleClick = (e: SyntheticEvent<any>) => {
    if (this.clickHandled) {
      return;
    }

    if(e.type === "touchstart") {
      this.clickHandled = true;
    }

    this.playChord();
    this.props.selectChordRule();
  };

  playChord = () => {

    this.props.chord.pitchClass.map(noteIndex => {
      if (noteIndex < 0 || noteIndex >= this.props.notes.length) {
        return null;
      }
      let noteValue = this.props.notes[noteIndex];

      let osc1 = this.props.audioContext.createOscillator();
      osc1.type = this.props.waveType;
      osc1.frequency.value = noteValue;

      let gain = this.props.audioContext.createGain();
      osc1.connect(gain);
      gain.connect(this.props.audioContext.destination);

      let now = this.props.audioContext.currentTime;
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      osc1.start(now);
      osc1.stop(now + 1.5);
      return osc1;
    });
  }
}