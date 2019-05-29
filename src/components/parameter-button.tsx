import {ClassAndChildren} from "../core/reducers";
import React from "react";

export interface ParameterButtonProps extends ClassAndChildren {
  onClick: () => void
  disabled?: boolean
}

export const ParameterButton = (props: ParameterButtonProps) => {
  return (
      <div className={`${props.disabled ? 'bg-light-gray gray' : 'bg-gray light-gray'} br2 pointer ${props.className}`} onClick={() => {
        if (!props.disabled){
          props.onClick();
        }
      }}>
        {props.children}
      </div>
  )
};