import * as React from "react";
import {State} from "../../../state";
import {generateNewAccessToken, signOut} from "../../../reducers/login-reducer";
import {Action} from "../../../core/root-reducer";
import {HeaderTitle} from "../../../components/header-title";
import {toggleDispatcher} from "../../../reducers/toggle-reducer";
import {Input} from "../../../components/input";
import {inputChangeDispatcher} from "../../../reducers/input-reducer";

export function UserInfoModal(dispatch: (action: Action) => void) {
  const dispatcher = {
    signOut: () => dispatch(signOut()),
    generateNewAccessToken: () => dispatch(generateNewAccessToken()),
    changeEmail: () => dispatch(changeEmail()),
    changePassword: () => dispatch(changePassword()),
    cancelSubscription: () => dispatch(cancelSubscription()),
  };

  return (state: State) => {
    return (
      <div className={"w-100 h-100"}>

        <HeaderTitle/>

        {state.toggles.showSettingsModal ?
          <form>
            {state.loginPage.errors.signIn && state.loginPage.errors.signIn.map(error => {
              return <div className={"red"} key={"sign-in-error_" + error.type}>
                {error.message}
              </div>
            })}
            {state.loginPage.success.signUp && <div className={"green"}> {state.loginPage.success.signUp} </div>}
            <div className={"db ma2"}>
              <div>
                Email:
              </div>
              <Input type="email" value={state.inputs.email} onChange={inputChangeDispatcher(dispatch, "email")}/>
            </div>
            <div className={"db ma2"}>
              <div>
                Password:
              </div>
              <Input type="password" value={state.inputs.password}
                     onChange={inputChangeDispatcher(dispatch, "password")}/>
            </div>
            <div className={"db ma2"}>
              <div>
                Confirm Password:
              </div>
              <Input type="password" value={state.inputs.confirmPassword}
                     onChange={inputChangeDispatcher(dispatch, "confirmPassword")}/>
            </div>
            <div className={"db ma2"}>
              <div className={"dib ma2 bg-light-gray dark-gray br4 pa2 pointer"} onClick={dispatcher.cancelSettings}>
                Cancel
              </div>
              <div className={"dib ma2 bg-light-blue white br4 pa2 pointer"} onClick={dispatcher.saveSettings}>
                Save
              </div>
            </div>
          </form>
          :
          <div>
            <div className={"pointer b--light-gray hover-bg-black-10 pa2"}
                 onClick={toggleDispatcher(dispatch, "showSettingsModal")}>
              Settings
            </div>
            <div className={"pointer bt b--light-gray hover-bg-black-10 pa2"} onClick={dispatcher.signOut}>
              Sign Out
            </div>
          </div>

        }
      </div>
    );
  }
}