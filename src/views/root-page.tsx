import React from "react";
import {State} from "../state";
import {Action} from "../react-root";
import {Header} from "./header";
import {ChordCanvas} from "./chord-canvas";
import {Footer} from "./footer";


export function RootPage(dispatch: (action: Action) => void) {

  let HeaderContent = Header(dispatch);
  let ChordCanvasContent = ChordCanvas(dispatch);
  let FooterContent = Footer(dispatch);

  return (state: State) => {
    return (
        <div className={"vw-100 vh-100 flex flex-column overflow-hidden"}>
          {HeaderContent(state)}
          {ChordCanvasContent(state)}
          {FooterContent(state)}
        </div>
    );
  }
}