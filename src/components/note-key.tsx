import React from "react";
import {ClassAndChildren} from "../core/reducers";

export const KEYS = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

interface NoteKeyProps extends ClassAndChildren {
  keyIndex: number
  baseKey: string
  selectKey: (keyIndex: number) => void
}

export const NoteKey = (props: NoteKeyProps) => {
  return <div
      className={`${props.baseKey.includes('#') ? 'bg-gray light-gray' : 'bg-light-gray black'}
       w3 h3 dib tc v-mid pointer ma2 pa3 br3`}
              onClick={() => props.selectKey(props.keyIndex)}>
    {props.baseKey}
  </div>
};