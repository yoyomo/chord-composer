import React from "react";
import {State} from "../state";
import {ChordsPage} from "./layouts/chords/chords-page";
import {LoginPage} from "./layouts/login/login-page";
import {Action} from "../core/root-reducer";


export function RootPage(dispatch: (action: Action) => void) {

  const ChordsContent = ChordsPage(dispatch);
  const LoginContent = LoginPage(dispatch);
  return (state: State) => {
    return (
        <div className={"vw-100 vh-100 flex flex-column overflow-hidden"}>
          {state.pathParts[0] === "login" && LoginContent(state)}
          {state.pathParts[0] === "chords" && ChordsContent(state)}
        </div>
    );
  }
}