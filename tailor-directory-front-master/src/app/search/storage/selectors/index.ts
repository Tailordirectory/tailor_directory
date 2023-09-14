import {SearchState} from '../reducers/search.reducer';
import {BusinessListState} from '../reducers/businessList.reducer';
import {createFeatureSelector} from '@ngrx/store';
import {BusinessProfileState} from '../reducers/business-profile.reducer';
import {LeftPanelState} from '../reducers/left-panel.reducer';

export interface SearchAppState {
  search: SearchState;
  list: BusinessListState;
  businessProfile: BusinessProfileState;
  leftPanel: LeftPanelState;
}

interface State {
  searchState: SearchAppState;
}

export const stateSelector = createFeatureSelector<SearchAppState>('searchState');
