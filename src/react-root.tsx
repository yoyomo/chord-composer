import React from 'react';
import {initialState, State} from "./state";
import {
  recomputeChords,
  recomputeChordType,
  recomputeVariations, removeVariations, RootPageAction,
} from "./reducers/root-page-reducer";
import {RootPage} from "./views/root-page";

export interface ClassAndChildren {
  className?: string,
  children?: React.ReactNode
}
export type IgnoredAction = { type: '' };

export type Action =
  RootPageAction
  | IgnoredAction
  ;

export type Reducer<State> = (state: State, action: Action) => State

export interface ReducerChain<S> {
  result: () => S
  apply: (reducer: Reducer<S>) => ReducerChain<S>
}

export function reducerChain<State>(state: State, action: Action): ReducerChain<State> {
  const chainer: ReducerChain<State> = {
    apply: (reducer: Reducer<State>) => {
      state = reducer(state, action);
      return chainer;
    },

    result: () => {
      return state;
    }
  };

  return chainer;
}

export function reduce(state: State, action: Action) {
  return reducerChain(state, action)
    .apply(recomputeChords)
    .apply(recomputeVariations)
    .apply(removeVariations)
    .apply(recomputeChordType)
    .result();
}

export class ReactRoot extends React.Component<{}, typeof initialState> {

  constructor(props: ClassAndChildren) {
    super(props);
    this.state = {...initialState};
  }

  dispatch = (action: Action) => {
    let oldState = {...this.state};
    let newState = reduce(oldState, action);
    this.setState(newState);
  };

  render() {
    let state: State = {...this.state};
    let RootPageContent = RootPage.render(this.dispatch);
    return (
      <div>
        {RootPageContent(state)}
      </div>
    )
  }
}

