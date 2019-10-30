import {Action} from "../../core/root-reducer";
import {Input} from "../../components/input";
import {inputChangeDispatcher} from "../../reducers/input-reducer";
import * as React from "react";
import {State} from "../../state";
import {
  forgotPassword, resetPassword,
} from "../../reducers/login-reducer";

export function ResetPassword(dispatch: (action: Action) => void) {

  const dispatcher = {
    forgotPassword: () => dispatch(forgotPassword()),
    resetPassword: () => dispatch(resetPassword()),
  };

  return (state: State) => {

    return <div>
      {state.errors.changeAccountSettings && state.errors.changeAccountSettings.map(error => {

        return <div className={"red"} key={"sign-in-error_" + error.type}>
          {error.message}
          {error.type === 'reset_password' && (
            <div className="gray pointer f7" onClick={dispatcher.forgotPassword}>
              Resend reset password
            </div>
          )}
        </div>
      })}

      {state.alerts.signIn && (
        <div className="gray f7">
          {state.alerts.signIn}
        </div>
      )}

      {state.success.changeAccountSettings && <div className={"green"}> {state.success.changeAccountSettings} </div>}
      <div className={"db ma2"}>
        <div>
          For Email:
        </div>
        <Input type="email" disabled value={state.inputs.email} autoComplete={"email"}
               onChange={inputChangeDispatcher(dispatch, "email")} className="bg-light-gray"/>
      </div>
      <div className={"db ma2"}>
        <div>
          New Password:
        </div>
        <Input type="password" value={state.inputs.newPassword}
               onChange={inputChangeDispatcher(dispatch, "newPassword")}/>
      </div>
      <div className={"db ma2"}>
        <div>
          Confirm New Password:
        </div>
        <Input type="password" value={state.inputs.confirmNewPassword}
               onChange={inputChangeDispatcher(dispatch, "confirmNewPassword")}/>
      </div>
      <div className={"db ma2"}>
        <div className={"dib ma2 bg-light-blue white br4 pa2 pointer"} onClick={dispatcher.resetPassword}>
          Reset Password
        </div>
      </div>
    </div>;
  }
}