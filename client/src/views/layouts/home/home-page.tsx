import * as React from "react";
import {Header} from "./header";
import {Footer} from "./footer";
import {State} from "../../../state";
import {Action} from "../../../core/root-reducer";
import {ChordsPage} from "../chords/chords-page";
import {SongPage} from "../song/song-page";


export function HomePage(dispatch: (action: Action) => void) {

  let HeaderContent = Header(dispatch);
  let ChordPageContent = ChordsPage(dispatch);
  let SongPageContent = SongPage(dispatch);
  let FooterContent = Footer(dispatch);

  return (state: State) => {
    return (
        <div className="w-100 h-100 flex flex-column overflow-hidden">
          {HeaderContent(state)}
          {state.homePage.page === "chords" && ChordPageContent(state)}
          {state.homePage.page === "song" && SongPageContent(state)}
          {FooterContent(state)}
        </div>
    );
  }
}