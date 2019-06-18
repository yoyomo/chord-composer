import React from 'react';
import {initialState, State} from "./state";
import {RootPage} from "./views/root-page";
import {ClassAndChildren, computedFor, reducerChain, subReducersFor} from "./core/reducers";
import {recomputeAllNotes} from "./reducers/recompute-all-notes";
import {recomputeChordGrid} from "./reducers/recompute-chord-grid";
import {HeaderActions, reduceHeader} from "./reducers/header-reducer";
import {ChordCanvasActions, reduceChordCanvas} from "./reducers/chord-canvas-reducer";
import {FooterActions, reduceFooter} from "./reducers/footer-reducer";
import {ChordToolsActions, reduceChordTools} from "./reducers/chord-tools-reducer";
import {RequestAjaxEffect} from "./core/services/ajax-services";
import {getCoreServices, Service, ServicesActions} from "./core/services/services";
import {reduceInitialLoading} from "./reducers/initial-loading-reducer";
import {NavigationActions, NavigationEffect, visit} from "./core/services/navigation-services";
import {reduceNavigation} from "./reducers/router-reducer";
import {InputChange, reduceInputs} from "./reducers/input-reducers";
import {ClearInputDebouncing} from "./core/services/input-debouncing-service";
import {LogInActions, reduceLogin} from "./reducers/login-reducer";

export type Action =
    ServicesActions
    | HeaderActions
    | ChordCanvasActions
    | FooterActions
    | ChordToolsActions
    | NavigationActions
    | InputChange
    | LogInActions
    ;

export type Effect =
    RequestAjaxEffect
    | NavigationEffect
    | ClearInputDebouncing
    ;


const subReducer = subReducersFor<State>();
const computed = computedFor<State>();

export class ReactRoot extends React.Component<{}, typeof initialState> {

  services: Service[];

  constructor(props: ClassAndChildren) {
    super(props);
    this.state = {...initialState};
    this.services = getCoreServices(this.dispatch);
  }

  componentDidMount(): void {
    this.dispatch(visit({pathname: window.location.pathname}))
  }

  reduce = (state: State, action: Action) => {
    console.log("action", action);
    return reducerChain(state, action)
        .apply(reduceNavigation)
        .apply(reduceInitialLoading)
        .apply(subReducer("inputs", reduceInputs))
        .apply(reduceLogin)
        .apply(reduceHeader)
        .apply(reduceChordTools)
        .apply(reduceFooter)
        .apply(reduceChordCanvas)
        .apply(computed("notes", recomputeAllNotes))
        .apply(computed("chordGrid", recomputeChordGrid))
        .result();
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
    let reduction = this.reduce(oldState, action);
    this.setState(reduction.state);
    console.log("newState", this.state);
    this.reduceEffects(reduction.effects);
  };

  render() {
    let state: State = {...this.state};
    let RootPageContent = RootPage(this.dispatch);
    return (
        <div>
          {RootPageContent(state)}
        </div>
    )
  }
}

