import {computedFor, reducerChain, subReducersFor} from "./reducers";
import {reduceNavigation} from "../reducers/router-reducer";
import {InputChange, reduceInputs} from "../reducers/input-reducer";
import {LogInActions, reduceLogin} from "../reducers/login-reducer";
import {HeaderActions, reduceHeader} from "../reducers/header-reducer";
import {ChordToolsActions, reduceChordTools} from "../reducers/chord-tools-reducer";
import {FooterActions, reduceFooter} from "../reducers/footer-reducer";
import {ChordCanvasActions, reduceChordCanvas} from "../reducers/chord-grid-reducer";
import {recomputeAllNotes} from "../reducers/recompute-all-notes";
import {recomputeChordGrid} from "../reducers/recompute-chord-grid";
import {State} from "../state";
import {ServicesActions} from "./services/service";
import {NavigationActions} from "./services/navigation-service";
import {reduceStripe, StripeActions} from "../reducers/stripe-reducer";
import {reduceToggle, ToggleAction} from "../reducers/toggle-reducer";
import {ChordMapperActions, reduceChordMapper} from "../reducers/chord-mapper-reducer";

const subReducer = subReducersFor<State>();
const computed = computedFor<State>();

export type Action =
  ServicesActions
  | HeaderActions
  | ChordCanvasActions
  | FooterActions
  | ChordToolsActions
  | NavigationActions
  | InputChange
  | ToggleAction
  | LogInActions
  | StripeActions
  | ChordMapperActions
  ;


export const rootReducer = (state: State, action: Action) => {
  return reducerChain(state, action)
    .apply(reduceNavigation)
    .apply(subReducer("inputs", reduceInputs))
    .apply(subReducer("toggles", reduceToggle))
    .apply(reduceLogin)
    .apply(reduceHeader)
    .apply(reduceChordTools)
    .apply(reduceFooter)
    .apply(reduceChordCanvas)
    .apply(reduceChordMapper)
    .apply(reduceStripe)
    .apply(computed("notes", recomputeAllNotes))
    .apply(computed("chordGrid", recomputeChordGrid))
    .result();
};