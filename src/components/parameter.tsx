import {ClassAndChildren} from "../core/reducers";
import React from "react";

export interface ParameterProps extends ClassAndChildren {
  title: string
}

export const Parameter = (props: ParameterProps) => {
  return <div className={"ma2 pa2 dark-gray tc"}>
    <div className={"db"}>{props.title}</div>
    <div className={"db"}>{props.children}</div>
  </div>
};