import * as React from "react";
import {State} from "../../../state";
import {Action} from "../../../core/root-reducer";
import {inputChangeDispatcher} from "../../../reducers/input-reducer";
import {
  chooseStripePlan,
  errorOnSignUp,
  signUp,
  userSignUpRequesName
} from "../../../reducers/login-reducer";
import {CardElement, Elements, injectStripe, ReactStripeElements, StripeProvider} from "react-stripe-elements";
import {Input} from "../../../components/input";
import {HeaderTitle} from "../../../components/header-title";
import {Page} from "../../../components/page";
import {stringifyRequestName} from "../../../reducers/complete-request-reducer";
import {Loading} from "../../../components/loading";


export interface SignUpFormProps extends ReactStripeElements.InjectedStripeProps {
  onSubmit: (token_id: string) => void
  onError: (errorMessage: string) => void
  errors: string[]
  isLoadingRequest: boolean
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
          {this.props.isLoadingRequest &&
            <Loading/>
          }
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
    choosePlan: (stripePlanId: string) => dispatch(chooseStripePlan(stripePlanId)),
  };

  return (state: State) => {
    return (
      <Page>
        <HeaderTitle/>

        <div className={"ma3 pa3 ba br3 w6 b--light-gray shadow-1"}>
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
          {state.stripe.object && state.stripe.publishableKey && state.stripe.plans.length > 0 && <div>
            {state.stripe.plans.map(stripePlan => {
              let symbol = "";
              let amount = stripePlan.amount;
              switch (stripePlan.currency) {
                case "usd":
                  symbol = "$";
                  amount = amount / 100;
                  break;
              }
              return <div
                onClick={() => dispatcher.choosePlan(stripePlan.id)}
                className={"db ba b--light-gray ma2 pa2 br2 tc hover-bg-light-gray pointer " + (state.stripe.chosenPlanID === stripePlan.id ? "bg-light-gray" : "")}>

                <div>
                  {symbol}{amount}
                  <div className={"di gray ma1"}>
                    {stripePlan.currency}
                  </div>
                  / {stripePlan.interval}
                </div>

                <div className={"ma2"}/>
                <div className={"f7"}>
                  Includes:
                  <div>
                    ・Access to all chords
                  </div>
                  <div>
                    ・Access to all variations of chords
                  </div>
                  <div>
                    ・Saving draft chords
                  </div>

                  <div className={"ma2"}/>
                  <div>
                    Soon:
                    <div>
                      ・Create and Save songs
                    </div>
                    <div>
                      ・Saving synthesizer parameters
                    </div>
                  </div>
                </div>

              </div>
            })
            }
              <StripeProvider apiKey={state.stripe.publishableKey}>
                  <Elements>
                      <StripeSignUpForm onSubmit={dispatcher.signUp} onError={dispatcher.error}
                                        errors={state.loginPage.errors.signUp}
                                        isLoadingRequest={state.loadingRequests[stringifyRequestName([userSignUpRequesName])]}
                      />
                  </Elements>
              </StripeProvider>
          </div>
          }
        </div>
      </Page>
    );
  }
}