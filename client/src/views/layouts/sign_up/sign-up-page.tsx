import * as React from "react";
import {State} from "../../../state";
import {Action} from "../../../core/root-reducer";
import {inputChangeDispatcher} from "../../../reducers/input-reducer";
import {errorOnSignUp, signUp} from "../../../reducers/login-reducer";
import {CardElement, Elements, injectStripe, ReactStripeElements, StripeProvider} from "react-stripe-elements";
import {Input} from "../../../components/input";


export interface SignUpFormProps extends ReactStripeElements.InjectedStripeProps {
  onSubmit: (token_id: string) => void
  onError: (errorMessage: string) => void
  errors: string[]
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
    } else if (error && error.message) {
      console.error(error);
      this.props.onError(error.message);
    }

  }

  render() {
    return (
      <div>
        <div className={"pa2 mv2 ba br3 b--moon-gray"}>
          <CardElement/>
        </div>
        {this.props.errors.map(errorMessage => {
          return <div className={"red"} key={"sign-up-error_" + errorMessage}>
            {errorMessage}
          </div>
        })}
        <div className={"db ma2"}>
          <div className={"dib ma2 bg-light-blue white br4 pa2 pointer"} onClick={this.submit}>
            Sign Up
          </div>
        </div>
      </div>
    )
  }
}

export const StripeSignUpForm = injectStripe(SignUpForm);

export function SignUpPage(dispatch: (action: Action) => void) {
  const dispatcher = {
    signUp: (token_id: string) => dispatch(signUp(token_id)),
    error: (errorMessage: string) => dispatch(errorOnSignUp(errorMessage)),
  };

  return (state: State) => {
    return (
      <div className={"w-100 h-100 flex flex-column overflow-hidden"}>
        <div className="w-100 bg-light-gray tc">
          <div className="ma2 pa2 f4 gray b">
            K O R D P O S E
          </div>
        </div>

        <div className={"ma3 pa3 ba br3 w5 b--light-gray shadow-1"}>
          <div className={"db ma2"}>
            Email:
            <Input type="email" value={state.inputs.email} onChange={inputChangeDispatcher(dispatch, "email")}/>
          </div>
          <div className={"db ma2"}>
            Password:
            <Input type="password" value={state.inputs.password}
                   onChange={inputChangeDispatcher(dispatch, "password")}/>
          </div>
          <div className={"db ma2"}>
            Confirm Password:
            <Input type="password" value={state.inputs.confirmPassword}
                   onChange={inputChangeDispatcher(dispatch, "confirmPassword")}/>
          </div>
          {state.stripe.object && <StripeProvider apiKey={state.stripe.publishableKey}>
            <Elements>
              <StripeSignUpForm onSubmit={dispatcher.signUp} onError={dispatcher.error}
                                errors={state.loginPage.errors.signUp}/>
            </Elements>
          </StripeProvider>
          }
        </div>
      </div>
    );
  }
}