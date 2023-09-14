import {createSelector} from '@ngrx/store';
import {SearchAppState, stateSelector} from './index';
import {LeftPanelState} from '../reducers/left-panel.reducer';

const searchFeatureSelector = createSelector(stateSelector, (state: SearchAppState) => {
  return state.leftPanel;
});

export const getPanelSelector = createSelector(searchFeatureSelector, (state: LeftPanelState) => state.showPanel);
