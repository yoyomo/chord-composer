import {AjaxAction, RequestAjaxEffect, withAjax} from "./ajax-service";
import {inferBasePath, NavigationEffect, withHistory} from "./navigation-service";
import {Action} from "../root-reducer";
import {ClearInputDebouncing} from "./input-debouncing-service";
import {withStripe} from "./stripe-service";
let createBrowserHistory = require("history").createBrowserHistory;

export type Effect =
  RequestAjaxEffect
  | NavigationEffect
  | ClearInputDebouncing
  ;

export type Service = (effect: Effect) => void

export type ServicesActions =
  AjaxAction
  ;
export function getCoreServices(dispatch: (action: Action) => void): Service[] {
  let services: Service[] = [];

  services.push(withAjax(dispatch, 6));
  services.push(withHistory(dispatch, createBrowserHistory({basename: inferBasePath()})));
  services.push(withStripe(dispatch));

  return services;
}
