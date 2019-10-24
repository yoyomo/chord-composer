import * as React from "react";
import {State} from "../../../state";
import {Action} from "../../../core/root-reducer";
import {inputChangeDispatcher} from "../../../reducers/input-reducer";
import {
  chooseStripePlan,
  errorOnSignUp, ResponseError,
  signUp,
  userSignUpRequestName
} from "../../../reducers/login-reducer";
import {CardElement, Elements, injectStripe, ReactStripeElements, StripeProvider} from "react-stripe-elements";
import {Input} from "../../../components/input";
import {HeaderTitle} from "../../../components/header-title";
import {Page} from "../../../components/page";
import {stringifyRequestName} from "../../../reducers/complete-request-reducer";
import {Loading} from "../../../components/loading";
import {SVGCheckMark} from "../../../components/svgs";
import {StripePlans} from "./stripe-plans";


export interface SignUpFormProps extends ReactStripeElements.InjectedStripeProps {
  onSubmit: (token_id: string) => void
  onError: (error: ResponseError) => void
  errors: ResponseError[]
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
      this.props.onError({type: "stripe_card", message: error.message});
    }

  }


  render() {
    return (
      <div>
        <div className={"pa2 mv2 ba br3 b--moon-gray"}>
          <CardElement/>
        </div>
        {this.props.errors.map(errorMessage => {
          return <div className={"red"} key={"sign-up-error_" + errorMessage.type}>
            {errorMessage.message}
          </div>
        })}
        <div className={"db ma2"}>
          {this.props.isLoadingRequest ?
            <div className={`dib ma2 br4 pa2 bg-white ba b--light-gray gray`}>
              Signing Up
              <Loading className={"mh2"}/>
            </div>
            :
            <div className={`dib ma2 br4 pa2 pointer bg-blue white`}
                 onClick={this.submit}>
              Sign Up
            </div>
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
    error: (error: ResponseError) => dispatch(errorOnSignUp(error)),
    choosePlan: (stripePlanId: string) => dispatch(chooseStripePlan(stripePlanId)),
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
            {state.inputs.password && state.inputs.password === state.inputs.confirmPassword &&
            <SVGCheckMark className={"svg-green"}/>
            }
          </div>
          {state.stripe.object && state.stripe.publishableKey && <div>
            {StripePlansContent(state)}
              <StripeProvider apiKey={state.stripe.publishableKey}>
                  <Elements>
                      <StripeSignUpForm onSubmit={dispatcher.signUp} onError={dispatcher.error}
                                        errors={state.errors.signUp}
                                        isLoadingRequest={state.loadingRequests[stringifyRequestName([userSignUpRequestName])]}
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