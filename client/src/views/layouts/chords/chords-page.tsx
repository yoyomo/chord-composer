import * as React from "react";
import {ChordTools} from "./chord-tools";
import {ChordGrid} from "./chord-grid";
import {ChordMapper} from "./chord-mapper";
import {State} from "../../../state";
import {Action} from "../../../core/root-reducer";
import {ChordKeySelector} from "./chord-key-selector";


export function ChordsPage(dispatch: (action: Action) => void) {

  let ChordToolsContent = ChordTools(dispatch);
  let ChordCanvasContent = ChordGrid(dispatch);
  let ChordKeySelectorContent = ChordKeySelector(dispatch);
  let ChordMapperContent = ChordMapper(dispatch);

  return (state: State) => {
    return (
      <div className="w-100 h-100 flex flex-column overflow-hidden">
        {ChordToolsContent(state)}
        {ChordKeySelectorContent(state)}
        {ChordCanvasContent(state)}
        {ChordMapperContent(state)}
      </div>
    );
  }
}