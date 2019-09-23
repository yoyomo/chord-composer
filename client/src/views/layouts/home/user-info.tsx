import * as React from "react";
import {State} from "../../../state";
import {generateNewAccessToken, signOut} from "../../../reducers/login-reducer";
import {Action} from "../../../core/root-reducer";
import {HeaderTitle} from "../../../components/header-title";
import {toggleDispatcher} from "../../../reducers/toggle-reducer";
import {AccountSettings} from "./account-settings";

export function UserInfoModal(dispatch: (action: Action) => void) {
  const dispatcher = {
    signOut: () => dispatch(signOut()),
  };

  const AccountSettingsContent = AccountSettings(dispatch);

  return (state: State) => {
    return (
      <div className={"w-100 h-100"}>

        <HeaderTitle/>
        {state.toggles.showSuccessfulLogInModal ?
          <div className={"green"}>
            Successful Login!
          </div>
          :
          state.toggles.showSettingsModal ?
            AccountSettingsContent(state)
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