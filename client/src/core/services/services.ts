import {AjaxAction, withAjax} from "./ajax-services";
import {Action, Effect} from "../../react-root";
import {inferBasePath, withHistory} from "./navigation-services";
let createBrowserHistory = require("history").createBrowserHistory;


export type Service = (effect: Effect) => void

export type ServicesActions =
  AjaxAction
  ;
export function getCoreServices(dispatch: (action: Action) => void): Service[] {
  let services: Service[] = [];

  services.push(withAjax(dispatch, 6));
  services.push(withHistory(dispatch, createBrowserHistory({basename: inferBasePath()})));

  return services;
}
