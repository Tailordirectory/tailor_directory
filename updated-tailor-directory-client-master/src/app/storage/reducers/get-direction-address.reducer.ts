import {Action, createReducer, on} from '@ngrx/store';
import * as fromActions from '../actions/direction-address.actions';
import {BusinessModel} from '../../models/business.model';

export interface GetDirectionAddressState {
  showModal: boolean;
  dType: string;
  direction: google.maps.LatLng | null;
  business: BusinessModel | null;
}

const getDirectionAddressDefaultStore: GetDirectionAddressState = {
  showModal: false,
  dType: '',
  direction: null,
  business: null
};

const reducer = createReducer(getDirectionAddressDefaultStore,
  on(fromActions.showDirectionAddressAction, ((state, {business}) => ({...state, showModal: true, business}))),
  on(fromActions.hideDirectionAddressAction, ((state, {dType, direction}) => ({
    ...state,
    showModal: false,
    dType,
    direction
  }))),
);

export function getDirectionAddressReducer(state: GetDirectionAddressState | undefined, action: Action) {
  return reducer(state, action);
}
