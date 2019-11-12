import React from "react";
import {State} from "../../state";
import {
  goToHomePage,
} from "../../reducers/header-reducer";
import {Action} from "../../core/root-reducer";
import {LogIn} from "../log-in/log-in";
import {toggleDispatcher} from "../../reducers/toggle-reducer";
import {UserInfoModal} from "./user-info";
import {PathPart} from "../../reducers/router-reducer";
import {
  SVGChords,
  SVGSong,
  SVGUser
} from "../../components/svgs";
import {HeaderTitle} from "../../components/header-title";

export function Header(dispatch: (action: Action) => void) {

  let dispatcher = {
    goToHomePage: (page: PathPart) => dispatch(goToHomePage(page)),
  };

  const LogInContent = LogIn(dispatch);
  const UserInfoModalContent = UserInfoModal(dispatch);


  return (state: State) => {

    const showUserModal = state.toggles.showLogInModal || state.toggles.showTemporaryUserModal;

    return (
      <div className={"h3 w-100 bg-light-gray flex flex-row items-stretch  svg-dim-gray"}>

        <HeaderTitle/>

        <div className={"ma2 pa2 dark-gray"}>
          <div className={`db pointer ${showUserModal ? "svg-light-blue" : "svg-dim-gray"}`}
               onClick={toggleDispatcher(dispatch, "showLogInModal")}>
            <SVGUser/>
          </div>
          {showUserModal &&
          <div className={"ma3 pa3 ba br3 w5 b--light-gray shadow-1 absolute bg-white nl6"}>
            {state.toggles.showTemporaryUserModal && <div>
              {state.errors.server.length > 0 &&
              state.errors.server.map(error => {
                return <div key={"server-error-" + error.message}
                            className="red">
                  {error.message}
                </div>

              })}
              {state.success.signIn &&
              <div className={"green"}>
                {state.success.signIn}
              </div>
              }

            </div>
            }

            {state.toggles.showLogInModal && <div>
              {state.loggedInUser ?
                UserInfoModalContent(state)
                :
                LogInContent(state)
              }
            </div>
            }
          </div>
          }
        </div>

        <div className={"ma2 pa2 dark-gray"}>
          <div className={`pointer ${state.pathParts[1] === 'chords' ? "svg-light-blue" : ""}`}
               onClick={() => dispatcher.goToHomePage("chords")}>
            <SVGChords/>
          </div>
        </div>

        <div className={"ma2 pa2 dark-gray"}>
          <div className={`pointer ${state.pathParts[1] === 'song' ? "svg-light-blue" : ""}`}
               onClick={() => dispatcher.goToHomePage("song")}>
            <SVGSong/>
          </div>
        </div>

      </div>
    );
  }
}