import React from 'react';
import {initialState, State} from "./state";
import {RootPage} from "./views/root-page";
import {ClassAndChildren, computedFor, IgnoredAction, reducerChain} from "./core/reducers";
import {recomputeAllNotes} from "./reducers/recompute-all-notes";
import {recomputeChordGrid} from "./reducers/recompute-chord-grid";
import {HeaderActions, reduceHeader} from "./reducers/header-reducer";
import {ChordCanvasActions, reduceChordCanvas} from "./reducers/chord-canvas-reducer";
import {FooterActions, reduceFooter} from "./reducers/footer-reducer";

export type Action =
  HeaderActions
    | ChordCanvasActions
    | FooterActions
  | IgnoredAction
  ;

// const subReducer = subReducersFor<State>();
const computed = computedFor<State>();

export class ReactRoot extends React.Component<{}, typeof initialState> {

  constructor(props: ClassAndChildren) {
    super(props);
    this.state = {...initialState};
  }

  reduce = (state: State, action: Action) => {
    return reducerChain(state, action)
      .apply(reduceHeader)
      .apply(reduceFooter)
      .apply(reduceChordCanvas)
      .apply(computed("notes", recomputeAllNotes))
      .apply(computed("chordGrid", recomputeChordGrid))
      .result();
  };

  dispatch = (state: State, action: Action) => {
    let oldState = {...state};
    let newState = this.reduce(oldState, action);
    this.setState(newState);
  };

  render() {
    let state: State = {...this.state};
    let RootPageContent = RootPage((action) => this.dispatch(state, action));
    return (
      <div>
        {RootPageContent(state)}
      </div>
    )
  }
}

