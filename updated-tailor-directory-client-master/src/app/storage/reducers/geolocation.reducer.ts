import {Action, createReducer, on} from '@ngrx/store';
import * as fromActions from '../actions/geolocation.action';

export interface GeolocationState {
  position: Position | null;
  hasAccess: boolean;
}

const geolocationInitState: GeolocationState = {
  position: null,
  hasAccess: true
};

const reducer = createReducer(geolocationInitState,
  on(fromActions.getGeolocation, state => state),
  on(fromActions.setGeolocation, (state, {position, hasError}) => ({...state, hasAccess: !hasError, position}))
);

export function geolocationReducer(state: GeolocationState | undefined, action: Action) {
  return reducer(state, action);
}
