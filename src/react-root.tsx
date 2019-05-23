import React from 'react';
import {initialState, recomputeAllNotes, State} from "./state";
import {
  recomputeChordGrid,
  reduceRootPage, RootPageAction,
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

// export function subReducersFor<State>() {
//   return function subReducer<Key extends keyof State>(key: Key, reducer: Reducer<State[Key]>): Reducer<State> {
//     return (state: State, action: Action) => {
//       let reduction = reducer(state[key], action);
//       if (reduction !== state[key]) {
//         state = {...(state as any)};
//         state[key] = reduction;
//       }
//       return state;
//     }
//   }
// }

export function computedFor<State>() {
  return function computed<Key extends keyof State>(key: Key, compute: (s: State) => State[Key]): Reducer<State> {
    return (state: State) => {
      let next = compute(state);
      if (next !== state[key]) {
        state = {...(state as any)};
        state[key] = next;
      }
      return state;
    }
  }
}

// const subReducer = subReducersFor<State>();
const computed = computedFor<State>();

export function reduce(state: State, action: Action) {
  return reducerChain(state, action)
    .apply(reduceRootPage)
    .apply(computed("notes", recomputeAllNotes))
    .apply(computed("chordGrid", recomputeChordGrid))
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
    let RootPageContent = RootPage(this.dispatch);
    return (
      <div>
        {RootPageContent(state)}
      </div>
    )
  }
}

