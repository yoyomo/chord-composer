import * as React from "react";
import {Header} from "./header";
import {ChordTools} from "./chord-tools";
import {ChordCanvas} from "./chord-canvas";
import {ChordMapper} from "./chord-mapper";
import {Footer} from "./footer";
import {State} from "../../../state";
import {Action} from "../../../core/root-reducer";


export function ChordsPage(dispatch: (action: Action) => void) {

  let HeaderContent = Header(dispatch);
  let ChordToolsContent = ChordTools(dispatch);
  let ChordCanvasContent = ChordCanvas(dispatch);
  let ChordMapperContent = ChordMapper(dispatch);
  let FooterContent = Footer(dispatch);

  return (state: State) => {
    return (
        <div>
          {HeaderContent(state)}
          {ChordToolsContent(state)}
          {ChordCanvasContent(state)}
          {ChordMapperContent(state)}
          {FooterContent(state)}
        </div>
    );
  }
}