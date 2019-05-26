import {ClassAndChildren} from "../core/reducers";
import React from "react";

export interface ParameterButtonProps extends ClassAndChildren {
  onClick: () => void
}

export const ParameterButton = (props: ParameterButtonProps) => {
  return (
      <div className={"w2 h2 bg-gray ma2 pa2 light-gray br2 pointer"} onClick={props.onClick}>
        {props.children}
      </div>
  )
};