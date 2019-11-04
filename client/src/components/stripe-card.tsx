import {CardElement, Elements, injectStripe, ReactStripeElements, StripeProvider} from "react-stripe-elements";
import {ResponseError} from "../reducers/login-reducer";
import * as React from "react";
import {Loading} from "./loading";

interface FormProps extends ReactStripeElements.InjectedStripeProps {
  apiKey: string
  onSubmit: (token_id: string) => void
  onError: (error: ResponseError) => void
  errors: ResponseError[]
  isLoadingRequest: boolean
  loadingMessage: string
  submitMessage: string
}

class Form extends React.Component<FormProps> {

  constructor(props: FormProps) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  async submit() {
    if (!this.props.stripe) return;

    const { error, token } = await this.props.stripe.createToken({});
    if (!error && token) {
      this.props.onSubmit(token.id);
    } else if (error && error.message) {
      console.error(error);
      this.props.onError({ type: "stripe_card", message: error.message });
    }

  }


  render() {
    return (
      <div>
        <div className={"pa2 mv2 ba br3 b--moon-gray"}>
          <CardElement />
        </div>
        {this.props.errors.map(errorMessage => {
          return <div className={"red"} key={"sign-up-error_" + errorMessage.type}>
            {errorMessage.message}
          </div>
        })}
        <div className={"db ma2"}>
          {this.props.isLoadingRequest ?
            <div className={`dib ma2 br4 pa2 bg-white ba b--light-gray gray`}>
              {this.props.loadingMessage}
              <Loading className={"mh2"} />
            </div>
            :
            <div className={`dib ma2 br4 pa2 pointer bg-green white`}
                 onClick={this.submit}>
              {this.props.submitMessage}
            </div>
          }
        </div>
      </div>
    )
  }
}

const FormContent = injectStripe(Form);

export function StripeForm(props: FormProps) {
  return <StripeProvider apiKey={props.apiKey}>
    <Elements>
      <FormContent {...props}/>
    </Elements>
  </StripeProvider>
}