import * as React from "react";
import {State} from "../../../state";
import {Action} from "../../../core/root-reducer";

export function SongPage(dispatch: (action: Action) => void) {


  return (state: State) => {
    return (
      <div className="w-100 h-100 flex flex-column overflow-hidden">
        create song
      </div>
    );
  }
}