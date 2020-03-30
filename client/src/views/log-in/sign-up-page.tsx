import * as React from "react";
import {State} from "../../state";
import {Action} from "../../core/root-reducer";
import {inputChangeDispatcher} from "../../reducers/input-reducer";
import {
  chooseStripePlan,
  errorOnSignUp, ResponseError,
  signUp,
  userSignUpRequestName
} from "../../reducers/login-reducer";
import {Input} from "../../components/input";
import {HeaderTitle} from "../../components/header-title";
import {Page} from "../../components/page";
import {stringifyRequestName} from "../../reducers/complete-request-reducer";
import {SVGCheckMark} from "../../components/svgs";
import {StripePlans} from "../../components/stripe-plans";
import {StripeForm} from "../../components/stripe-form";
import {changeKeyboardMap, KeyBoardMapType} from '../../reducers/keyboard-reducer';


export function SignUpPage(dispatch: (action: Action) => void) {
  const dispatcher = {
    signUp: (token_id: string) => dispatch(signUp(token_id)),
    error: (error: ResponseError) => dispatch(errorOnSignUp(error)),
    choosePlan: (stripePlanId: string) => dispatch(chooseStripePlan(stripePlanId)),
    changeKeyBoardMap: (keyboardMap: KeyBoardMapType) => dispatch(changeKeyboardMap(keyboardMap)),
  };

  const StripePlansContent = StripePlans(dispatch);

  return (state: State) => {
    return (
      <Page>
        <HeaderTitle/>

        <div className={"ma3 pa3 ba br3 w6 b--light-gray shadow-1"}>
          <div className={"db ma2"}>
            <div>
              Email:
            </div>
            <Input type="email" value={state.inputs.email} onChange={inputChangeDispatcher(dispatch, "email")}
              onFocus={() => dispatcher.changeKeyBoardMap("none")}
              onBlur={()=> dispatcher.changeKeyBoardMap(state.keyboardMapPriorToInput)}
            />
          </div>
          <div className={"db ma2"}>
            <div>
              Password:
            </div>
            <Input type="password" value={state.inputs.password}
            onFocus={() => dispatcher.changeKeyBoardMap("none")}
            onBlur={()=> dispatcher.changeKeyBoardMap(state.keyboardMapPriorToInput)}
                   onChange={inputChangeDispatcher(dispatch, "password")}/>
          </div>
          <div className={"db ma2"}>
            <div>
              Confirm Password:
            </div>
            <Input type="password" value={state.inputs.confirmPassword}
            onFocus={() => dispatcher.changeKeyBoardMap("none")}
            onBlur={()=> dispatcher.changeKeyBoardMap(state.keyboardMapPriorToInput)}
                   onChange={inputChangeDispatcher(dispatch, "confirmPassword")}/>
            {state.inputs.password && state.inputs.password === state.inputs.confirmPassword &&
            <SVGCheckMark className={"svg-green"}/>
            }
          </div>
          {state.stripe.object && state.stripe.publishableKey && <div>
            {StripePlansContent(state)}
              <StripeForm apiKey={state.stripe.publishableKey}
                          submitMessage="Sign Up" loadingMessage="Signing Up"
                          onSubmit={dispatcher.signUp} onError={dispatcher.error}
                          errors={state.errors.signUp}
                          isLoadingRequest={state.loadingRequests[stringifyRequestName([userSignUpRequestName])]}
              />
          </div>
          }
        </div>
      </Page>
    );
  }
}
