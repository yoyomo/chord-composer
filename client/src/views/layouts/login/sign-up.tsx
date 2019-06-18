import * as React from "react";
import {Action} from "../../../react-root";

import {State} from "../../../state";
import {inputChangeDispatcher} from "../../../reducers/input-reducers";
import {signUp} from "../../../reducers/login-reducer";

export function SignUp(dispatch: (action: Action) => void) {
  const dispatcher = {
    signUp: () => dispatch(signUp()),
  };

  return (state: State) => {
    return (
      <div>
        {state.errors.signUp && state.errors.signUp.map(errorMessage => {
          return <div className={"red"}>
            {errorMessage}
          </div>
        })}
        <div className={"db ma2"}>
          Email:
          <input className={"ba b--light-silver br1"} value={state.inputs.email} onChange={inputChangeDispatcher(dispatch, "email")}/>
        </div>
        <div className={"db ma2"}>
          Password:
          <input className={"ba b--light-silver br1"} type="password" value={state.inputs.password} onChange={inputChangeDispatcher(dispatch, "password")}/>
        </div>
        <div className={"db ma2"}>
          Confirm Password:
          <input className={"ba b--light-silver br1"} type="password" value={state.inputs.confirmPassword} onChange={inputChangeDispatcher(dispatch, "confirmPassword")}/>
        </div>
        <div className={"db ma2"}>
          <div className={"dib ma2 bg-light-blue white br4 pa2 pointer"} onClick={dispatcher.signUp}>
            Sign Up
          </div>
        </div>
      </div>
    );
  }
}