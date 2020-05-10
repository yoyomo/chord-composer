import React from "react";
import {ClassAndChildren} from "../core/reducers";

interface NoteKeyProps extends ClassAndChildren {
  keyIndex: number
  baseKey: string
  selectKey: (keyIndex: number) => void
  isSuggested: boolean
  isSelected: boolean
}

export const NoteKey = (props: NoteKeyProps) => {
  return <div
      className={`${props.baseKey.includes('#') ? 'bg-gray light-gray' : 'bg-light-gray black'}
      ${props.isSuggested ? "shadow-2-red" : ""}
       w3 h3 dib tc v-mid pointer ma2 pa3 br3 no-select`}
              onClick={() => props.selectKey(props.keyIndex)}>
    {props.baseKey}
  </div>
};