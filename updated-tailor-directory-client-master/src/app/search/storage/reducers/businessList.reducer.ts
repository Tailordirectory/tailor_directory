import {Action, createReducer, on} from '@ngrx/store';
import * as fromActions from '../actions/businessList.actions';
import {BusinessModel} from '../../../models/business.model';

export interface BusinessListState {
  businessList: BusinessModel[];
  isLoaded: boolean;
  isLoading: boolean;
}

export const businessListInitState: BusinessListState = {
  businessList: [],
  isLoaded: false,
  isLoading: false
};

const reducer = createReducer(businessListInitState,
  on(fromActions.getBusinessList, state => state),
  on(fromActions.loadingBusinessList, state => ({...state, isLoading: true, isLoaded: false})),
  on(fromActions.loadedBusinessList, (state, {list}) => ({...state, businessList: list, isLoaded: true, isLoading: false})));


export function listReducer(state: BusinessListState | undefined, action: Action) {
  return reducer(state, action);
}
