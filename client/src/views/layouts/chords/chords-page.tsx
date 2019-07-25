import * as React from "react";
import {Header} from "./header";
import {ChordTools} from "./chord-tools";
import {ChordCanvas} from "./chord-canvas";
import {ChordMapper} from "./chord-mapper";
import {Footer} from "./footer";
import {State} from "../../../state";
import {Action} from "../../../core/root-reducer";
import {ChordKeySelector} from "./chord-key-selector";


export function ChordsPage(dispatch: (action: Action) => void) {

  let HeaderContent = Header(dispatch);
  let ChordToolsContent = ChordTools(dispatch);
  let ChordCanvasContent = ChordCanvas(dispatch);
  let ChordKeySelectorContent = ChordKeySelector(dispatch);
  let ChordMapperContent = ChordMapper(dispatch);
  let FooterContent = Footer(dispatch);

  return (state: State) => {
    return (
        <div className="w-100 h-100 flex flex-column overflow-hidden">
          {HeaderContent(state)}
          {ChordToolsContent(state)}
          {ChordKeySelectorContent(state)}
          {ChordCanvasContent(state)}
          {ChordMapperContent(state)}
          {FooterContent(state)}
        </div>
    );
  }
}