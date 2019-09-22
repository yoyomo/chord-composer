import * as React from "react";
import {State} from "../../../state";
import {inputChangeDispatcher} from "../../../reducers/input-reducer";
import {
  goSignUp,
  resendConfirmationEmail,
  resendConfirmationEmailRequestName,
  signIn
} from "../../../reducers/login-reducer";
import {Action} from "../../../core/root-reducer";
import {Input} from "../../../components/input";
import {stringifyRequestName} from "../../../reducers/complete-request-reducer";
import {Loading} from "../../../components/loading";

export function LogIn(dispatch: (action: Action) => void) {
  const dispatcher = {
    signIn: () => dispatch(signIn()),
    goSignUp: () => dispatch(goSignUp()),
    resendConfirmationEmail: () => dispatch(resendConfirmationEmail())
  };

  return (state: State) => {
    let isResendingConfirmationEmail = state.loadingRequests[stringifyRequestName([resendConfirmationEmailRequestName])];
    return (
      <form>
        {state.loginPage.errors.signIn && state.loginPage.errors.signIn.map(error => {

          return <div className={"red"} key={"sign-in-error_" + error.type}>
            {error.message}
            {error.type === "confirmation" ?
              <div>
                {isResendingConfirmationEmail ?
                  <div className={`dib ma2 br4 pa2 bg-white gray`}>
                    Resending
                    <Loading className={"mh2"}/>
                  </div>
                  :
                  <div onClick={dispatcher.resendConfirmationEmail} className={"pointer blue"}>
                    Resend confirmation email
                  </div>
                }
              </div>
              : null
            }
          </div>
        })}
        {state.loginPage.success.signUp && <div className={"green"}> {state.loginPage.success.signUp} </div>}
        <div className={"db ma2"}>
          <div>
            Email:
          </div>
          <Input type="email" value={state.inputs.email} autoComplete={"email"}
                 onChange={inputChangeDispatcher(dispatch, "email")}/>
        </div>
        <div className={"db ma2"}>
          <div>
            Password:
          </div>
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