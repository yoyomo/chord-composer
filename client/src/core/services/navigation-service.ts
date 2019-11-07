import { ReductionWithEffect } from "../reducers";
import { Effect, Services } from "./services";
import { Action } from "../root-reducer";

export interface PathLocation {
  pathname: string,
  search: string,
  hash: string,
}

export interface HistoryPush {
  effectType: 'history-push',
  location: PathLocation
}

const locationDefaults: PathLocation = {
  pathname: "",
  search: "",
  hash: "",
};

export function historyPush(location: Partial<PathLocation>): HistoryPush {
  return { effectType: "history-push", location: { ...locationDefaults, ...location } }
}

export type NavigationActions = Visit | LinkClick
export type NavigationEffect = HistoryPush;

export type Visit = {
  type: 'visit',
  noHistory?: boolean,
  location: PathLocation
}

export function visit(location: Partial<PathLocation>): Visit {
  return { type: "visit", location: { ...locationDefaults, ...location } };
}

export type LinkClick = {
  type: 'link-click',
  location: PathLocation
}

export function linkClick(location: PathLocation): LinkClick {
  let { pathname, search, hash } = location;
  return {
    type: 'link-click',
    location: { pathname, search, hash }
  }
}

export interface HistoryProvider {
  push(location: PathLocation): void
  listen(callback: (location: PathLocation, action: string) => void): () => void
  location: PathLocation
}

export function withHistory(dispatch: (action: Action) => void, history: HistoryProvider): Services {

  history.listen((location, action) => {
    dispatch(visit(location));
  });

  return (effect: Effect) => {
    switch (effect.effectType) {
      case 'history-push':
        history.push(effect.location);
        break;
    }
  }
}

export function navigationReducer<State extends Object>(route: (state: State,
  pathLocation: PathLocation) => ReductionWithEffect<State>) {
  return (state: State, action: Action): ReductionWithEffect<State> => {
    let effects: Effect[] = [];

    switch (action.type) {
      case 'visit':
        let reduction = route(state, action.location);
        if (reduction.effects) {
          effects = effects.concat(reduction.effects);
        }
        state = reduction.state;
        break;

      case 'link-click':
        effects = effects.concat(historyPush(action.location));
        break;
    }

    return { state, effects };
  }
}

export function inferBasePath(): string {
  let tags = document.getElementsByTagName("BASE");
  if (tags.length === 0) return "/";

  let parts = (tags[tags.length - 1] as HTMLBaseElement).href.split("/");
  return "/" + parts.slice(3).join("/");
}

export function visitDispatcher(dispatch: (a: Action) => void) {
  return ((event: { preventDefault(): void, target: any }) => {
    let anchorElement = (event.target as HTMLAnchorElement);

    while (anchorElement.parentElement && anchorElement.tagName !== "A") {
      anchorElement = anchorElement.parentElement as HTMLAnchorElement;
    }

    let { pathname, search, hash } = anchorElement;

    if (pathname[0] !== '/') pathname = '/' + pathname;

    let basePath = inferBasePath();
    if (pathname.slice(0, basePath.length) === basePath) {
      pathname = "/" + pathname.slice(basePath.length);
    }

    dispatch(linkClick({ pathname, search, hash }));
    event.preventDefault();
  });
}