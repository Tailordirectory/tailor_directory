import {Action, createReducer, on} from '@ngrx/store';
import * as fromActions from '../actions/offers.action';
import {AccountRestrictions} from '../../models/business.model';

export interface OffersState {
  showModal: boolean;
  offers: { [key: string]: AccountRestrictions };
  loading: boolean;
  loaded: boolean;
}

const offerStateInit: OffersState = {
  showModal: false,
  offers: {},
  loading: false,
  loaded: false
};

const reducer = createReducer(
  offerStateInit,
  on(fromActions.showOffersModal, (state => ({...state, showModal: true}))),
  on(fromActions.hideOffersModal, (state => ({...state, showModal: false}))),
  on(fromActions.loadedOffers, (state, {accounts}) => ({...state, offers: accounts, loaded: true, loading: false})),
  on(fromActions.loadingOffers, (state => ({...state, loading: true, loaded: false}))),
  on(fromActions.getOffers, (state => state))
);

export function offersReducer(state: OffersState | undefined, action: Action) {
  return reducer(state, action);
}
