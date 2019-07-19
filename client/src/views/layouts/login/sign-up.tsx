import * as React from "react";
import {Action} from "../../../react-root";

import {State} from "../../../state";
import {inputChangeDispatcher} from "../../../reducers/input-reducers";
import {errorOnSignUp, signUp} from "../../../reducers/login-reducer";
import {CardElement, Elements, ReactStripeElements, StripeProvider} from "react-stripe-elements";

export interface SignUpFormProps extends ReactStripeElements.InjectedStripeProps {
  onSubmit: (token_id: string) => void
  onError: (errorMessage: string) => void
  stripeAPIKey: string
}

class SignUpForm extends React.Component<SignUpFormProps> {

  constructor(props: SignUpFormProps) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  async submit() {
    if (!this.props.stripe) return;

    const {error, token} = await this.props.stripe.createToken({});
    if (!error && token) {
      this.props.onSubmit(token.id);
    } else if (error && error.message){
      console.error(error);
      this.props.onError(error.message);
    }

  }

  render() {
    return (
      <StripeProvider apiKey={this.props.stripeAPIKey}>
        <Elements>
          <div>
            <div className={"pa2 mv2 ba br3 b--moon-gray"}>
              <CardElement/>
            </div>
            <div className={"db ma2"}>
              <div className={"dib ma2 bg-light-blue white br4 pa2 pointer"} onClick={this.submit}>
                Sign Up
              </div>
            </div>
          </div>
        </Elements>
      </StripeProvider>
    )
  }
}

export function SignUp(dispatch: (action: Action) => void) {
  const dispatcher = {
    signUp: (token_id: string) => dispatch(signUp(token_id)),
    error: (errorMessage: string) => dispatch(errorOnSignUp(errorMessage)),
  };

  return (state: State) => {
    return (
      <div>
        {state.loginPage.errors.signUp && state.loginPage.errors.signUp.map(errorMessage => {
          return <div className={"red"} key={"sign-up-error_" + errorMessage}>
            {errorMessage}
          </div>
        })}
        <div className={"db ma2"}>
          Email:
          <input className={"ba b--light-silver br1"} value={state.inputs.email}
                 onChange={inputChangeDispatcher(dispatch, "email")}/>
        </div>
        <div className={"db ma2"}>
          Password:
          <input className={"ba b--light-silver br1"} type="password" value={state.inputs.password}
                 onChange={inputChangeDispatcher(dispatch, "password")}/>
        </div>
        <div className={"db ma2"}>
          Confirm Password:
          <input className={"ba b--light-silver br1"} type="password" value={state.inputs.confirmPassword}
                 onChange={inputChangeDispatcher(dispatch, "confirmPassword")}/>
        </div>
        <SignUpForm onSubmit={dispatcher.signUp} onError={dispatcher.error} stripeAPIKey={state.stripe.publishableKey}/>
      </div>
    );
  }
}