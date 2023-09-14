import {createAction, props} from '@ngrx/store';

export const getSearchDataAction = createAction('[Search - Get Action]');
export const setSearchDataAction = createAction('[Search - Set Action]',
  props<{
    search: {
      distance: string;
      country: string;
      city: string;
      address: string;
      formattedAddress: string;
      tags: string[];
    },
    direction: {
      lat: number,
      long: number,
    }
  }>());
export const updateSearchDataAction = createAction('[Search - Update Action]',
  props<{
    search: {
      distance: string;
      country: string;
      city: string;
      address: string;
      tags: string[];
      formattedAddress: string;
    },
    direction: {
      lat: number,
      long: number,
    }
  }>());
export const updateAddressAction = createAction('[Search - Update Address Action]',
  props<{
    search: {
      distance: string;
      country: string;
      city: string;
      address: string;
      formattedAddress: string;
    }
  }>());
export const updateFilterAction = createAction('[Search - Update Filter Action]',
  props<{
    filter: {
      tags: string[];
      businessType: string;
      distance: string;
    }
  }>());
export const updateDistanceAction = createAction('[Search - Update Zoom Action]',
  props<{
    search: {
      distance: string;
    }
  }>());

export const loadResultsActions = createAction('[Search - Load Results Action]');
