import * as React from "react";
import {Header} from "./header";
import {Footer} from "./footer";
import {State} from "../../../state";
import {Action} from "../../../core/root-reducer";
import {ChordsPage} from "../chords/chords-page";
import {SongPage} from "../song/song-page";
import {Page} from "../../../components/page";


export function HomePage(dispatch: (action: Action) => void) {

  let HeaderContent = Header(dispatch);
  let ChordPageContent = ChordsPage(dispatch);
  let SongPageContent = SongPage(dispatch);
  let FooterContent = Footer(dispatch);

  return (state: State) => {
    return (
      <Page>
        {HeaderContent(state)}
        {state.pathParts[1] === "chords" && ChordPageContent(state)}
        {state.pathParts[1] === "song" && SongPageContent(state)}
        {FooterContent(state)}
      </Page>
    );
  }
}