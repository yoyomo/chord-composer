import * as React from "react";
import {State} from "../../../state";
import {inputChangeDispatcher} from "../../../reducers/input-reducer";
import {goSignUp, signIn} from "../../../reducers/login-reducer";
import {Action} from "../../../core/root-reducer";
import {Input} from "../../../components/input";

export function LogIn(dispatch: (action: Action) => void) {
  const dispatcher = {
    signIn: () => dispatch(signIn()),
    goSignUp: () => dispatch(goSignUp())
  };

  return (state: State) => {
    return (
      <form>
        {state.loginPage.errors.signIn && state.loginPage.errors.signIn.map(errorMessage => {
          return <div className={"red"} key={"sign-in-error_" + errorMessage}>
            {errorMessage}
          </div>
        })}
        {state.loginPage.success.signUp && <div className={"green"}> {state.loginPage.success.signUp} </div>}
        <div className={"db ma2"}>
          Email:
          <Input type="email" value={state.inputs.email} autoComplete={"email"}
                 onChange={inputChangeDispatcher(dispatch, "email")}/>
        </div>
        <div className={"db ma2"}>
          Password:
          <Input type="password" value={state.inputs.password} autoComplete={"current-password"}
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
      </form>
    );
  }
}