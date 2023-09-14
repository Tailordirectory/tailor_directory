import {searchReducer} from './search.reducer';
import {listReducer} from './businessList.reducer';
import {businessProfileReducer} from './business-profile.reducer';
import {panelReducer} from './left-panel.reducer';

export const searchReducers = {
  search: searchReducer,
  list: listReducer,
  businessProfile: businessProfileReducer,
  leftPanel: panelReducer
};
