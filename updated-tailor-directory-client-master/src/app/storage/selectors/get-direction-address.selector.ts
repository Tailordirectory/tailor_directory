import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AppState} from './index';
import {GetDirectionAddressState} from '../reducers/get-direction-address.reducer';

const directionAddressSelector = createFeatureSelector<AppState, GetDirectionAddressState>('directionAddress');

export const showDirectionAddressModalSelector = createSelector(directionAddressSelector, state => state);
