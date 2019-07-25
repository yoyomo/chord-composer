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
        <div className={"h-100"}>
          {function() {
            switch(state.pathParts[0]) {
              case "sign-up":
                return SignUpContent(state);

              case "chords":
                return ChordsContent(state);

              default:
                return "404 Not Found";
            }
          }()}
        </div>
    );
  }
}