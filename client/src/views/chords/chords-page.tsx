import * as React from "react";
import {ChordTools} from "./chord-tools";
import {ChordGrid} from "./chord-grid";
import {ChordMapper} from "./chord-mapper";
import {State} from "../../state";
import {Action} from "../../core/root-reducer";
import {ChordKeySelector} from "./chord-key-selector";
import {Page} from "../../components/page";


export function ChordsPage(dispatch: (action: Action) => void) {

  let ChordToolsContent = ChordTools(dispatch);
  let ChordCanvasContent = ChordGrid(dispatch);
  let ChordKeySelectorContent = ChordKeySelector(dispatch);
  let ChordMapperContent = ChordMapper(dispatch);

  return (state: State) => {
    return (
      <Page>
        {ChordToolsContent(state)}
        {ChordKeySelectorContent(state)}
        {ChordCanvasContent(state)}
        {ChordMapperContent(state)}
      </Page>
    );
  }
}