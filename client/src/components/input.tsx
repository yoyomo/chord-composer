import * as React from "react";
import {EventInput} from "../reducers/input-reducers";

export interface InputProps {
  type?: string
  value: string
  onChange: (e: EventInput) => void
}

export const Input = (props: InputProps) => {
  return <input className={"pa2 mv2 ba br3 b--moon-gray"} type={props.type} value={props.value}
                onChange={props.onChange}/>
};