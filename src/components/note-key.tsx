import React from "react";
import {ClassAndChildren} from "../react-root";

export const KEYS = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

interface NoteKeyProps extends ClassAndChildren {
  keyIndex: number
  baseKey: string
  selectKey: (keyIndex: number) => void
}

export const NoteKey = (props: NoteKeyProps) => {
  return <div className={"bg-light-red w3 h3 white dib tc v-mid pointer ma2 br3"}
              onClick={() => props.selectKey(props.keyIndex)}>
    {props.baseKey}
  </div>
};