import {createSelector} from '@ngrx/store';
import {SearchAppState, stateSelector} from './index';
import {BusinessListState} from '../reducers/businessList.reducer';

export const tailorsListSelector = createSelector(stateSelector, (state: SearchAppState) => state.list);

export const tailorsListFeatureSelector = createSelector(tailorsListSelector, (state: BusinessListState) => state.tailorsList);
