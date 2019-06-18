import * as React from "react";
import {Action} from "../../../react-root";

import {State} from "../../../state";
import {inputChangeDispatcher} from "../../../reducers/input-reducers";

export function LoginPage(dispatch: (action: Action) => void) {

  return (state: State) => {
    return (
      <div className={"vw-100 vh-100 flex flex-column overflow-hidden"}>
        <div className={"ma3 pa3 ba br3 w-75 b--light-gray shadow-1"}>
          <div className={"db ma2"}>
            <input value={state.inputs.username} onChange={inputChangeDispatcher(dispatch, "username")}/>
          </div>
          <div className={"db ma2"}>
            <input value={state.inputs.password} onChange={inputChangeDispatcher(dispatch, "password")}/>
          </div>
        </div>
      </div>
    );
  }
}