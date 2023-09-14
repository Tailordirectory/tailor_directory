import {Action, createReducer, on} from '@ngrx/store';
import * as searchActions from '../actions/search.actions';

export interface SearchState {
  distance: string;
  country: string;
  city: string;
  address: string;
  formattedAddress: string;
  tags: string[];
  businessType: string;
  lat: number;
  long: number;
  updated: boolean;
}

export const initSearchState: SearchState = {
  distance: '10',
  country: '',
  city: '',
  address: '',
  formattedAddress: '',
  tags: [],
  businessType: '',
  lat: 0,
  long: 0,
  updated: false
};

const reducer = createReducer(initSearchState,
  on(searchActions.getSearchDataAction, state => state),
  on(searchActions.setSearchDataAction, (state, {search, direction}) => ({
    ...state,
    distance: search.distance,
    country: search.country,
    city: search.city,
    address: search.address,
    formattedAddress: search.formattedAddress,
    tags: search.tags,
    businessType: state.businessType,
    lat: direction.lat,
    long: direction.long,
    updated: true
  })),
  on(searchActions.updateSearchDataAction, (state, {search, direction}) => ({
    ...state,
    distance: search.distance,
    country: search.country,
    city: search.city,
    address: search.address,
    formattedAddress: search.formattedAddress,
    tags: search.tags,
    businessType: state.businessType,
    lat: direction.lat,
    long: direction.long,
    updated: true
  })),
  on(searchActions.updateAddressAction, (state, {search}) => ({
    ...state,
    distance: search.distance,
    country: search.country,
    city: search.city,
    address: search.address,
    formattedAddress: search.formattedAddress,
    tags: state.tags,
    businessType: state.businessType,
    lat: state.lat,
    long: state.long,
    updated: true
  })),
  on(searchActions.updateDistanceAction, (state, {search}) => ({
    ...state,
    distance: search.distance,
    country: state.country,
    city: state.city,
    address: state.address,
    formattedAddress: state.formattedAddress,
    tags: state.tags,
    businessType: state.businessType,
    lat: state.lat,
    long: state.long,
    updated: true
  })),

  on(searchActions.updateFilterAction, (state, {filter}) => ({
    ...state,
    distance: filter.distance,
    country: state.country,
    city: state.city,
    address: state.address,
    formattedAddress: state.formattedAddress,
    tags: filter.tags,
    businessType: filter.businessType,
    lat: state.lat,
    long: state.long,
    updated: true
  }))
);

export function searchReducer(state: SearchState | undefined, action: Action) {
  return reducer(state, action);
}
