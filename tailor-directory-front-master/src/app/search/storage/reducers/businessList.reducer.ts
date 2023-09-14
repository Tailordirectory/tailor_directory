import {Action, createReducer, on} from '@ngrx/store';
import * as fromActions from '../actions/tailorsList.actions';
import {BusinessModel} from '../../../models/business.model';

export interface BusinessListState {
  tailorsList: BusinessModel[];
  isLoaded: boolean;
  isLoading: boolean;
}

export const tailorsListInitState: BusinessListState = {
  tailorsList: [],
  isLoaded: false,
  isLoading: false
};

const reducer = createReducer(tailorsListInitState,
  on(fromActions.getTailorsList, state => state),
  on(fromActions.loadingTailorsList, state => ({...state, isLoading: true, isLoaded: false})),
  on(fromActions.loadedTailorsList, (state, {list}) => ({...state, tailorsList: list, isLoaded: true, isLoading: false})));


export function listReducer(state: BusinessListState | undefined, action: Action) {
  return reducer(state, action);
}
