import {createSelector} from '@ngrx/store';
import {stateSelector} from './index';

const stateFeatureSelector = createSelector(stateSelector, state => state.businessProfile);

export const getBusinessProfileSelector = createSelector(stateFeatureSelector, state => state);
export const getBusinessProfileStatusSelector = createSelector(stateFeatureSelector, state => state.isVisible);
