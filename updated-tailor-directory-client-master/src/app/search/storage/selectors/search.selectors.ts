import {SearchState} from '../reducers/search.reducer';
import {createSelector} from '@ngrx/store';
import {SearchAppState, stateSelector} from './index';

const searchFeatureSelector = createSelector(stateSelector, (state: SearchAppState) => {
  return state.search;
});

export const getSearchSelector = createSelector(searchFeatureSelector, (state: SearchState) => state);
export const getAddressSelector = createSelector(searchFeatureSelector, (state: SearchState) => {
  return state.updated ? {
    address: state.address,
    distance: state.distance,
  } : null;
});
export const getGeocodingSelector = createSelector(searchFeatureSelector, (state: SearchState) => {
  return state.updated ? {
    lat: state.lat,
    long: state.long,
  } : null;
});
