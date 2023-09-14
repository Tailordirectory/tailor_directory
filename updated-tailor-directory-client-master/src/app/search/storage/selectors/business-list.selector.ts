import {createSelector} from '@ngrx/store';
import {SearchAppState, stateSelector} from './index';
import {BusinessListState} from '../reducers/businessList.reducer';

export const businessListSelector = createSelector(stateSelector, (state: SearchAppState) => state.list);

export const businessListFeatureSelector = createSelector(businessListSelector, (state: BusinessListState) => state.businessList);
