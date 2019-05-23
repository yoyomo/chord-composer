export interface InputChange<T> {
  type: 'input-change',
  target: Extract<keyof T, string>,
  text: string
}

export function inputChange<T>(target: Extract<keyof T, string>, text: string): InputChange<T> {
  return {
    type: "input-change",
    target,
    text
  };
}

export function inputChangeDispatcher<T, S = string>(dispatch: (a: InputChange<T>) => void,
                                                     target: Extract<keyof T, string>, value?: S) {
  return (e: EventInput) => {
    e.stopPropagation();
    dispatch(inputChange<T>(target, value === undefined ? e.target.value : value));
  }
}

export interface EventInput {
  stopPropagation: () => void,
  target: any
}

export interface InputMap {
  [k: string]: string
}

export function reduceInputs<T extends InputMap>(state: InputMap, a: InputChange<T>): InputMap{
  switch (a.type) {
    case 'input-change':
      if (state[a.target] === a.text) break;
      state = {...state};
      state[a.target] = a.text;
      break;
  }

  return state;
}
