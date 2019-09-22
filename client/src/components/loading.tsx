import * as React from "react";
import {ClassAndChildren} from "../core/reducers";

export function Loading(props: ClassAndChildren) {
  return <div className={"lds-ring " + props.className}>
    <div/>
    <div/>
    <div/>
    <div/>
  </div>
}