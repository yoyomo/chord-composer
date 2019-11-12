import React, {SyntheticEvent} from "react";
import {ClassAndChildren} from "../core/reducers";
import {ChordType} from "../reducers/recompute-chord-grid";
import {SVGStar} from "./svgs";

interface ChordElementProps extends ClassAndChildren {
  chord: ChordType
  notes: number[]
  audioContext: AudioContext
  onSelect: () => void
  waveType: OscillatorType
  soundOn: boolean
  isSelected: boolean
  isSuggested: boolean
  onStar: () => void
  onHover: (show: boolean) => void
  showStar: boolean
  isStarred: boolean
}

export class ChordElement extends React.Component<ChordElementProps> {
  clickHandled = false;

  render() {
    let highlightColor;

    if (this.props.isSelected) {
      highlightColor = 'shadow-2-skyblue';
    } else if (this.props.isSuggested) {
      highlightColor = 'shadow-2-red';
    }

    return (
      <div
        className={`${this.props.chord.variation === 0 ? "bg-gray light-gray" : "bg-light-gray dark-gray"}
            ${highlightColor}
             w3 h3 dib tc v-mid pointer ma2 pt3 br3 relative`}
        // style={{backgroundColor: this.getColor()}}
        onMouseDown={this.onClick}
        onMouseUp={this.onClickEnd}
        onTouchStart={this.onClick}
        onMouseEnter={()=>this.props.onHover(true)}
        onMouseLeave={()=>this.props.onHover(false)}
      >
        <div className="">
          {this.props.chord.baseKey + this.props.chord.symbol}
        </div>
        {this.props.chord.variation > 0 &&
        <div>
          {this.props.chord.variation}
        </div>
        }
        {this.props.showStar &&
        <div className={`absolute top-0 left-0 ${this.props.isStarred ? 'fill-gold' : 'stroke-gold fill-none'}`} onClick={this.props.onStar}>
            <SVGStar/>
        </div>
        }
        {this.props.children}
      </div>
    );
  }

  onClickEnd = (e: SyntheticEvent<any>) => {
    this.clickHandled = false;
  };

  onClick = (e: SyntheticEvent<any>) => {
    if (this.clickHandled) {
      return;
    }

    if (e.type === "touchstart") {
      this.clickHandled = true;
    }

    this.props.onSelect();
  };

  normalize = (x: number, minX: number, maxX: number, minY: number, maxY: number) => {
    return ((x - minX) / (maxX - minX)) * (maxY - minY) + minY;
  };

  getColor = () => {
    let totalFrequency = 0;
    this.props.chord.pitchClass.map(pitch => {
      let noteFrequency = this.props.notes[pitch];
      if (totalFrequency === 0) {
        totalFrequency = noteFrequency
      } else {
        totalFrequency = 2 * Math.sin((totalFrequency + noteFrequency) / 2) * Math.cos((totalFrequency - noteFrequency) / 2);
      }
      return noteFrequency;
    });

    let normalizedFreq = this.normalize(totalFrequency, -1, 2, 0, 16777215);
    normalizedFreq = Math.floor(normalizedFreq);
    return `#${normalizedFreq.toString(16)}`;
  };

}