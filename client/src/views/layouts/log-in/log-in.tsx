import * as React from "react";
import {State} from "../../../state";
import {Action} from "../../../core/root-reducer";
import {SignIn} from "./sign-in";
import {ResetPassword} from "./reset-password";

export function LogIn(dispatch: (action: Action) => void) {

  const SignInContent = SignIn(dispatch);
  const ResetPasswordContent = ResetPassword(dispatch);

  return (state: State) => {
    return (
      <form>
        {state.toggles.isResettingPassword ?
          ResetPasswordContent(state)
          :
          SignInContent(state)
        }
      </form>
    );
  }
}