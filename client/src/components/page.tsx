import * as React from "react";
import {ClassAndChildren} from "../core/reducers";

export function Page(props: ClassAndChildren) {
  return <div className="w-100 h-100 flex flex-column overflow-hidden">
    {props.children}
  </div>
}