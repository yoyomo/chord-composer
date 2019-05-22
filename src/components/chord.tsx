import React, {SyntheticEvent} from "react";
import {ClassAndChildren} from "../react-root";

interface ChordElementProps extends ClassAndChildren {
  chord: ChordType
  notes: number[]
  audioContext: AudioContext
  selectChordType: () => void
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

export class ChordElement extends React.Component<ChordElementProps> {
  touchHandled = false;

  render() {
    return (
        <div
            className={`${this.props.chord.variation === 0 ? "bg-light-red" : "bg-light-blue"} w3 h3 white dib tc v-mid pointer ma2 br3`}
            onMouseDown={this.handleClick}
            onTouchStart={this.handleClick}
            onTouchEnd={this.handleClickEnd}
            onTouchMoveCapture={this.noClick}
            onWheelCapture={this.noClick}
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


  noClick = (e: SyntheticEvent<any>) => {
    e.preventDefault();
    this.touchHandled = true;
  };

  handleClickEnd = (e: SyntheticEvent<any>) => {
    e.preventDefault();
    this.touchHandled = false;
  };

  handleClick = (e: SyntheticEvent<any>) => {
    e.preventDefault();

    if (this.touchHandled) {
      return
    }

    if (e.type === "touchstart") {
      this.touchHandled = true;
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