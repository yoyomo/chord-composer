import React from "react";
import {Action} from "../react-root";

export interface ClassAndChildren {
  className?: string,
  children?: React.ReactNode
}
export type IgnoredAction = { type: '' };

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

export function subReducersFor<State>() {
  return function subReducer<Key extends keyof State>(key: Key, reducer: Reducer<State[Key]>): Reducer<State> {
    return (state: State, action: Action) => {
      let reduction = reducer(state[key], action);
      if (reduction !== state[key]) {
        state = {...(state as any)};
        state[key] = reduction;
      }
      return state;
    }
  }
}

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