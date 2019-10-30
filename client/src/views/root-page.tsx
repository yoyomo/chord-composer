import React from "react";
import {State} from "../state";
import {HomePage} from "./home/home-page";
import {SignUpPage} from "./log-in/sign-up-page";
import {Action} from "../core/root-reducer";


export function RootPage(dispatch: (action: Action) => void) {

  const HomeContent = HomePage(dispatch);
  const SignUpContent = SignUpPage(dispatch);
  return (state: State) => {
    return (
        <div className={"h-100"}>
          {function() {
            switch(state.pathParts[0]) {
              case "sign-up":
                return SignUpContent(state);

              case "home":
                return HomeContent(state);

              default:
                return "404 Not Found";
            }
          }()}
        </div>
    );
  }
}