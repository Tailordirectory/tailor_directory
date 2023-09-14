import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AppState} from './index';
import {BusinessTypeSate} from '../reducers/business-type.reducer';

const businessSelector = createFeatureSelector<AppState, BusinessTypeSate>('businessTypes');

export const getListSelector = createSelector(businessSelector, state => state.list);
export const getStateSelector = createSelector(businessSelector, state => state);
export const getLoadedSelector = createSelector(businessSelector, state => state.loaded);
export const getLoadingSelector = createSelector(businessSelector, state => state.loading);
