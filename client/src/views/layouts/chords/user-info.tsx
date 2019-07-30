import * as React from "react";
import {State} from "../../../state";
import {signOut} from "../../../reducers/login-reducer";
import {Action} from "../../../core/root-reducer";

export function UserInfoModal(dispatch: (action: Action) => void) {
  const dispatcher = {
    signOut: () => dispatch(signOut()),
  };

  return (state: State) => {
    return (
      <div className={"w-100 h-100"}>
        <div className={"pointer bt b--light-gray hover-bg-black-10 pa2"} onClick={dispatcher.signOut}>
          Sign Out
        </div>
      </div>
    );
  }
}