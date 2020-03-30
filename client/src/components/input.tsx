import * as React from "react";
import {EventInput} from "../reducers/input-reducer";
import {ClassAndChildren} from "../core/reducers";

export interface InputProps extends ClassAndChildren{
  type?: string
  value: string
  onChange: (e: EventInput) => void
  autoComplete?: string
  disabled?: boolean
  onFocus: (e) => void
  onBlur: (e) => void
}

export const Input = (props: InputProps) => {
  return <input {...props} className={`pa2 mv2 ba br3 b--moon-gray ${props.className}`}/>
};
