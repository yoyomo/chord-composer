import * as React from "react";
import {Action} from "../../../react-root";

import {State} from "../../../state";
import {inputChangeDispatcher} from "../../../reducers/input-reducers";
import {goSignUp, signIn} from "../../../reducers/login-reducer";

export function SignIn(dispatch: (action: Action) => void) {
  const dispatcher = {
    signIn: () => dispatch(signIn()),
    goSignUp: () => dispatch(goSignUp())
  };

  return (state: State) => {
    return (
      <div>
        {state.loginPage.errors.signIn && state.loginPage.errors.signIn.map(errorMessage => {
          return <div className={"red"} key={"sign-in-error_" + errorMessage}>
            {errorMessage}
          </div>
        })}
        {state.loginPage.success.signUp && <div className={"green"}> {state.loginPage.success.signUp} </div>}
        <div className={"db ma2"}>
          Email:
          <input className={"ba b--light-silver br1"} value={state.inputs.email}
                 onChange={inputChangeDispatcher(dispatch, "email")}/>
        </div>
        <div className={"db ma2"}>
          Password:
          <input className={"ba b--light-silver br1"} type="password" value={state.inputs.password}
                 onChange={inputChangeDispatcher(dispatch, "password")}/>
        </div>
        <div className={"db ma2"}>
          <div className={"dib ma2 bg-light-gray dark-gray br4 pa2 pointer"} onClick={dispatcher.goSignUp}>
            or Sign Up
          </div>
          <div className={"dib ma2 bg-light-blue white br4 pa2 pointer"} onClick={dispatcher.signIn}>
            Sign In
          </div>
        </div>
      </div>
    );
  }
}