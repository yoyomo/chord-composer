import * as React from "react";
import { State, Toggles } from "../../state";
import {
  changeEmail,
  changeEmailRequestName,
  changePassword, changePasswordRequestName,
  generateNewAccessToken, generateNewAccessTokenRequestName
} from "../../reducers/login-reducer";
import { Action } from "../../core/root-reducer";
import { Input } from "../../components/input";
import { inputChangeDispatcher } from "../../reducers/input-reducer";
import { toggleDispatcher } from "../../reducers/toggle-reducer";
import { SVGBack } from "../../components/svgs";
import { Loading } from "../../components/loading";
import { stringifyRequestName } from "../../reducers/complete-request-reducer";

export function AccountSettings(dispatch: (action: Action) => void) {
  const dispatcher = {
    generateNewAccessToken: () => dispatch(generateNewAccessToken()),
    changeEmail: () => dispatch(changeEmail()),
    changePassword: () => dispatch(changePassword()),
    changeSubscription: () => dispatch(changeSubscription()),
  };


  return (state: State) => {

    const editingSettingsKey = function (): Extract<keyof Toggles, string> | void {
      if (state.toggles.changeEmail) {
        return "changeEmail";
      } else if (state.toggles.changeAccessToken) {
        return "changeAccessToken";
      } else if (state.toggles.changePassword) {
        return "changePassword";
      } else if (state.toggles.changeSubscription) {
        return "changeSubscription";
      } else {
        return;
      }
    }();

    const subscription = state.loggedInUser && state.stripe.object.subscriptions.retrieve(state.loggedInUser.stripe_subscription_id);

    return (
      <div className={"word-wrap"}>

        <form>
          {state.errors.changeAccountSettings && state.errors.changeAccountSettings.map(error => {
            return <div className={"red"} key={"sign-in-error_" + error.type}>
              {error.message}
            </div>
          })}
          {state.success.changeAccountSettings && <div className={"green"}> {state.success.changeAccountSettings} </div>}
          {editingSettingsKey ?
            <div>
              <div className={"pointer"} onClick={toggleDispatcher(dispatch, editingSettingsKey, false)}>
                <SVGBack />
              </div>

              {state.toggles.changeEmail &&
                <div className={"db ma2"}>
                  <div>
                    Email:
                </div>
                  <Input type="email" value={state.inputs.newEmail} onChange={inputChangeDispatcher(dispatch, "newEmail")} />
                  {state.loadingRequests[stringifyRequestName([changeEmailRequestName])] ?
                    <div className={`dib ma2 br4 pa2 bg-white ba b--light-gray gray`}>
                      Changing Email
                    <Loading className={"mh2"} />
                    </div>
                    :
                    <div className={"pointer bg-light-gray ma2 pa2 tc shadow-1 br2"}
                      onClick={dispatcher.changeEmail}>
                      Change Email
                  </div>
                  }
                </div>
              }

              {state.toggles.changePassword &&
                <div>
                  <div className={"db ma2"}>
                    <div>
                      Old Password:
                  </div>
                    <Input type="password" value={state.inputs.oldPassword}
                      onChange={inputChangeDispatcher(dispatch, "oldPassword")} />
                  </div>
                  <div className={"db ma2"}>
                    <div>
                      New Password:
                  </div>
                    <Input type="password" value={state.inputs.newPassword}
                      onChange={inputChangeDispatcher(dispatch, "newPassword")} />
                  </div>
                  <div className={"db ma2"}>
                    <div>
                      Confirm New Password:
                  </div>
                    <Input type="password" value={state.inputs.confirmNewPassword}
                      onChange={inputChangeDispatcher(dispatch, "confirmNewPassword")} />
                  </div>
                  {state.loadingRequests[stringifyRequestName([changePasswordRequestName])] ?
                    <div className={`dib ma2 br4 pa2 bg-white ba b--light-gray gray`}>
                      Changing Passwords
                    <Loading className={"mh2"} />
                    </div>
                    :
                    <div className={"pointer bg-light-gray ma2 pa2 tc shadow-1 br2"} onClick={dispatcher.changePassword}>
                      Change Password
                  </div>
                  }
                </div>

              }

              {state.toggles.changeAccessToken &&
                <div>
                  <div>
                    {state.loggedInUser ? state.loggedInUser.access_token : ""}
                  </div>
                  {state.loadingRequests[stringifyRequestName([generateNewAccessTokenRequestName])] ?
                    <div className={`dib ma2 br4 pa2 bg-white ba b--light-gray gray`}>
                      Generating Access Tokens
                    <Loading className={"mh2"} />
                    </div>
                    :
                    <div className={"pointer bg-light-gray ma2 pa2 tc shadow-1 br2"}
                      onClick={dispatcher.generateNewAccessToken}>
                      Generate New Access Token
                  </div>
                  }
                </div>
              }

            </div>
            :

            <div>
              <div className={"pointer"} onClick={toggleDispatcher(dispatch, "showSettingsModal", false)}>
                <SVGBack />
              </div>
              <div className={"pointer pa2 bt b--light-gray hover-bg-light-gray"}
                onClick={toggleDispatcher(dispatch, "changeEmail")}>
                <div>
                  Change Email
                </div>
                <div className={"gray"}>
                  {state.loggedInUser ? state.loggedInUser.email : ""}
                </div>
              </div>
              <div className={"pointer pa2 bt b--light-gray hover-bg-light-gray"}
                onClick={toggleDispatcher(dispatch, "changePassword")}>
                Change Password
              </div>
              <div className={"pointer pa2 bt b--light-gray hover-bg-light-gray"}
                onClick={toggleDispatcher(dispatch, "changeAccessToken")}>
                <div>
                  Change Access Token
                </div>
                <div className={"gray"}>
                  {state.loggedInUser ? state.loggedInUser.access_token : ""}
                </div>
              </div>
              <div className={"pointer pa2 bt b--light-gray hover-bg-light-gray"}
                onClick={toggleDispatcher(dispatch, "changeSubscription")}>
                <div>
                  Update Subscription
                </div>
                <div className={"gray"}>
                  {subscription ?
                    subscription
                    : "none"}
                </div>
              </div>
            </div>
          }

        </form>
      </div>
    );
  }
}