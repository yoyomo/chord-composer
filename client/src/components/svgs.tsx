import * as React from "react";
import {ClassAndChildren} from "../core/reducers";

export interface SVGProps extends ClassAndChildren {
  width?: number
  height?: number
}

export const SVGCheckMark = (props: SVGProps) => {

  return <svg viewBox="0 0 640 640" width={32} height={32} {...props}>
      <path d="M471.59 151.75L301.75 404.13L217.62 296.19" opacity="1" fillOpacity="0" strokeWidth="20" strokeOpacity="1"/>
  </svg>
};