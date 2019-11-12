import * as React from "react";
import {SynthTools} from "./synth-tools";
import {ChordGrid} from "./chord-grid";
import {Keyboard} from "./keyboard";
import {State} from "../../state";
import {Action} from "../../core/root-reducer";
import {ChordKeySelector} from "./chord-key-selector";
import {Page} from "../../components/page";


export function ChordsPage(dispatch: (action: Action) => void) {

  let ChordToolsContent = SynthTools(dispatch);
  let ChordCanvasContent = ChordGrid(dispatch);
  let ChordKeySelectorContent = ChordKeySelector(dispatch);
  let KeyboardContent = Keyboard(dispatch);

  return (state: State) => {
    return (
      <Page>
        {ChordToolsContent(state)}
        {ChordKeySelectorContent(state)}
        {ChordCanvasContent(state)}
        {KeyboardContent(state)}
      </Page>
    );
  }
}