import {AjaxAction, RequestAjaxEffect, withAjax} from "./ajax-service";
import {inferBasePath, NavigationEffect, withHistory} from "./navigation-service";
import {Action} from "../root-reducer";
import {ClearInputDebouncing} from "./input-debouncing-service";
import {GetStripeEffect, withStripe} from "./stripe-service";
import {SetTimerEffect, withTimer} from "./timer-service";
import {ExternalInputEffects, withExternalInput} from "./external-input-service";
import { PlaySoundEffect, withSound } from "./sound-service";
let createBrowserHistory = require("history").createBrowserHistory;

export type Effect =
  RequestAjaxEffect
  | NavigationEffect
  | ClearInputDebouncing
  | GetStripeEffect
  | SetTimerEffect
  | PlaySoundEffect
  | ExternalInputEffects
  ;

export type Services = (effect: Effect) => void

export type ServicesActions =
  AjaxAction
  ;
export function getCoreServices(dispatch: (action: Action) => void): Services[] {
  let services: Services[] = [];

  services.push(withAjax(dispatch));
  services.push(withHistory(dispatch, createBrowserHistory({basename: inferBasePath()})));
  services.push(withStripe(dispatch));
  services.push(withTimer(dispatch));
  services.push(withExternalInput(dispatch));
  services.push(withSound(dispatch));

  return services;
}