import {Action, createReducer, on} from '@ngrx/store';
import * as formActions from '../actions/business-type.actions';
import {BusinessTypesModel} from '../../models/business-types.model';

export interface BusinessTypeSate {
  list: BusinessTypesModel[];
  loaded: boolean;
  loading: boolean;
}

const businessTypeDefaultStore: BusinessTypeSate = {
  list: [],
  loaded: false,
  loading: false
};

const reducer = createReducer(businessTypeDefaultStore,
  on(formActions.getListBusinessTypeAction, (state => state)),
  on(formActions.loadBusinessTypeAction, (state => state)),
  on(formActions.loadedBusinessTypeAction, ((state, {list}) => ({...state, list, loaded: true, loading: false}))),
);

export function businessTypesReducer(state: BusinessTypeSate | undefined, action: Action) {
  return reducer(state, action);
}
