import {UserState} from '../reducers/user.reducer';
import {createSelector} from '@ngrx/store';
import {AppState} from './index';

export const userStateFeature = (state: AppState) => state.user;

export const getUserSelector = createSelector(userStateFeature, (state: UserState) => state.user);
export const getUserLoadedSelector = createSelector(userStateFeature, (state: UserState) => state.loaded);
