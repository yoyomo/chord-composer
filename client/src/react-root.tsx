import React from 'react';
import {initialState, State} from "./state";
import {RootPage} from "./views/root-page";
import {ClassAndChildren, computedFor, reducerChain} from "./core/reducers";
import {recomputeAllNotes} from "./reducers/recompute-all-notes";
import {recomputeChordGrid} from "./reducers/recompute-chord-grid";
import {HeaderActions, reduceHeader} from "./reducers/header-reducer";
import {ChordCanvasActions, reduceChordCanvas} from "./reducers/chord-canvas-reducer";
import {FooterActions, reduceFooter} from "./reducers/footer-reducer";
import {ChordToolsActions, reduceChordTools} from "./reducers/chord-tools-reducer";
import {RequestAjaxEffect} from "./core/services/ajax-services";
import {getCoreServices, Service, ServicesActions} from "./core/services/services";
import {init, InitialLoadingActions, reduceInitialLoading} from "./reducers/initial-loading-reducer";

export type Action =
  ServicesActions
  | InitialLoadingActions
  | HeaderActions
  | ChordCanvasActions
  | FooterActions
  | ChordToolsActions
  ;

export type Effect =
  RequestAjaxEffect
  ;



// const subReducer = subReducersFor<State>();
const computed = computedFor<State>();

export class ReactRoot extends React.Component<{}, typeof initialState> {

  services: Service[];

  constructor(props: ClassAndChildren) {
    super(props);
    this.state = {...initialState};
    this.services = getCoreServices(this.dispatch);
  }

  componentDidMount(): void {
    this.dispatch(init())
  }

  reduce = (state: State, action: Action) => {
    return reducerChain(state, action)
      .apply(reduceInitialLoading)
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
      return this.services.map(service => {
        return service(effect);
      })
    })
  };

  dispatch = ( action: Action) => {
    let oldState = {...this.state};
    let reduction = this.reduce(oldState, action);
    this.reduceEffects(reduction.effects);
    this.setState(reduction.state);
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

