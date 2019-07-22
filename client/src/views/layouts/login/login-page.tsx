import * as React from "react";
import {State} from "../../../state";
import {SignIn} from "./sign-in";
import {SignUp} from "./sign-up";
import {Action} from "../../../core/root-reducer";

export function LoginPage(dispatch: (action: Action) => void) {

  let SignInContent = SignIn(dispatch);
  let SignUpContent = SignUp(dispatch);

  return (state: State) => {
    return (
      <div className={"ma3 pa3 ba br3 w5 b--light-gray shadow-1"}>
        {!state.pathParts[1] && SignInContent(state)}
        {state.pathParts[1] === "sign_up" && SignUpContent(state)}
      </div>
    );
  }
}