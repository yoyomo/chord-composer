import * as React from "react";
import {EventInput} from "../reducers/input-reducer";
import {ClassAndChildren} from "../core/reducers";

export interface InputProps extends ClassAndChildren{
  type?: string
  value: string
  onChange: (e: EventInput) => void
  autoComplete?: string
  disabled?: boolean
}

export const Input = (props: InputProps) => {
  return <input className={"pa2 mv2 ba br3 b--moon-gray " + props.className} {...props}/>
};