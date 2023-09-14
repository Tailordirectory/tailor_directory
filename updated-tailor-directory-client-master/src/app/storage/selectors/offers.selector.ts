import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AppState} from './index';
import {OffersState} from '../reducers/offers.reducer';

const stateSelector = createFeatureSelector<AppState, OffersState>('offersModal');

export const getOffersState = createSelector(stateSelector, (state => state));
export const getOffers = createSelector(stateSelector, (state => state.offers));
export const getModal = createSelector(stateSelector, (state => state.showModal));
