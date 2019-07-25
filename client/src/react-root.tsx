import React from 'react';
import {initialState, State} from "./state";
import {RootPage} from "./views/root-page";
import {ClassAndChildren} from "./core/reducers";
import {Effect, getCoreServices, Service} from "./core/services/service";
import {visit} from "./core/services/navigation-service";
import {Action, rootReducer} from "./core/root-reducer";

export class ReactRoot extends React.Component<{}, typeof initialState> {

  services: Service[];

  constructor(props: ClassAndChildren) {
    super(props);
    this.state = {...initialState};
    this.services = getCoreServices(this.dispatch);
  }

  componentDidMount(): void {
    this.dispatch(visit(window.location))
  }

  reduceActions = (state: State, action: Action) => {
    console.log("action", action);
    return rootReducer(state, action);
  };

  reduceEffects = (effects: Effect[]) => {
    effects.map(effect => {
      console.log("effect", effect);
      return this.services.map(service => {
        return service(effect);
      })
    })
  };

  dispatch = (action: Action) => {
    let oldState = {...this.state};
    let reduction = this.reduceActions(oldState, action);
    this.setState(reduction.state, () => {
      console.log("newState", this.state);
      this.reduceEffects(reduction.effects);
    });
  };

  render() {
    let state: State = {...this.state};
    let RootPageContent = RootPage(this.dispatch);
    return RootPageContent(state);
  }
}

