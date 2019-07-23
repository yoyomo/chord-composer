import React from "react";
import {State} from "../state";
import {ChordsPage} from "./layouts/chords/chords-page";
import {SignUpPage} from "./layouts/sign_up/sign-up-page";
import {Action} from "../core/root-reducer";


export function RootPage(dispatch: (action: Action) => void) {

  const ChordsContent = ChordsPage(dispatch);
  const SignUpContent = SignUpPage(dispatch);
  return (state: State) => {
    return (
        <div className={"vw-100 vh-100 flex flex-column overflow-hidden"}>
          {state.pathParts[0] === "sign-up" && SignUpContent(state)}
          {state.pathParts[0] === "chords" && ChordsContent(state)}
        </div>
    );
  }
}