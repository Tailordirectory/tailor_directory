import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AppState} from './index';
import {GeolocationState} from '../reducers/geolocation.reducer';

const stateSelector = createFeatureSelector<AppState, GeolocationState>('geolocation');

export const getGeolocationSelector = createSelector(stateSelector, (state) => state);
