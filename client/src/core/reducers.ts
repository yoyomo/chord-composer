import React from "react";
import {Action} from "./root-reducer";
import {Effect} from "./services/services";

export interface ClassAndChildren {
  className?: string,
  children?: React.ReactNode
}
export type IgnoredAction = { type: '' };
export type IgnoredSideEffect = { effectType: '' };
export type GlobalAction = { type: string };
export type SideEffect = { effectType: string };
export type ReductionWithEffect<State extends Object> = { state: State, effects?: Effect[] | void};
export type Reducer <State> = (state: State, action: Action) => ReductionWithEffect<State>

export interface ReducerChain<S> {
  result: () => { state: S, effects: Effect[] }
  apply: (reducer: Reducer<S>) => ReducerChain<S>
}

export function reducerChain<State>(state: State, action: Action,
                                    effects: Effect[] = []): ReducerChain<State> {
  const chainer: ReducerChain<State> = {
    apply: (reducer: Reducer<State>) => {
      let reduction = reducer(state, action);
      effects = effects.concat(reduction.effects || []);
      state = reduction.state;
      return chainer;
    },

    result: () => {
      return {state, effects};
    }
  };

  return chainer;
}

export function subReducersFor<State>() {
  return function subReducer<Key extends keyof State>(key: Key, reducer: Reducer<State[Key]>): Reducer<State> {
    return (state: State, action: Action) => {
      let reduction = reducer(state[key], action);
      if (reduction.state !== state[key]) {
        state = {...(state as any)};
        state[key] = reduction.state;
      }
      return {state, effects: reduction.effects};
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
      return {state};
    }
  }
}
